import React from 'react';
import {StyleSheet, View} from 'react-native';
import {inputStyles} from '../styles';
import {colors} from '../styles/common';
import {Input} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InputCustom = props => {
  const {iconName} = props;
  return (
    <View style={styles.container}>
      {iconName && (
        <Icon
          name={iconName}
          size={24}
          color={colors.white}
          style={styles.icon}
        />
      )}
      <Input
        {...props}
        style={[inputStyles.input, {marginHorizontal: iconName ? 24 : 0}]}
        placeholderTextColor={colors.lightGrey}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 0,
  },
});

export default InputCustom;
