// BarNavigator.js
import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/HomeScreen'
import { AddAlarmScreen } from '../screens/AddAlarmScreen'
import { SettingScreen } from '../screens/SettingScreen'
import { AntDesign } from '@expo/vector-icons'


const Tab = createBottomTabNavigator();

export const BarNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'AddAlarm') {
            iconName = 'pluscircle';
          } else if (route.name === 'Settings') {
            iconName = 'setting';
          }
          const iconSize = focused ? 35 : 30;
          return <AntDesign name={iconName} size={iconSize} color={color} />;
        },
        
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddAlarm" component={AddAlarmScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  navBackground: {
    backgroundColor: '#eee',
    height: 70,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  headerLeft: {
    marginLeft: 15,
  },
  header: {
    backgroundColor: '#94D1FA',
  },
  headerTitle: {
    fontWeight: 'bold',
  },

});


