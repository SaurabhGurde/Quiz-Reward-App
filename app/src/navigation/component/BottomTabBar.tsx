import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const tabWidth = width / state.routes.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, { duration: 200 });
  }, [state.index]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.tabContainer}>
      <Animated.View style={[styles.indicator, animatedIndicatorStyle, { width: tabWidth }]} />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const options = descriptors[route.key].options;
        const label = options.tabBarLabel ?? route.name; 

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.name} onPress={onPress} style={styles.tabButton}>
            <Text style={[styles.tabText, isFocused && styles.activeText]}>
              {typeof label === 'string' && label } 
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: 'gray',
  },
  activeText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 4,
    backgroundColor: 'blue',
    borderRadius: 2,
  },
});

export default CustomTabBar;
