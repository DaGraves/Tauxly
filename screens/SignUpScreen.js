import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {Item, Input, Button, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {StoreContext} from '../store/StoreContext';
import ActionSheet from 'react-native-actionsheet';
import {uuid} from 'uuidv4';
import {DEFAULT_PROFILE_PICTURE, PROFILE_IMAGE_OPTIONS} from '../constants';

const DEFAULT_STATE = {
  email: '',
  paypalEmail: '',
  username: '',
  password: '',
  passwordConfirm: '',
};

const PICKER_ITEMS = ['Camera', 'Gallery', 'Cancel'];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(StoreContext);
  const actionSheetRef = useRef(null);
  const [state, setState] = useState(DEFAULT_STATE);
  const [profilePicture, setProfilePicture] = useState(null);

  const onChange = useCallback(
    (name, value) => {
      setState({
        ...state,
        [name]: value,
      });
    },
    [state],
  );

  const onSignUp = useCallback(async () => {
    const {email, password, paypalEmail, username, passwordConfirm} = state;
    if (password === passwordConfirm) {
      try {
        const result = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const {uid} = result.user;
        await result.user.sendEmailVerification();

        const pictureId = uuid();
        let downloadUrl = null;
        if (profilePicture) {
          const storageRef = storage().ref(`users/${pictureId}`);
          await storageRef.putFile(profilePicture);
          downloadUrl = await storageRef.getDownloadURL();
        }

        const userData = {
          email,
          paypalEmail,
          username,
          photoUrl: downloadUrl,
          photoId: downloadUrl ? pictureId : null,
        };
        await firestore()
          .collection('users')
          .doc(uid)
          .set(userData);
        setUser(userData);
      } catch (e) {
        console.log('ERROR', e);
      }
    } else {
      console.log('Passwords not a match');
    }
  }, [state, profilePicture]);

  const handleSelectImage = useCallback(() => {
    actionSheetRef && actionSheetRef.current && actionSheetRef.current.show();
  }, [actionSheetRef]);

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
        image && setProfilePicture(image.path);
      } catch (e) {
        console.log('Picker error', e);
      }
    },
    [actionSheetRef],
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleSelectImage}>
          <Image
            source={{uri: profilePicture || DEFAULT_PROFILE_PICTURE}}
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
        <Item>
          <Input
            autoCompleteType="email"
            placeholder="Email"
            value={state.email}
            onChangeText={val => onChange('email', val)}
          />
        </Item>
        <Item>
          <Input
            autoCompleteType="email"
            placeholder="PayPal Email"
            value={state.paypalEmail}
            onChangeText={val => onChange('paypalEmail', val)}
          />
        </Item>
        <Item>
          <Input
            placeholder="Username"
            value={state.username}
            onChangeText={val => onChange('username', val)}
          />
        </Item>
        <Item>
          <Input
            secureTextEntry
            autoCompleteType="password"
            placeholder="Password"
            value={state.password}
            blurOnSubmit={false}
            onChangeText={val => onChange('password', val)}
          />
        </Item>
        <Item>
          <Input
            secureTextEntry
            autoCompleteType="password"
            placeholder="Repeat Password"
            value={state.passwordConfirm}
            blurOnSubmit={false}
            onChangeText={val => onChange('passwordConfirm', val)}
          />
        </Item>
        <Button primary style={styles.button} onPress={onSignUp}>
          <Text>Sign Up!</Text>
        </Button>
        <Button
          light
          style={styles.button}
          onPress={() => navigation.navigate('LogIn')}>
          <Text>I already have an account</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  avatarContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  button: {
    marginTop: 20,
  },
});

export default SignUpScreen;
