import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const CommentItem = props => {
  const {item} = props;

  return (
    <View>
      <Text style={styles.username}>{item.userName}</Text>
      <Text>{item.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  username: {
    fontWeight: 'bold',
  },
});

export default CommentItem;
