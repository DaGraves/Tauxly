import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {EmptyScreen, SignUpScreen, LogInScreen} from '../screens';

const Stack = createStackNavigator();

const AuthStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="LogIn" headerMode="none">
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
