
import {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'


import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Linking} from 'react-native'

import { HomeScreen } from './HomeScreen'

export function SigninScreen( props ) {

 const navigation = useNavigation();

  // Declaring UseState for both email and password
 const [email, setEmail] = useState('')
 const [validEmail, setValidEmail] = useState(false)
 const [password, setPassword] = useState('')
 const [validPassword, setValidPassword] = useState(false)

  
//function to validate email
const validateEmail = ( emailStr ) => {
  // check if email contains '@' symbol
  const atIndex = emailStr.indexOf('@')
  if( atIndex > 0 ) {
    return true
  }
  else {
    return false
  }
}

const validatePassword = (passwordStr) => {
  const passLength = passwordStr.length
  if (passLength >= 8) {
    return true
  }
  else {
    return false
  }
}

useEffect( () => {
  // console.log( validateEmail( email ) )
  if ( validateEmail( email ) ) {
    setValidEmail( true )
  }
  else { setValidEmail( false ) }
  if ( validatePassword( password ) ) {
    setValidPassword( true )
  }
  else { setValidPassword( false ) }
}, [ email, password ] )



// Same with signup
const signIn = ( email, password ) => props.signin( email, password )

 useEffect( () => {
   // auth is passed on as a prop from App.js
   if( props.auth ) {
    navigation.reset( { index: 0, routes: [ {name: "Home"} ]} )
   }
 }, [ props.auth ])



  return (
    <KeyboardAvoidingView style={styles.signInView} behavior='padding'>
    
    <Text style = {styles.signInTitle}>Log in</Text>

    <View style = {styles.signinForm}>
      
      
      <Text style = {styles.label}>Email</Text>
      <TextInput style = {styles.input}     
      onChangeText = { (value) => setEmail(value)}
      placeholder="Mitang@gmail.com"
      placeholderTextColor = "darkgray"
      keyboardType="email-address"
      
      />

      <Text style = {styles.label}>Password</Text>
      <TextInput style = {styles.input}
        secureTextEntry={true}
        onChangeText={ (value) => setPassword (value) }
        placeholder="****"
        placeholderTextColor = "darkgray" 
        />

    </View>

    <View style={ styles.buttonContainer}>
      <TouchableOpacity style={ (validEmail && validPassword) ? styles.button : styles.buttonDisabled }
        disabled={ (validEmail && validPassword) ? false : true }
        onPress = { () => signIn( email, password ) }>    
          <Text style={styles.buttonText}>Log in</Text>
          
      </TouchableOpacity>
    </View>

    <View style={styles.contentView}>
      <Text>
        <Text style={styles.content}>Need an account?</Text>
          <Text style={styles.SignUpHereText}
                onPress={() => navigation.navigate('Signup')}>{' '}
            Sign up
          </Text>
      </Text>
    </View>

    </KeyboardAvoidingView> 
  )
}

const styles = StyleSheet.create( {

  signInView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signInTitle: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    
  },

  signinForm: {
    width: 300,
    padding: 5,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },

  input: {
    backgroundColor: '#B3E0F2',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 15,
    padding: 10,
    fontSize: 12,
  },


  form: {
    justifyContent: 'flex-start',
  },

  buttonContainer: {
    // backgroundColor: 'gray',
    width: 300,
    padding: 5,
    marginBottom: 5,
  },

  button: { 
    backgroundColor: '#313cdf',
    borderRadius: 300,
    alignItems: 'center',
    padding: 10,
  },

  buttonDisabled: {
    backgroundColor: 'gray',
    borderRadius: 300,
    alignItems: 'center',
    padding: 10,
  },

  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },

  SignUpHereText: {
    color: 'blue',
    fontWeight: 'bold'
  },
  placeholder: {
    fontSize: 20,
  },
  
  signInWithContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginVertical: 15,
  },

} ) 
