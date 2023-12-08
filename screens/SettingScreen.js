import React from 'react';
import { StyleSheet, Text, View, Image,DeviceEventEmitter } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity} from 'react-native'
import {
  getAuth,
  signOut,
} from 'firebase/auth'

// Components
export const SettingScreen = ({ }) => {
  const navigation = useNavigation();
  const authObj = getAuth()
  
  // Sign out function
  const handleSignOut = () => {
    navigation.navigate('Signin');
    DeviceEventEmitter.emit("User.logout")

  }

 
  return (
    <View style={styles.container}>
     
     <Image
        style={styles.logo}
        source={require('../assets/logo.png')} 
      />  
      <Text style={styles.textStyle}>Made by MiTang</Text>
    <TouchableOpacity style={styles.button}  onPress={handleSignOut}>
      <Text style={styles.buttonText }>SIGN OUT</Text>
      </TouchableOpacity>
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
    button: {
     
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      backgroundColor: '#313cdf', 
      borderRadius: 5, 
      marginTop:20,
    },
    buttonText: {
      color: 'white', 
      fontWeight:'bold',
    },

  });


