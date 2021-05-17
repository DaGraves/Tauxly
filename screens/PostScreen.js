import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../styles/common';
import {FeedPost} from '../components';

const PostScreen = props => {
  const postId = props.route.params.id;
  const disableLike = props.route.params.disableLike;
  const navigation = useNavigation();
  const [data, setData] = useState(null);
console.log('>>>>>>>>>>>', disableLike, props.route.params)
  const fetchPost = async () => {
    const docRef = await firestore()
      .collection('posts')
      .doc(postId)
      .get();
    const docData = docRef.data();
    setData({id: postId, ...docData});
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      navigation.goBack();
    }
  }, []);

  return (
    <ScrollView style={styles.baseline}>
      {data && <FeedPost item={data} disableLike={disableLike} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default PostScreen;
