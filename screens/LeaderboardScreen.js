import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FeedPost, PictureFeed} from '../components';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StoreContext} from '../store/StoreContext';
import {INTERACTION_TYPES} from '../constants';

const LeaderboardScreen = props => {
  const [posts, setPosts] = useState({});
  const [showDate, setShowDate] = useState(false);
  const [leaderboardDate, setLeaderboardDate] = useState(moment().toDate());

  const selectDate = useCallback(date => {
    setShowDate(false);
    setLeaderboardDate(date);
  }, []);

  const fetchPosts = useCallback(async () => {
    let postsData = {};

    const startOfDay = moment(leaderboardDate)
      .add(-leaderboardDate.getTimezoneOffset(), 'minutes')
      .utc()
      .startOf('day')
      .unix();
    const endOfDay = moment(leaderboardDate)
      .add(-leaderboardDate.getTimezoneOffset(), 'minutes')
      .utc()
      .endOf('day')
      .unix();

    const data = await firestore()
      .collection('posts')
      .where('createdAt', '>=', startOfDay)
      .where('createdAt', '<=', endOfDay)
      .orderBy('createdAt', 'desc')
      .get();

    data.docs.forEach(docRef => {
      const doc = docRef.data();
      postsData = {
        ...postsData,
        [docRef.id]: {...doc, id: docRef.id},
      };
    });

    let sortedData = {};
    Object.values(postsData)
      .sort((a, b) => {
        return (b.likeCount || 0) - (a.likeCount || 0);
      })
      .forEach(item => (sortedData = {...sortedData, [item.id]: item}));
    setPosts(sortedData);
  }, [leaderboardDate]);

  useEffect(() => {
    fetchPosts();
  }, [leaderboardDate]);

  return (
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
      <TouchableOpacity onPress={() => setShowDate(true)}>
        <Text style={styles.dateSelectorText}>
          {moment(leaderboardDate).format('DD MMMM YYYY')}
        </Text>
      </TouchableOpacity>
      <PictureFeed posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  dateSelectorText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'blue',
  },
});

export default LeaderboardScreen;
