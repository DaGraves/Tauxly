import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SignUpScreen, LogInScreen, TermsAndConditionsScreen} from '../screens';

const Stack = createStackNavigator();

const AuthStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="LogIn">
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="LogIn"
        component={LogInScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="TermsAndConditions"
        options={{title: 'Terms and Conditions', headerBackTitle: 'Back'}}
        component={TermsAndConditionsScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
