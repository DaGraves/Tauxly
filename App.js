import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainSwitchNavigator} from './navigation';
import Provider from './store/Provider';
import Consumer from './store/Consumer';

const App: () => React$Node = () => {
  return (
    <Provider>
      <Consumer>
        <NavigationContainer>
          <MainSwitchNavigator />
        </NavigationContainer>
      </Consumer>
    </Provider>
  );
};

export default App;
