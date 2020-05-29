import React from 'react';
import {StyleSheet, View} from 'react-native';

const ListDivider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '90%',
    backgroundColor: 'grey',
    marginVertical: 20,
  },
});

export default ListDivider;
