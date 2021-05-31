import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {StoreContext} from '../store/StoreContext';
import ListDivider from './ListDivider';
import FeedPost from './FeedPost';
import FeedPostSplit from './FeedPostSplit';

// Receive posts in an object format
const PictureFeed = props => {
  const {
    posts,
    extraPosts = {},
    setPosts,
    fetchPosts,
    disableLike,
    disableUsername,
    batchSize = 10,
    isSplit = false,
    onPostPress,
    HeaderComponent,
    enableRanking,
  } = props;

  const {user} = useContext(StoreContext);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(true);
    setRefreshing(false);
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

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={Object.values(posts)}
      extraData={extraPosts === false ? false : Object.values(extraPosts)}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      ItemSeparatorComponent={ListDivider}
      onEndReached={() => fetchPosts(false)}
      onEndReachedThreshold={0.1}
      initialNumToRender={batchSize}
      numColumns={isSplit ? 2 : 1}
      style={{flex: 1}}
      ListHeaderComponent={
        HeaderComponent ? () => <HeaderComponent posts={posts} /> : null
      }
      renderItem={item =>
        isSplit ? (
          <FeedPostSplit {...item} onPress={() => onPostPress(item.item.id)} />
        ) : (
          <FeedPost
            {...item}
            onLikeOptimisticUpdate={handleLikeOptimisticUpdate}
            onUnlikeOptimisticUpdate={handleUnlikeOptimisticUpdate}
            disableLike={disableLike}
            disableUsername={disableUsername}
            rank={enableRanking ? item.index + 1 : null}
          />
        )
      }
    />
  );
};

export default PictureFeed;
