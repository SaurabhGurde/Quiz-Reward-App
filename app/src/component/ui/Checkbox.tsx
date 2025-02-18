import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropType {
  value?: any;
  label?: string;
  onCheckboxChange?: (value: any) => void;
  checked?: string | boolean;
}

const Checkbox: React.FC<PropType> = ({ value, label, onCheckboxChange, checked }) => {
  const isChecked = checked ? checked === value : false;

  const handlePress = () => {
    onCheckboxChange?.(value);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%', 
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    paddingLeft: 8,
    marginVertical: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#111',
  },
});

export default Checkbox;
