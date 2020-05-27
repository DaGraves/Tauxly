import React, {useCallback, useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import ImageCustom from './ImageCustom';
import {Text, Button} from 'native-base';
import {StoreContext} from '../store/StoreContext';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const FeedPost = props => {
  const navigation = useNavigation();
  const {item, onLike, onUnlike} = props;
  const {user} = useContext(StoreContext);

  const likes = item.likes || {};

  const handleLike = useCallback(() => {
    onLike(item);
  }, [item]);

  const handleUnlike = useCallback(() => {
    onUnlike(item);
  }, [item]);

  const handleComments = useCallback(() => {
    navigation.navigate('Comments', item);
  }, [item]);

  const isLiked = likes[user.id];
  return (
    <View style={{flex: 1}}>
      <View style={styles.usernameContainer}>
        <Text>@{item.username}</Text>
      </View>
      <View style={styles.imageContainer}>
        <ImageCustom
          style={styles.image}
          resizeMode={'contain'}
          source={{uri: item.downloadUrl}}
        />
      </View>
      <View>
        <Text>{item.likeCount || 0} likes</Text>
      </View>
      <View>
        <Text>{item.description}</Text>
      </View>
      <Button onPress={isLiked ? handleUnlike : handleLike}>
        <Text>{isLiked ? 'Unlike' : 'Like'}</Text>
      </Button>
      <Button onPress={handleComments}>
        <Text>Comments</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  usernameContainer: {},
  imageContainer: {
    // Maximum image height should be the display's width (max square ratio)
    height: width,
  },
  image: {
    height: '100%',
    width: width,
  },
});

export default FeedPost;
