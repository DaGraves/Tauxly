import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Form, Item, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {buttonStyles, inputStyles} from '../styles';
import {GradientBackground, Input} from '../components';
import {colors} from '../styles/common';
import {VALIDATIONS} from '../constants';

const LogInScreen = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      const sanitizedEmail = email.replace(' ', '');
      let errors = {};
      if (!email || !VALIDATIONS.email(email)) {
        errors.email = 'You have to type in a valid email address.';
      }
      if (!password || !VALIDATIONS.password(password)) {
        errors.password = 'You have to type in a valid password.';
      }
      if (Object.keys(errors).length) {
        setErrors(errors);
      } else {
        await auth().signInWithEmailAndPassword(sanitizedEmail, password);
      }
    } catch (e) {
      if (password && email) {
        errors.password = 'Invalid password or email address!';
      } else {
        Alert.alert(
          'Something went wrong',
          'Make sure all your data is valid!',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
      console.log('Login Error', e);
    }
    setLoading(false);
  }, [email, password]);

  const handleChange = (name, value) => {
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        'One more thing...',
        'Please type your email address in the email field above',
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      try {
        await auth().sendPasswordResetEmail(email);
        Alert.alert(
          'Your password is almost reset!',
          'Check your email for follow up instructions.',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
          <View>
            <Image source={{uri: 'logo'}} style={styles.logo} />
            <Text style={styles.title}>Log In</Text>
            <Form style={styles.formContainer}>
              <Item style={inputStyles.item}>
                <Input
                  autoCompleteType="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  placeholder="Email"
                  value={email}
                  onChangeText={text => handleChange('email', text)}
                  iconName="person"
                  error={errors.email}
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  secureTextEntry
                  autoCompleteType="password"
                  placeholder="Password"
                  blurOnSubmit={false}
                  value={password}
                  onChangeText={text => handleChange('password', text)}
                  iconName="lock"
                  error={errors.password}
                />
              </Item>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </Form>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              primary
              disabled={loading}
              style={[buttonStyles.buttonPrimary, styles.button]}
              onPress={handleLogin}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={buttonStyles.buttonPrimaryText}>Log In</Text>
              )}
            </Button>
            <Button
              style={[buttonStyles.buttonSecondary, styles.button]}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={buttonStyles.buttonSecondaryText}>
                Don't have an account?
              </Text>
            </Button>
            <Text
              style={styles.rulesLink}
              onPress={() => navigation.navigate('Rules')}>
              Press to see the Contest Rules
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logo: {
    resizeMode: 'contain',
    height: 100,
    marginBottom: 30,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 40,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  },
  forgotPassword: {
    color: colors.yellow,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  rulesLink: {
    color: colors.white,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default LogInScreen;
