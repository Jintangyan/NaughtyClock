import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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
      <TouchableOpacity style={styles.fab} onPress={addAlarm}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  alarmTime: {
    fontSize: 24,
    marginVertical: 10,
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    top: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 28,
    elevation: 8,
  },
  fabText: {
    fontSize: 48,
    color: 'white',
  },
});

export default App;
