import React, {useCallback, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Form, Item, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {buttonStyles, inputStyles} from '../styles';
import {GradientBackground, Input} from '../components';
import {colors} from '../styles/common';

const LogInScreen = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    const result = await auth().signInWithEmailAndPassword(email, password);
    console.log('Login Result', result);
  }, [email, password]);

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
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  iconName="person"
                />
              </Item>
              <Item style={inputStyles.item}>
                <Input
                  secureTextEntry
                  autoCompleteType="password"
                  placeholder="Password"
                  blurOnSubmit={false}
                  value={password}
                  onChangeText={setPassword}
                  iconName="lock"
                />
              </Item>
            </Form>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              primary
              style={[buttonStyles.buttonPrimary, styles.button]}
              onPress={handleLogin}>
              <Text style={buttonStyles.buttonPrimaryText}>Log In</Text>
            </Button>
            <Button
              style={[buttonStyles.buttonSecondary, styles.button]}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={buttonStyles.buttonSecondaryText}>
                Don't have an account?
              </Text>
            </Button>
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
});

export default LogInScreen;
