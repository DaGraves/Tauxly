import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {FeedPost} from '../components';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';

const LeaderboardScreen = props => {
  const [posts, setPosts] = useState({});
  const {user} = useContext(StoreContext);

  const fetchPosts = useCallback(async () => {
    let postsData = {};
    const startOfDay = moment()
      .utc()
      .startOf('day')
      .unix();
    const endOfDay = moment()
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
        const {id, likes = []} = post;
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
});

export default LeaderboardScreen;
