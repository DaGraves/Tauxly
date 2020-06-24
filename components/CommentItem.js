import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/common';

const CommentItem = props => {
  const {item, goToUser} = props;

  return (
    <View style={styles.container}>
      <Text style={styles.comment}>
        <Text style={styles.username} onPress={goToUser}>
          @{item.userName}:
        </Text>
        {item.comment}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  comment: {
    color: colors.white,
  },
  username: {
    fontWeight: 'bold',
    paddingRight: 10,
    color: colors.yellow,
  },
});

export default CommentItem;
