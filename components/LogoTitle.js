import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

export const LogoTitle = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.logo}
        source={require('../assets/logo.png')} 
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50,
      },
      logoContainer: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        alignItems: 'flex-start',
      },
  })