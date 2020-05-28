import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import ImagePicker from 'react-native-image-crop-picker';
import {PictureFeed} from '../components';

const HomeScreen = props => {
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
      .limit(10)
      .get();

    data.docs.forEach(docRef => {
      const doc = docRef.data();
      if (doc.userId !== user.id) {
        postsData = {
          ...postsData,
          [docRef.id]: {...doc, id: docRef.id},
        };
      }
    });
    setPosts(postsData);
  }, []);

  const cleanImagePicker = useCallback(async () => {
    try {
      await ImagePicker.clean();
    } catch (e) {
      console.log('Picker clean error', e);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    cleanImagePicker();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <PictureFeed posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});

export default HomeScreen;
