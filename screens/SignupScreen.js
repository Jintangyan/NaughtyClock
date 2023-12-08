import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native'



export function SignupScreen( props ) {
  const navigation = useNavigation();

  // Declaring UseState for both email and password
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState()

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
  //function to validate password
  const validatePassword = (passwordStr) => {
    const passLength = passwordStr.length
    if (passLength >= 8) {
      return true
    }
    else {
      return false
    }
  }

  // Function for signup
  const signUp = ( email, password ) => {
    props.signup( email, password )
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

  useEffect( () => {
    // auth is passed on as a prop from App.js
    if( props.auth ) {
      navigation.reset( { index: 0, routes: [ {name: "Home"} ]},  )
      
    }
  }, [ props.auth ])

  return (
    <KeyboardAvoidingView style={styles.signupView} behavior='padding'>
    
    <Text style = {styles.signUpTitle}>Sign up</Text>

    <View style = {styles.signupForm}>
      
      <Text style = {styles.label}>Email</Text>
      <TextInput style = {styles.input} 
        onChangeText = { (value) => setEmail(value)}
        placeholder="Enter new email here..."
        placeholderTextColor = "darkgray"
        keyboardType="email-address"   
        />


      <Text style = {styles.label}>Password</Text>
      <TextInput style = {styles.input}
        secureTextEntry={true} 
        onChangeText={ (value) => setPassword (value) }
        placeholder="Enter new password here..."
        placeholderTextColor = "darkgray"
        />
    </View>


    <View style={ styles.buttonContainer}>
      <TouchableOpacity style={ (validEmail && validPassword) ? styles.button : styles.buttonDisabled }
        disabled={ (validEmail && validPassword) ? false : true }
        onPress={() => {signUp(email, password)}}>
            <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.contentView}>
      <Text>
        <Text style={styles.content}>Already have an account?</Text>
          <Text style={styles.LoginHereText}
                onPress={() => navigation.navigate('Signin')}>{' '}
            Log in
          </Text>
      </Text>
    </View>

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create( {

  signupView: {  
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signUpTitle: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },

  signupForm: {
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
    width: 300,
    padding: 5,
    marginBottom: 5,
  },


  
  button: {
    backgroundColor: 'dodgerblue',
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

  LoginHereText: {
    color: 'blue',
    fontWeight: 'bold'
  },

} ) 
