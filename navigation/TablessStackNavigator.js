import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AddPostDetailsScreen,
  TermsAndConditionsScreen,
  OtherProfileScreen,
  CommentsScreen,
} from '../screens';
import BottomTabNavigator from './bottomTabNavigator';
import {colors} from '../styles/common';
import RNIap from 'react-native-iap';

const Stack = createStackNavigator();

const TablessStackNavigator = props => {
  const initIAP = async () => {
    await RNIap.initConnection();
  };
  useEffect(() => {
    initIAP();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="MainTab"
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
        name="MainTab"
        component={BottomTabNavigator}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
        options={{title: 'Terms and Conditions', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="AddPostDetails"
        component={AddPostDetailsScreen}
        options={{title: 'Final details', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{title: 'Profile', headerBackTitle: 'Back'}}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{title: 'Comments', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
};

export default TablessStackNavigator;
