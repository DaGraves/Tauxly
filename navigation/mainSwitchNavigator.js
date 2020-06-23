import React, {useContext, useEffect} from 'react';
import {StoreContext} from '../store/StoreContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import AuthStackNavigator from './authStackNavigator';
import {EmailVerificationScreen} from '../screens';
import HeaderlessStackNavigator from './TablessStackNavigator';
import RNIap from 'react-native-iap';
import {Platform} from 'react-native';

const MainSwitchNavigator = () => {
  const {user, setUser, setCurrentPurchase} = useContext(StoreContext);

  useEffect(() => {
    const purchaseListener = RNIap.purchaseUpdatedListener(async purchase => {
      try {
        //TODO: Change on production isTest
        const receiptBody = {'receipt-data': purchase.transactionReceipt};
        const result = await RNIap.validateReceiptIos(receiptBody, true);

        // Status 0 means valid Apple Receipt
        if (result.status === 0) {
          if (Platform.OS === 'ios') {
            await RNIap.finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
          }
          await RNIap.finishTransaction(purchase, true);
          setCurrentPurchase({...purchase, isComplete: true});
        }
      } catch (e) {
        console.log('Error in Listener', e);
      }
    });

    const purchaseErrorListener = RNIap.purchaseErrorListener(error => {
      console.log('PURCHASE ERROR', error);
    });

    return () => {
      purchaseErrorListener.remove();
      purchaseListener.remove();
    };
  }, [setCurrentPurchase]);

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
              facebook,
              twitter,
              instagram,
            } = dbData.data();
            const currentUser = {
              username,
              email,
              paypalEmail,
              photoUrl,
              photoId,
              biography,
              facebook,
              twitter,
              instagram,
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
    <HeaderlessStackNavigator />
  ) : (
    <EmailVerificationScreen />
  );
};

export default MainSwitchNavigator;
