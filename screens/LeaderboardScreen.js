import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {PictureFeed, LeaderboardPrizes} from '../components';
import {Button, Text} from 'native-base';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {colors} from '../styles/common';
import {buttonStyles} from '../styles';

const BATCH_SIZE = 10;

const LeaderboardScreen = props => {
  const [posts, setPosts] = useState({});
  const [extraPosts, setExtraPosts] = useState({});
  const lastDocRef = useRef(null);
  const [showDate, setShowDate] = useState(false);
  const [leaderboardDate, setLeaderboardDate] = useState(moment().toDate());

  const selectDate = useCallback(
    date => {
      setShowDate(false);
      if (date !== leaderboardDate) {
        setExtraPosts(false);
        setPosts({});
        lastDocRef.current = null;
      }
      setLeaderboardDate(date);
    },
    [leaderboardDate],
  );

  const fetchPosts = useCallback(async () => {
    let postsData = {};

    const startOfDay = moment(leaderboardDate)
      .add(-leaderboardDate.getTimezoneOffset(), 'minutes')
      .utc()
      .startOf('day')
      .unix();

    if (lastDocRef.current) {
      // The subsequent dynamic fetches
      const data = await firestore()
        .collection('posts')
        .where('createdAtDay', '==', startOfDay)
        .orderBy('likeCount', 'desc')
        .startAfter(lastDocRef.current)
        .limit(BATCH_SIZE)
        .get();

      if (!data.empty) {
        data.docs.forEach((docRef, idx) => {
          const doc = docRef.data();
          postsData = {
            ...postsData,
            [docRef.id]: {...doc, id: docRef.id},
          };
          if (idx === data.docs.length - 1) {
            lastDocRef.current = docRef;
          }
        });
        setPosts({...posts, ...postsData});
        setExtraPosts(postsData);
      }
    } else {
      // The initial fetch
      const data = await firestore()
        .collection('posts')
        .where('createdAtDay', '==', startOfDay)
        .orderBy('likeCount', 'desc')
        .limit(BATCH_SIZE)
        .get();

      data.docs.forEach((docRef, idx) => {
        const doc = docRef.data();
        postsData = {
          ...postsData,
          [docRef.id]: {...doc, id: docRef.id},
        };
        if (idx === data.docs.length - 1) {
          lastDocRef.current = docRef;
        }
      });

      setPosts(postsData);
      setExtraPosts(postsData);
    }
  }, [leaderboardDate, posts]);

  useEffect(() => {
    fetchPosts();
  }, [leaderboardDate]);

  return (
    <View style={styles.baseline}>
      <SafeAreaView style={styles.container}>
        <DateTimePickerModal
          isVisible={showDate}
          mode="date"
          value={leaderboardDate}
          maximumDate={new Date()}
          onConfirm={selectDate}
          onCancel={() => {
            setShowDate(false);
          }}
        />
        <Button
          style={[buttonStyles.buttonSecondary, styles.button]}
          onPress={() => setShowDate(true)}>
          <Text style={buttonStyles.buttonSecondaryText}>
            {moment(leaderboardDate).format('DD MMMM YYYY')}
          </Text>
        </Button>
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          batchSize={BATCH_SIZE}
          HeaderComponent={LeaderboardPrizes}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    flexGrow: 1,
  },
  dateSelectorText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'blue',
  },
  button: {
    marginHorizontal: 30,
    marginVertical: 10,
  },
});

export default LeaderboardScreen;
