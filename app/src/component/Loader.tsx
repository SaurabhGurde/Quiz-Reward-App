import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAppSelector } from '../redux/store'; // Redux selector hook

const Loader = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useAppSelector(state => state.appState.isLoading);

  return (
    <View style={{ flex: 1 }}>
      {children} 

      {isLoading && (
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default Loader;
