import React from 'react';
import 'react-native-get-random-values';
import {NavigationContainer} from '@react-navigation/native';
import {MainSwitchNavigator} from './navigation';
import Provider from './store/Provider';
import Consumer from './store/Consumer';
import {StatusBar} from 'react-native';
import {Root} from 'native-base';

const App: () => React$Node = () => {
  return (
    <Root>
      <Provider>
        <Consumer>
          <NavigationContainer>
            <StatusBar barStyle="light-content" />
            <MainSwitchNavigator />
          </NavigationContainer>
        </Consumer>
      </Provider>
    </Root>
  );
};

export default App;
