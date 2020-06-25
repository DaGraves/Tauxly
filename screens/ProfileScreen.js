import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import {useNavigation} from '@react-navigation/native';
import Profile from '../components/Profile';
import {colors} from '../styles/common';

const BATCH_SIZE = 10;

const ProfileScreen = props => {
  const navigation = useNavigation();
  const {user} = useContext(StoreContext);
  const [posts, setPosts] = useState({});
  const [extraPosts, setExtraPosts] = useState({});
  const lastDocRef = useRef(null);

  const handleLogOut = useCallback(async () => {
    await auth().signOut();
  }, []);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, []);

  const fetchPosts = useCallback(async () => {
    if (lastDocRef.current) {
      // Subsequent, paginated fetches
      const dbData = await firestore()
        .collection('posts')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocRef.current)
        .limit(BATCH_SIZE)
        .get();

      if (!dbData.empty) {
        let data = {};
        dbData.docs.forEach((item, idx) => {
          data = {...data, [item.id]: {id: item.id, ...item.data()}};
          if (idx === dbData.docs.length - 1) {
            lastDocRef.current = item;
          }
        });
        setPosts({...posts, ...data});
        setExtraPosts(data);
      }
    } else {
      // Initial fetch
      const dbData = await firestore()
        .collection('posts')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
        .limit(BATCH_SIZE)
        .get();
      let data = {};
      dbData.docs.forEach((item, idx) => {
        data = {...data, [item.id]: {id: item.id, ...item.data()}};
        if (idx === dbData.docs.length - 1) {
          lastDocRef.current = item;
        }
      });
      setPosts(data);
    }
  }, [posts, user.id]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Profile
          handleLogOut={handleLogOut}
          handleEditProfile={handleEditProfile}
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
    backgroundColor: colors.black,
  },
});

export default ProfileScreen;
