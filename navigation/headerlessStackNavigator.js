import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TermsAndConditionsScreen} from '../screens';
import BottomTabNavigator from './bottomTabNavigator';

const Stack = createStackNavigator();

const HeaderlessStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="MainTab" headerMode="none">
      <Stack.Screen name="MainTab" component={BottomTabNavigator} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
      />
    </Stack.Navigator>
  );
};

export default HeaderlessStackNavigator;
