import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import api from '../api';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '../redux/store';

type resType = {
  data?: {firstName: string; reward: number}[];
  [key: string]: any;
};

const Leaderboard = () => {
  let dispatch = useAppDispatch();
  const [leaderBoardData, setLeaderBoardData] = useState<
    {firstName: string; reward: number}[]
  >([]);

  const getLeaderBoardData = async () => {
    try {
      let res = await api.post<resType>('data/getLeaderBoardData', {}, dispatch);
      if (res.status === 200) {
        setLeaderBoardData(res.data?.data ?? []);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: typeof error === 'string' ? error : 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    getLeaderBoardData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>

      {/* 🏆 Trophy Icon Between Header and List */}
      <View style={styles.iconContainer}>
        <Icon name="trophy" size={150} color="#FFD700" />
      </View>

      <FlatList
        data={leaderBoardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.firstName}</Text>
            <View style={styles.rewardView}>
              <Icon name="coins" size={20} color="#FFD700" />
              <Text style={styles.reward}>{item.reward}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F9E6',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: 'center', // Center the icon
    marginBottom: 15, // Space before the list
  },
  itemContainer: {
    backgroundColor: '#A3D9A5',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  name: {
    fontSize: 18,
    color: '#1B5E20',
    flex: 1,
    textAlign: 'center',
  },
  reward: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  rewardView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default Leaderboard;
