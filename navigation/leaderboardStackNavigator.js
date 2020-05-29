import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CommentsScreen, LeaderboardScreen} from '../screens';

const Stack = createStackNavigator();

const LeaderboardStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

export default LeaderboardStackNavigator;
