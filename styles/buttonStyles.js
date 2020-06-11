import {StyleSheet} from 'react-native';
import {colors} from './common';

const buttonDefault = {
  borderRadius: 0,
  justifyContent: 'center',
};

const buttonTextDefault = {
  textAlign: 'center',
};

export default StyleSheet.create({
  buttonPrimary: {
    ...buttonDefault,
    backgroundColor: colors.yellow,
  },
  buttonPrimaryText: {
    ...buttonTextDefault,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    ...buttonDefault,
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonSecondaryText: {
    ...buttonTextDefault,
  },
});
