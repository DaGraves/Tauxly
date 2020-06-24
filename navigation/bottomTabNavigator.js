import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityScreen, HomeScreen} from '../screens';
import AddPostStackNavigator from './addPostStackNavigator';
import LeaderboardStackNavigator from './leaderboardStackNavigator';
import ProfileStackNavigator from './profileStackNavigator';
import {colors} from '../styles/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      inactiveBackgroundColor: colors.darkGrey,
      activeBackgroundColor: colors.darkGrey,
      showLabel: false,
      style: {
        backgroundColor: colors.darkGrey,
      },
    }}
    defaultNavigationOptions={({screenProps}) => ({
      tabBarOptions: {
        style: {
          backgroundColor: 'red',
        },
      },
    })}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name="home"
            size={30}
            color={focused ? colors.yellow : colors.white}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Leaderboard"
      component={LeaderboardStackNavigator}
      options={{
        tabBarIcon: ({focused}) => (
          <CommunityIcon
            name="trophy"
            size={30}
            color={focused ? colors.yellow : colors.white}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Add post"
      component={AddPostStackNavigator}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name="camera"
            size={30}
            color={focused ? colors.yellow : colors.white}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Activity"
      component={ActivityScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name="local-activity"
            size={30}
            color={focused ? colors.yellow : colors.white}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name="person"
            size={30}
            color={focused ? colors.yellow : colors.white}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
