import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {Item, Button, Text, Form, CheckBox} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {StoreContext} from '../store/StoreContext';
import ActionSheet from 'react-native-actionsheet';
import {uuid} from 'uuidv4';
import {
  DEFAULT_PROFILE_PICTURE,
  PROFILE_IMAGE_OPTIONS,
  VALIDATIONS,
} from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GradientBackground, Input} from '../components';
import {colors} from '../styles/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {buttonStyles, inputStyles} from '../styles';
import moment from 'moment';

const DEFAULT_STATE = {
  email: '',
  paypalEmail: '',
  username: '',
  password: '',
  passwordConfirm: '',
  termsAccepted: false,
};

const PICKER_ITEMS = ['Camera', 'Gallery', 'Cancel'];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(StoreContext);
  const actionSheetRef = useRef(null);
  const [state, setState] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const {email, password, paypalEmail, username, passwordConfirm} = state;
    let newErrors = {};
    if (!VALIDATIONS.email(email)) {
      newErrors.email = 'Email address not valid!';
    }
    if (!VALIDATIONS.paypalEmail(paypalEmail)) {
      newErrors.paypalEmail = 'Paypal email address not valid!';
    }
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'The passwords do not match!';
    }
    if (!VALIDATIONS.username(username)) {
      newErrors.username = 'Username is not valid!';
    }
    if (!VALIDATIONS.password(password)) {
      newErrors.password = 'The password is too short!';
    }
    if (!VALIDATIONS.passwordConfirm(passwordConfirm)) {
      newErrors.passwordConfirm = 'The password confirmation is too short!';
    }

    if (!Object.keys(newErrors).length) {
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
          termsAccepted: moment()
            .utc()
            .unix(),
        };
        await firestore()
          .collection('users')
          .doc(uid)
          .set(userData);
        setUser(userData);
      } catch (e) {
        setErrors({password: 'Invalid Email or Password!'});
      }
    } else {
      setErrors(newErrors);
    }
    setLoading(false);
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
    <GradientBackground>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView style={styles.container}>
          <View>
            <Text style={styles.title}>
              Create a new{' '}
              <Text style={[styles.title, styles.yellowColor]}>Tauxlly</Text>{' '}
              account!
            </Text>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleSelectImage}>
              {profilePicture ? (
                <Image
                  source={{uri: profilePicture || DEFAULT_PROFILE_PICTURE}}
                  style={styles.image}
                />
              ) : (
                <Icon name="face" size={100} color={colors.white} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelectImage}
              style={styles.editPictureTextContainer}>
              <Icon name="edit" size={14} color={colors.yellow} />
              <Text style={styles.editPictureText}>Edit profile picture</Text>
            </TouchableOpacity>
            <ActionSheet
              ref={actionSheetRef}
              title={'Upload a picture from'}
              options={PICKER_ITEMS}
              cancelButtonIndex={2}
              onPress={handleSelectImageOption}
            />
            <Form style={styles.formContainer}>
              <Item style={inputStyles.item}>
                <Input
                  autoCompleteType="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  placeholder="Email"
                  value={state.email}
                  onChangeText={val => onChange('email', val)}
                  iconName="email"
                  maxLength={255}
                  error={errors.email}
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  autoCompleteType="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  placeholder="PayPal Email"
                  value={state.paypalEmail}
                  onChangeText={val => onChange('paypalEmail', val)}
                  iconName="attach-money"
                  maxLength={255}
                  error={errors.paypalEmail}
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  autoCapitalize="none"
                  placeholder="Username"
                  value={state.username}
                  onChangeText={val => onChange('username', val)}
                  iconName="person"
                  maxLength={50}
                  error={errors.username}
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  secureTextEntry
                  autoCompleteType="password"
                  placeholder="Password"
                  value={state.password}
                  blurOnSubmit={false}
                  onChangeText={val => onChange('password', val)}
                  iconName="lock"
                  maxLength={128}
                  error={errors.password}
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  secureTextEntry
                  autoCompleteType="password"
                  placeholder="Repeat Password"
                  value={state.passwordConfirm}
                  blurOnSubmit={false}
                  onChangeText={val => onChange('passwordConfirm', val)}
                  iconName="lock"
                  maxLength={128}
                  error={errors.passwordConfirm}
                />
              </Item>
            </Form>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => onChange('termsAccepted', !state.termsAccepted)}>
              {state.termsAccepted ? (
                <CommunityIcon
                  name="checkbox-marked"
                  size={30}
                  color={colors.white}
                />
              ) : (
                <CommunityIcon
                  name="checkbox-blank-outline"
                  size={30}
                  color={colors.white}
                />
              )}
              <Text style={styles.checkboxText}>
                I agree to the Terms and Conditions!
              </Text>
            </TouchableOpacity>
            <Button
              primary
              disabled={!state.termsAccepted}
              style={[
                buttonStyles.buttonPrimary,
                styles.button,
                !state.termsAccepted && styles.disabled,
              ]}
              onPress={onSignUp}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={buttonStyles.buttonPrimaryText}>
                  Create Account
                </Text>
              )}
            </Button>
            <Button
              light
              style={[buttonStyles.buttonSecondary, styles.button]}
              onPress={() => navigation.navigate('LogIn')}>
              <Icon name="arrow-back" color={colors.white} size={22} />
              <Text style={buttonStyles.buttonSecondaryText}>
                Back to Login
              </Text>
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('TermsAndConditions')}
              style={styles.editPictureTextContainer}>
              <Icon name="chrome-reader-mode" size={14} color={colors.yellow} />
              <Text style={styles.editPictureText}>
                See the Terms and Conditions!
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    paddingHorizontal: 40,
    marginBottom: 6,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
  },
  disabled: {
    backgroundColor: colors.lightGrey,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 30,
    marginTop: 20,
  },
  yellowColor: {
    color: colors.yellow,
  },
  avatarContainer: {
    backgroundColor: colors.lightGrey,
    alignSelf: 'center',
    borderRadius: 100,
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    height: 130,
    width: 130,
    borderRadius: 100,
  },
  editPictureTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  editPictureText: {
    color: colors.yellow,
    fontSize: 14,
    marginLeft: 4,
    lineHeight: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  checkboxText: {
    color: colors.white,
    lineHeight: 30,
    marginLeft: 8,
  },
});

export default SignUpScreen;
