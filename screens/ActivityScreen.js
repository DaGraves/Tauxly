import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import {ActivityItem} from '../components';

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

  console.log(interactions);
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={interactions}
        renderItem={ActivityItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default ActivityScreen;
