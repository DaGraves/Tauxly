import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/common';

const LeaderboardItem = ({place, money, username}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.place}>{place}</Text>
        <View style={styles.divider} />
      </View>
      <View>
        <Text style={styles.money}>{money}$</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  divider: {
    position: 'absolute',
    right: 0,
    height: 40,
    width: 1,
    backgroundColor: colors.white,
  },
  place: {
    fontWeight: 'bold',
    fontSize: 26,
    color: colors.yellow,
    marginRight: 10,
  },
  money: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: colors.white,
    fontSize: 14,
  },
  leftContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
});

export default LeaderboardItem;
