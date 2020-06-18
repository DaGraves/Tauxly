import React, {useEffect} from 'react';
import 'react-native-get-random-values';
import {NavigationContainer} from '@react-navigation/native';
import {MainSwitchNavigator} from './navigation';
import Provider from './store/Provider';
import Consumer from './store/Consumer';
import {StatusBar, Platform} from 'react-native';
import RNIap from 'react-native-iap';

const App: () => React$Node = () => {
  useEffect(() => {
    // RNIap.purchaseUpdatedListener(purchase => {
    //   console.log('PURCHASE', purchase);
    //   try {
    //     if (Platform.OS === 'ios') {
    //       RNIap.finishTransactionIOS(purchase.transactionId);
    //     } else if (Platform.OS === 'android') {
    //       RNIap.consumePurchaseAndroid(purchase.purchaseToken);
    //     }
    //     RNIap.finishTransaction(purchase, true);
    //     //  TODO: Validate receipt
    //   } catch (e) {
    //     console.log('Error in Listener', e);
    //   }
    // });
    //
    // RNIap.purchaseErrorListener(error => {
    //   console.log('PURCHASE ERROR', error);
    // });
  });

  return (
    <Provider>
      <Consumer>
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          <MainSwitchNavigator />
        </NavigationContainer>
      </Consumer>
    </Provider>
  );
};

export default App;
