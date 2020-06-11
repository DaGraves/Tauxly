import {StyleSheet} from 'react-native';
import {colors} from './common';

const inputDefault = {
  color: colors.white,
  textAlign: 'center',
};

export default StyleSheet.create({
  input: {
    ...inputDefault,
  },
  item: {
    marginLeft: 0,
    marginBottom: 16,
  },
});
