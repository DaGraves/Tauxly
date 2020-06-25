import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LeaderboardItem from './LeaderboardItem';
import moment from 'moment';
import {colors} from '../styles/common';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIZES = [150, 100, 50, 40, 30, 20, 10];

const LeaderboardPrizes = ({posts}) => {
  const [showAll, setShowAll] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const postArray = Object.values(posts).slice(0, 7);

  const getSecondsLeft = () =>
    moment()
      .utc()
      .endOf('day')
      .diff(moment().utc(), 'seconds');

  const toggleView = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    setSecondsLeft(getSecondsLeft);
    const interval = setInterval(() => setSecondsLeft(getSecondsLeft), 1000);

    return () => clearInterval(interval);
  }, []);

  const shownPrizes = showAll ? PRIZES : PRIZES.slice(0, 3);
  return (
    <View style={styles.container}>
      <Text style={styles.countdown}>
        Time left:{' '}
        {moment()
          .startOf('day')
          .add(secondsLeft, 'seconds')
          .format('HH:mm:ss')}
      </Text>
      {shownPrizes.map((item, idx) => {
        return (
          <LeaderboardItem
            key={`place_${idx}`}
            username={
              postArray[idx] ? `@${postArray[idx].username}` : 'per person'
            }
            money={PRIZES[idx]}
            place={moment.localeData().ordinal(idx + 1)}
          />
        );
      })}
      {showAll && (
        <>
          <LeaderboardItem
            username={'per person'}
            place={'8th - 20th'}
            money={5}
          />
          <LeaderboardItem
            username={'per person'}
            place={'20th - 50th'}
            money={5}
          />
          <LeaderboardItem
            username={'per person'}
            place={'50th - 100th'}
            money={5}
          />
        </>
      )}
      <TouchableOpacity style={styles.viewContainer} onPress={toggleView}>
        <CommunityIcon
          name={showAll ? 'chevron-up' : 'chevron-down'}
          color={colors.lightGrey}
          size={16}
        />
        <Text style={styles.showControl}>
          {showAll ? 'View less' : 'View more'}
        </Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  showControl: {
    color: colors.lightGrey,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.white,
    width: '50%',
    marginTop: 8,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
});

export default LeaderboardPrizes;
