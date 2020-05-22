import {SafeAreaView, Text} from 'react-native';
import {BottomTabNavigator, AuthStackNavigator} from './index';
import React, {useContext, useEffect} from 'react';
import {StoreContext} from '../store/StoreContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

const MainSwitchNavigator = () => {
  const {user, setUser} = useContext(StoreContext);

  useEffect(() => {
    auth().onAuthStateChanged(async data => {
      console.log('data', data);
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
          console.log(dbData)
          if (dbData.exists) {
            const {username, email, paypalEmail, photoUrl} = dbData.data();
            const currentUser = {
              username,
              email,
              paypalEmail,
              photoUrl,
              id: data.uid,
            };
            await AsyncStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
          }
        }
        setUser({
          email: data.email,
          id: data.uid,
        });
      } else {
        setUser(null);
        const localUser = await AsyncStorage.getItem('user');
        localUser && (await AsyncStorage.removeItem('user'));
      }
    });
  }, []);

  return !user ? <AuthStackNavigator /> : <BottomTabNavigator />;
};

export default MainSwitchNavigator;
