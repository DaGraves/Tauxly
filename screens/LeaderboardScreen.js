import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FeedPost} from '../components';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StoreContext} from '../store/StoreContext';
import {INTERACTION_TYPES} from '../constants';

const LeaderboardScreen = props => {
  const [posts, setPosts] = useState({});
  const [showDate, setShowDate] = useState(false);
  const [leaderboardDate, setLeaderboardDate] = useState(moment().toDate());
  const {user} = useContext(StoreContext);

  const selectDate = useCallback(date => {
    setShowDate(false);
    setLeaderboardDate(date);
    fetchPosts(date);
  }, []);

  const fetchPosts = useCallback(async (date = new Date()) => {
    let postsData = {};

    const startOfDay = moment(date)
      .add(-date.getTimezoneOffset(), 'minutes')
      .utc()
      .startOf('day')
      .unix();
    const endOfDay = moment(date)
      .add(-date.getTimezoneOffset(), 'minutes')
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
      .sort((a, b) => b.likeCount || 0 - a.likeCount || 0)
      .forEach(item => (sortedData[item.id] = item));
    setPosts(sortedData);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = useCallback(
    async post => {
      if (post) {
        const {id, likes = [], downloadUrl} = post;
        try {
          const postsCopy = {...posts};
          postsCopy[id].likes = {...postsCopy[id].likes, [user.id]: true};
          postsCopy[id].likeCount = (postsCopy[id].likeCount || 0) + 1;
          setPosts(postsCopy);
          const increment = firestore.FieldValue.increment(1);
          await firestore()
            .collection('posts')
            .doc(id)
            .update({
              likes: {...likes, [user.id]: true},
              likeCount: increment,
            });
          await firestore()
            .collection('interactions')
            .add({
              postId: id,
              postDownloadUrl: downloadUrl,
              creatorId: post.userId,
              userId: user.id,
              userName: user.username,
              timestamp: moment().unix(),
              type: INTERACTION_TYPES.LIKE,
            });
        } catch (e) {
          console.log('Error Like', e);
        }
      }
    },
    [posts],
  );

  const handleUnlike = useCallback(
    async post => {
      if (post) {
        const {id, likes = []} = post;
        try {
          const postsCopy = {...posts};
          delete postsCopy[id].likes[user.id];
          postsCopy[id].likeCount = postsCopy[id].likeCount - 1;
          setPosts(postsCopy);
          const increment = firestore.FieldValue.increment(-1);
          await firestore()
            .collection('posts')
            .doc(id)
            .update({
              likes: postsCopy[id].likes,
              likeCount: increment,
            });
        } catch (e) {
          console.log('Error Like', e);
        }
      }
    },
    [posts, user.id],
  );

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
      <FlatList
        keyExtractor={item => item.id}
        data={Object.values(posts)}
        renderItem={item => (
          <FeedPost {...item} onLike={handleLike} onUnlike={handleUnlike} />
        )}
      />
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
