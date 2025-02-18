import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number;
  bgColor?: string; 
  barWidth?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  bgColor = '#2563EB', 
  barWidth = '90%',
}) => {
  return (
    <View  style={[styles.container, { width: barWidth } as any]}>
      <View style={[styles.innerBar, { backgroundColor: bgColor, width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 999, 
    height: 10, 
    overflow: 'hidden',
  },
  innerBar: {
    height: '100%',
    borderRadius: 999,
  },
});

export default ProgressBar;
