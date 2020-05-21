import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Form, Input, Item, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const LogInScreen = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    const result = await auth().signInWithEmailAndPassword(email, password);
    console.log('Login Result', result);
  }, [email, password]);

  return (
    <View>
      <Form style={styles.formContainer}>
        <Item>
          <Input
            autoCompleteType="email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </Item>
        <Item>
          <Input
            secureTextEntry
            autoCompleteType="password"
            placeholder="Password"
            blurOnSubmit={false}
            value={password}
            onChangeText={setPassword}
          />
        </Item>
        <Button primary style={styles.button} onPress={handleLogin}>
          <Text>Log In!</Text>
        </Button>
        <Button
          light
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}>
          <Text>I don't have an account</Text>
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

export default LogInScreen;
