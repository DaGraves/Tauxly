import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {StoreContext} from '../store/StoreContext';
import {Form, Item, Label, Input, Textarea, Button, Text} from 'native-base';
import {DEFAULT_PROFILE_PICTURE, PROFILE_IMAGE_OPTIONS} from '../constants';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImageCustom from '../components/ImageCustom';
import {uuid} from 'uuidv4';
import {useNavigation} from '@react-navigation/native';

const PICKER_ITEMS = ['Camera', 'Gallery', 'Cancel'];

const EditProfileScreen = props => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(StoreContext);
  const actionSheetRef = useRef(null);
  const [paypal, setPaypal] = useState(user.paypalEmail || '');
  const [bio, setBio] = useState(user.biography || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || null);

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

      // Update the DB with the new data
      await firestore()
        .collection('users')
        .doc(user.id)
        .update(updateObject);
      setUser({...user, ...updateObject});
      navigation.goBack();
    } catch (e) {
      console.log('Error', e);
    }
  }, [bio, paypal, photoUrl, setUser, user]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleChangePicture}>
        <ImageCustom
          source={{uri: photoUrl || DEFAULT_PROFILE_PICTURE}}
          style={styles.image}
        />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        title={'Upload a picture from'}
        options={PICKER_ITEMS}
        cancelButtonIndex={2}
        onPress={handleSelectImageOption}
      />
      <Form>
        <Item>
          <Label>PayPal Email</Label>
          <Input value={paypal || ''} onChangeText={setPaypal} />
        </Item>
        <Item>
          <Label>Bio</Label>
          <Textarea
            value={bio || ''}
            style={styles.container}
            rowSpan={4}
            bordered={false}
            underline={false}
            onChangeText={setBio}
          />
        </Item>
      </Form>
      <Button onPress={handleSave}>
        <Text>Save</Text>
      </Button>
      <Button onPress={handleCancel}>
        <Text>Cancel</Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
});

export default EditProfileScreen;
