import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {inputStyles} from '../styles';
import {colors} from '../styles/common';
import {Input} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const InputCustom = props => {
  const {iconName, isCommunityIcon, style, error} = props;
  const IconComponent = !isCommunityIcon ? (
    <Icon name={iconName} size={24} color={colors.white} style={styles.icon} />
  ) : (
    <CommunityIcon
      name={iconName}
      size={24}
      color={colors.white}
      style={styles.icon}
    />
  );
  return (
    <View style={styles.container}>
      {iconName && IconComponent}
      <Input
        {...props}
        style={[
          inputStyles.input,
          {marginHorizontal: iconName ? 24 : 0},
          style,
        ]}
        placeholderTextColor={colors.lightGrey}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name={'error'} size={14} color={colors.red} />
          <Text style={styles.error}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: colors.red,
    fontSize: 13,
    marginLeft: 4,
  },
  errorContainer: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
  },
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
