import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {FeedPost, ListDivider} from './index';
import {StoreContext} from '../store/StoreContext';

// Receive posts in an object format
const PictureFeed = props => {
  const {posts, setPosts, fetchPosts, disableLike, disableUsername} = props;
  const {user} = useContext(StoreContext);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleLikeOptimisticUpdate = useCallback(
    id => {
      const postsCopy = {...posts};
      postsCopy[id].likes = {...postsCopy[id].likes, [user.id]: true};
      postsCopy[id].likeCount = (postsCopy[id].likeCount || 0) + 1;
      setPosts(postsCopy);
    },
    [posts, setPosts, user.id],
  );

  const handleUnlikeOptimisticUpdate = useCallback(
    id => {
      const postsCopy = {...posts};
      delete postsCopy[id].likes[user.id];
      postsCopy[id].likeCount = postsCopy[id].likeCount - 1;
      setPosts(postsCopy);
    },
    [posts, setPosts, user.id],
  );

  useEffect(() => {
    setRefreshing(false);
  }, [posts]);

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={Object.values(posts)}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      ItemSeparatorComponent={ListDivider}
      renderItem={item => (
        <FeedPost
          {...item}
          onLikeOptimisticUpdate={handleLikeOptimisticUpdate}
          onUnlikeOptimisticUpdate={handleUnlikeOptimisticUpdate}
          disableLike={disableLike}
          disableUsername={disableUsername}
        />
      )}
    />
  );
};

export default PictureFeed;
