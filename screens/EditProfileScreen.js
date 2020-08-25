import React, {useCallback, useContext, useRef, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {StoreContext} from '../store/StoreContext';
import {Form, Item, Textarea, Button, Text} from 'native-base';
import {
  DEFAULT_PROFILE_PICTURE,
  PROFILE_IMAGE_OPTIONS,
  VALIDATIONS,
} from '../constants';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Image, Input} from '../components';
import {uuid} from 'uuidv4';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../styles/common';
import {buttonStyles, inputStyles} from '../styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PICKER_ITEMS = ['Camera', 'Gallery', 'Cancel'];

const EditProfileScreen = props => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(StoreContext);
  const actionSheetRef = useRef(null);
  const [paypal, setPaypal] = useState(user.paypalEmail || '');
  const [bio, setBio] = useState(user.biography || '');
  const [instagram, setInstagram] = useState(user.instagram || '');
  const [twitter, setTwitter] = useState(user.twitter || '');
  const [facebook, setFacebook] = useState(user.facebook || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || null);
  const [errors, setErrors] = useState({});

  const handleChangePicture = useCallback(() => {
    actionSheetRef && actionSheetRef.current && actionSheetRef.current.show();
  }, []);

  const handleSelectImageOption = useCallback(
    async idx => {
      try {
        // idx 0 is camera, 1 is gallery
        const image =
          idx === 0
            ? await ImagePicker.openCamera({
                ...PROFILE_IMAGE_OPTIONS,
                useFrontCamera: true,
              })
            : idx === 1
            ? await ImagePicker.openPicker(PROFILE_IMAGE_OPTIONS)
            : null;
        image && setPhotoUrl(image.path);
      } catch (e) {
        console.log('Picker error', e);
      }
    },
    [actionSheetRef],
  );

  const handleSave = useCallback(async () => {
    try {
      let updateObject = {
        biography: bio,
        paypalEmail: paypal,
        facebook,
        twitter,
        instagram,
      };

      // Upload the new picture to storage if it has changed
      if (photoUrl && photoUrl !== user.photoUrl) {
        // Delete the old picture from storage
        if (user.photoId) {
          storage()
            .ref(`users/${user.photoId}`)
            .delete();
        }

        let downloadUrl = photoUrl;
        const pictureId = uuid();
        const storageRef = storage().ref(`users/${pictureId}`);
        await storageRef.putFile(photoUrl);
        downloadUrl = await storageRef.getDownloadURL();
        updateObject = {
          ...updateObject,
          photoId: pictureId,
          photoUrl: downloadUrl,
        };
      }

      let newErrors = {};
      if (!VALIDATIONS.paypalEmail(paypal)) {
        newErrors.paypalEmail = 'This email is not valid!';
      }

      if (Object.keys(newErrors).length) {
        setErrors(newErrors);
      } else {
        try {
          // Update the DB with the new data
          await firestore()
            .collection('users')
            .doc(user.id)
            .update(updateObject);
          setUser({...user, ...updateObject});
          navigation.goBack();
        } catch (e) {
          Alert.alert(
            'Something went wrong',
            "We couldn't update your information, please try again later :(",
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  }, [
    bio,
    facebook,
    instagram,
    navigation,
    paypal,
    photoUrl,
    setUser,
    twitter,
    user,
  ]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={styles.baseline}>
      <KeyboardAwareScrollView>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleChangePicture}>
            <Image
              source={{uri: photoUrl || DEFAULT_PROFILE_PICTURE}}
              style={styles.image}
            />
            <View style={styles.editTextContainer}>
              <Icon name="edit" size={14} color={colors.lightGrey} />
              <Text style={styles.editText}>Change Profile Picture</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Form style={styles.formContainer}>
          <Item style={[inputStyles.item]}>
            <Input
              autoCompleteType="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              placeholder="PayPal Email"
              value={paypal}
              onChangeText={setPaypal}
              iconName="attach-money"
              maxLength={100}
              error={errors.paypalEmail}
            />
          </Item>
          <Item style={[inputStyles.item, styles.bioInput]}>
            <Input
              autoCapitalize="none"
              placeholder="Biography"
              value={bio}
              onChangeText={setBio}
              multiline={true}
              numberOfLines={4}
              maxLength={250}
            />
          </Item>
          <Item style={[inputStyles.item]}>
            <Input
              autoCapitalize="none"
              placeholder="Instagram Username"
              value={instagram}
              onChangeText={setInstagram}
              iconName="instagram"
              isCommunityIcon
              maxLength={100}
            />
          </Item>
          <Item style={[inputStyles.item]}>
            <Input
              autoCapitalize="none"
              placeholder="Twitter Username"
              value={twitter}
              onChangeText={setTwitter}
              iconName="twitter"
              isCommunityIcon
              maxLength={100}
            />
          </Item>
          <Item style={[inputStyles.item]}>
            <Input
              autoCapitalize="none"
              placeholder="Facebook Page ID"
              value={facebook}
              onChangeText={setFacebook}
              iconName="facebook"
              isCommunityIcon
              maxLength={100}
            />
          </Item>
        </Form>
        <View style={styles.buttonContainer}>
          <Button
            style={[buttonStyles.buttonPrimary, styles.button]}
            onPress={handleSave}>
            <Text style={buttonStyles.buttonPrimaryText}>Save</Text>
          </Button>
          <Button
            style={[buttonStyles.buttonSecondary, styles.button]}
            onPress={handleCancel}>
            <Icon name="arrow-back" color={colors.white} size={22} />
            <Text>Go Back</Text>
          </Button>
        </View>
        <ActionSheet
          ref={actionSheetRef}
          title={'Upload a picture from'}
          options={PICKER_ITEMS}
          cancelButtonIndex={2}
          onPress={handleSelectImageOption}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 120,
  },
  editTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  editText: {
    fontSize: 14,
    color: colors.lightGrey,
    marginLeft: 2,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  formItem: {
    flexDirection: 'column',
  },
  bioInput: {
    paddingBottom: 16,
  },
  buttonContainer: {
    marginHorizontal: 30,
  },
  button: {
    marginBottom: 20,
  },
});

export default EditProfileScreen;
