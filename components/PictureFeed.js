import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {FeedPost} from './index';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {INTERACTION_TYPES} from '../constants';
import {StoreContext} from '../store/StoreContext';

// Receive posts in an object format
const PictureFeed = props => {
  const {posts, setPosts, fetchPosts} = props;
  const {user} = useContext(StoreContext);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    setRefreshing(false);
  }, [posts]);

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
    [posts, setPosts, user.id, user.username],
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
    [posts, setPosts, user.id],
  );

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={Object.values(posts)}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={item => (
        <FeedPost {...item} onLike={handleLike} onUnlike={handleUnlike} />
      )}
    />
  );
};

export default PictureFeed;
