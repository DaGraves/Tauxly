import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import ImagePicker from 'react-native-image-crop-picker';
import {PictureFeed} from '../components';
import {colors} from '../styles/common';

const BATCH_SIZE = 10;

const HomeScreen = () => {
  const [posts, setPosts] = useState({});
  const [extraPosts, setExtraPosts] = useState({});
  const lastDocRef = useRef(null);
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

    if (lastDocRef.current) {
      // Subsequent, paginated fetches
      const data = await firestore()
        .collection('posts')
        .where('createdAt', '>=', startOfDay)
        .where('createdAt', '<=', endOfDay)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocRef.current)
        .limit(BATCH_SIZE)
        .get();

      if (!data.empty) {
        data.docs.forEach((docRef, idx) => {
          const doc = docRef.data();
          if (doc.userId !== user.id) {
            postsData = {
              ...postsData,
              [docRef.id]: {...doc, id: docRef.id},
            };
          }
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
        .where('createdAt', '>=', startOfDay)
        .where('createdAt', '<=', endOfDay)
        .orderBy('createdAt', 'desc')
        .limit(BATCH_SIZE)
        .get();

      data.docs.forEach((docRef, idx) => {
        const doc = docRef.data();
        if (doc.userId !== user.id) {
          postsData = {
            ...postsData,
            [docRef.id]: {...doc, id: docRef.id},
          };
        }
        if (idx === data.docs.length - 1) {
          lastDocRef.current = docRef;
        }
      });
      setPosts(postsData);
    }
  }, [posts, user.id]);

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
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          batchSize={BATCH_SIZE}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.black,
  },
});

export default HomeScreen;
