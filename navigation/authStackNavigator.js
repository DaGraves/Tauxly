import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SignUpScreen, LogInScreen, TermsAndConditionsScreen} from '../screens';
import RulesScreen from '../screens/RulesScreen';
import {colors} from '../styles/common';

const Stack = createStackNavigator();

const AuthStackNavigator = props => {
  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkGrey,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
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
      <Stack.Screen
        name="Rules"
        component={RulesScreen}
        options={{title: 'Contest Rules', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
