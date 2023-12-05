import React, { useState } from 'react'
import { View, Switch as RNSwitch, StyleSheet, Text } from 'react-native';

export const CustomSwitch = ({ value, onValueChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <RNSwitch
          trackColor={{ false: "#767577", true: "#81b0ff" }} 
          thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onValueChange}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end", 
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20, 
  }
});