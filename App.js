import React, {useEffect} from 'react';
import 'react-native-get-random-values';
import {NavigationContainer} from '@react-navigation/native';
import {MainSwitchNavigator} from './navigation';
import Provider from './store/Provider';
import Consumer from './store/Consumer';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Root} from 'native-base';
import {colors} from './styles/common';

const App: () => React$Node = () => {
  return (
    <View style={styles.baseline}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default App;
