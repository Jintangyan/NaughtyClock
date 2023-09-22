import { StatusBar } from 'expo-status-bar';
// App.js

import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const App = () => {
  const [alarms, setAlarms] = useState([
    { id: '1', time: '07:00 AM' },
    { id: '2', time: '08:30 AM' },
  ]);

  const addAlarm = () => {
    // Logic to add a new alarm
    // For simplicity, we'll add a dummy alarm here
    const newAlarm = { id: Date.now().toString(), time: '09:00 AM' };
    setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        renderItem={({ item }) => <Text style={styles.alarmTime}>{item.time}</Text>}
        keyExtractor={(item) => item.id}
      />
      <Button title="Add Alarm" onPress={addAlarm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  alarmTime: {
    fontSize: 24,
    marginVertical: 10,
  },
});

export default App;
