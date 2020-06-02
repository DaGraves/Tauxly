import React, {useContext, useEffect} from 'react';
import {StoreContext} from '../store/StoreContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import AuthStackNavigator from './authStackNavigator';
import BottomTabNavigator from './bottomTabNavigator';
import {EmailVerificationScreen} from '../screens';

const MainSwitchNavigator = () => {
  const {user, setUser} = useContext(StoreContext);

  useEffect(() => {
    auth().onAuthStateChanged(async data => {
      if (data) {
        const localUser = await AsyncStorage.getItem('user');
        const localUserData = JSON.parse(localUser);
        if (
          !localUserData ||
          data.email.toLowerCase() !== localUserData.email.toLowerCase()
        ) {
          // Fetch all user data if no local data or the emails do not match
          const dbData = await firestore()
            .collection('users')
            .doc(data.uid)
            .get();
          if (dbData.exists) {
            const {
              username,
              email,
              paypalEmail,
              photoUrl,
              photoId,
              biography,
            } = dbData.data();
            const currentUser = {
              username,
              email,
              paypalEmail,
              photoUrl,
              photoId,
              biography,
              id: data.uid,
              emailVerified: data.emailVerified,
            };
            await AsyncStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
          }
        } else if (data.emailVerified) {
          setUser({...localUserData, emailVerified: true});
        } else {
          setUser({...localUserData});
        }
      } else {
        setUser(null);
        const localUser = await AsyncStorage.getItem('user');
        localUser && (await AsyncStorage.removeItem('user'));
      }
    });
  }, []);

  return !user ? (
    <AuthStackNavigator />
  ) : user.emailVerified ? (
    <BottomTabNavigator />
  ) : (
    <EmailVerificationScreen />
  );
};

export default MainSwitchNavigator;
