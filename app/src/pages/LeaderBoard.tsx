import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const leaderboardData = [
  {rank: 1, name: 'John Doe', reward: 1500},
  {rank: 2, name: 'Jane Smith', reward: 1300},
  {rank: 3, name: 'Samuel Green', reward: 1200},
  {rank: 4, name: 'Alice Johnson', reward: 1100},
  {rank: 5, name: 'Bob Brown', reward: 1000},
];

const Leaderboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>

      <FlatList
        data={leaderboardData}
        keyExtractor={item => item.rank.toString()}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.rewardView}>
              <Icon
                name="coins"
                size={20}
                color="#FFD700"

              />
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
    marginBottom: 20,
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
    gap: 5
  }
});

export default Leaderboard;
