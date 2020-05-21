import React, {useCallback, useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {Form, Item, Input, Button, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {StoreContext} from '../store/StoreContext';

const DEFAULT_STATE = {
  email: '',
  paypalEmail: '',
  username: '',
  password: '',
  passwordConfirm: '',
};

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(StoreContext);
  const [state, setState] = useState(DEFAULT_STATE);

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
        const user = {
          email,
          paypalEmail,
          username,
          photoUrl:
            'https://icons-for-free.com/iconfiles/png/512/avatar+person+profile+user+icon-1320086059654790795.png',
        };
        const dbResult = await firestore()
          .collection('users')
          .doc(uid)
          .set(user);
        console.log('Result', result, dbResult);
        setUser(user);
      } catch (e) {
        console.log('ERROR', e);
      }
    } else {
      console.log('Passwords not a match');
    }
  }, [state]);

  return (
    <View>
      <Form style={styles.formContainer}>
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
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 30,
  },
  button: {
    marginTop: 20,
  },
});

export default SignUpScreen;
