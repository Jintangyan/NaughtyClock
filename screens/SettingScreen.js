import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Image, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, Alert, Modal, } from 'react-native'
import { SafeAreaView, ScrollView } from 'react-native'

// Components
import { LogoTitle } from '../components/LogoTitle'


export const SettingScreen = () => {
  return (
    <View style={styles.container}>
     
     <Image
        style={styles.logo}
        source={require('../assets/logo.png')} 
      />  
      <Text style={styles.textStyle}>Made by MiTang</Text>

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo:{
      width:100,
      height:100,
    },
    textStyle:{
      fontFamily: 'Noteworthy', 
      fontSize:20,
      fontWeight:'bold',
    },

  });


