import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import {ActivityItem, ListDivider} from '../components';
import {colors} from '../styles/common';

const ActivityScreen = props => {
  const {user} = useContext(StoreContext);
  const [interactions, setInteractions] = useState([]);

  const fetchInteractions = async () => {
    if (user) {
      try {
        const fbData = await firestore()
          .collection('interactions')
          .where('creatorId', '==', user.id)
          .orderBy('timestamp', 'desc')
          .limit(20)
          .get();
        setInteractions(
          fbData.docs.map(item => ({id: item.id, ...item.data()})),
        );
      } catch (e) {
        console.log('Fetch interactions error', e);
      }
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  return (
    <View style={styles.baseline}>
      <SafeAreaView style={styles.baseline}>
        <FlatList
          data={interactions}
          renderItem={ActivityItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ListDivider}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default ActivityScreen;
