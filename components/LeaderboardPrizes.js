import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LeaderboardItem from './LeaderboardItem';
import moment from 'moment';
import {colors} from '../styles/common';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const getFormattedPlace = key => {
  const [first, second] = key.split('-');
  if (!second) {
    return moment.localeData().ordinal(parseInt(first, 0));
  } else {
    return `${moment
      .localeData()
      .ordinal(parseInt(first, 0))} - ${moment
      .localeData()
      .ordinal(parseInt(second, 0))}`;
  }
};

const LeaderboardPrizes = ({posts}) => {
  const [showAll, setShowAll] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [prizes, setPrizes] = useState([]);

  const postArray = Object.values(posts).slice(0, 7);

  const getSecondsLeft = () =>
    moment()
      .utc()
      .endOf('day')
      .diff(moment().utc(), 'seconds');

  const toggleView = () => {
    setShowAll(!showAll);
  };

  const fetchPrizes = async () => {
    const data = await firestore()
      .collection('prizes')
      .get();

    const initialPrizes = [];
    data.docs.forEach(docRef => {
      const doc = docRef.data();
      const key = docRef.id;
      if (doc.value) {
        initialPrizes.push({key, ...doc});
      }
    });

    const orderedPrizes = initialPrizes.sort((a, b) => {
      const _a = parseInt(a.key.split('-')[0], 0);
      const _b = parseInt(b.key.split('-')[0], 0);
      return _a - _b;
    });
    setPrizes(orderedPrizes);
  };

  useEffect(() => {
    setSecondsLeft(getSecondsLeft);
    const interval = setInterval(() => setSecondsLeft(getSecondsLeft), 1000);
    fetchPrizes();
    return () => clearInterval(interval);
  }, []);

  const shownPrizes = showAll ? prizes : prizes.slice(0, 3);
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
            key={`place_${item.key}`}
            username={
              postArray[idx] ? `@${postArray[idx].username}` : 'per person'
            }
            money={item.value}
            place={getFormattedPlace(item.key)}
          />
        );
      })}
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
