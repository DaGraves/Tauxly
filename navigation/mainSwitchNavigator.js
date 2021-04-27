import React, {useContext, useEffect} from 'react';
import {StoreContext} from '../store/StoreContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import AuthStackNavigator from './authStackNavigator';
import {EmailVerificationScreen} from '../screens';
import HeaderlessStackNavigator from './TablessStackNavigator';
import RNIap from 'react-native-iap';
import {Alert, Platform} from 'react-native';
import RNBootSplash from "react-native-bootsplash";

const validateReceiptAndroid = async purchaseToken => {
  try {
    const data = await fetch(
      'https://us-central1-taully.cloudfunctions.net/validateReceiptAndroid',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({purchaseToken}),
      },
    );
    return data;
  } catch (e) {
    return {isSuccessful: false};
  }
};

const MainSwitchNavigator = () => {
  const {user, setUser, setCurrentPurchase} = useContext(StoreContext);

  useEffect(() => {
    RNIap.consumeAllItemsAndroid();
    const purchaseListener = RNIap.purchaseUpdatedListener(async purchase => {
      try {
        //TODO: Change on production isTest
        const receiptBody = {'receipt-data': purchase.transactionReceipt};
        const result =
          Platform.OS === 'ios'
            ? await RNIap.validateReceiptIos(receiptBody, true)
            : await validateReceiptAndroid(purchase.transactionReceipt);

        // Status 0 means valid Apple Receipt, isSuccessful is for Android
        if (
          result.status === 0 ||
          result.status === 200 ||
          result.status === '200'
        ) {
          if (Platform.OS === 'ios') {
            await RNIap.finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            RNIap.consumeAllItemsAndroid();
          }
          RNIap.finishTransaction(purchase, true);
          setCurrentPurchase({...purchase, isComplete: true});
        } else {
          Alert.alert(
            'Something went wrong!',
            'Please close the app and try again in a few minutes',
          );
        }
      } catch (e) {
        Alert.alert('Something went wrong!', e.message);
        console.log('Error in Listener', e);
      }
    });

    const purchaseErrorListener = RNIap.purchaseErrorListener(error => {
      console.log('PURCHASE ERROR', error);
      Alert.alert(
        'Something went wrong',
        "We couldn't process your purchase.",
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
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
      await RNBootSplash.hide();
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
