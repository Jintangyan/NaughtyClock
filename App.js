// / Imported from react mostyl hooks
import { useState,useEffect } from 'react';

// Imported from react-native components
import { StyleSheet,DeviceEventEmitter } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Imported all screens for this app
import { SigninScreen } from './screens/SigninScreen'
import { SignupScreen } from './screens/SignupScreen'
import { SettingScreen } from './screens/SettingScreen'
import { AddAlarmScreen } from './screens/AddAlarmScreen'
import { BarNavigator } from './components/BarNavigator'
import { LogoTitle} from './components/LogoTitle'
import AsyncStorage from '@react-native-async-storage/async-storage'


// Firebase config
import { firebaseConfig } from './config/config'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  query,
  onSnapshot,
  doc,
  setDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

// Initialised the firebase app abd save reference
const FBapp = initializeApp(firebaseConfig)

// Initialised the firestore
const db = getFirestore(FBapp)


const Stack = createNativeStackNavigator()

export default function App() {

  // Store state of user
  const [user, setUser] = useState()

  // Store state of data
  const [appData, setAppData] = useState()
  
  useEffect(() => {
    const listeners = [
      DeviceEventEmitter.addListener("User.logout", signout),
    ];
    return () => {
      listeners?.forEach((item) => item?.remove());
    };
  }, []);

  // Verify user authentication
  const register = (email, password) => {

    createUserWithEmailAndPassword(authObj, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
       
        addUserInfo(userCredential.user.uid)
        
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  const addUserInfo = async id => {
   
    await setDoc(doc(db, 'users', id), {});
  }

  // Sign in function
  const signin = (email, password) => {

    signInWithEmailAndPassword(authObj, email, password)
      .then((userCredential) => setUser(userCredential.user))
      .catch((error) => console.log(error))
  }

  const signout = () => {
    signOut(authObj)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null);
      })
      .catch((error) => console.log("Sign out error:", error));
  };
  
  // Get data/document from firestore
  const getDataFromFirestore = (FScollection) => {
    const FSquery = query(collection(db, FScollection))
    const unsubscribe = onSnapshot(FSquery, (querySnapshot) => {
      let FSdata = []
      querySnapshot.forEach((doc) => {
        let item = {}
        item = doc.data()
        item.id = doc.id
        FSdata.push(item)
      })
      setAppData(FSdata)
    })
  }


  // check for changes which includes authentication of users and document availability
    const authObj = getAuth()
   onAuthStateChanged(authObj, (user) => {
   if (user) {
       setUser(user)
       AsyncStorage.setItem('user', JSON.stringify(user));
       console.log(user.uid, 'user.uid')
       if (!appData) {
         getDataFromFirestore(`users/${user.uid}/alarmList`)
   
       }
      }
     else {
       setUser(null)
     }
   })



  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
         
        headerStyle: {
          backgroundColor: '#94D1FA',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} >

        <Stack.Screen name="Signin" options={{
          headerLeft: (props) => <LogoTitle {...props} />,
          title: "Log in", headerTintColor: '#000'
        }} >

          {(props) => <SigninScreen {...props} signin={signin} auth={user} />}
        </Stack.Screen>

        <Stack.Screen name="Signup" options={{
          headerLeft: (props) => <LogoTitle {...props} />,
          title: "Sign up", headerTintColor: '#000'
        }} >

          {(props) => <SignupScreen {...props} signup={register} auth={user} />}
        </Stack.Screen>
        
           <Stack.Screen
            name="Home"
            component={BarNavigator}
            options={({ route }) => ({
            headerLeft: () => <LogoTitle />,
            title: '',
    })}
>
        
        </Stack.Screen>
          <Stack.Screen
            name="AddAlarm"
            component={AddAlarmScreen}
            options={({ route }) => ({  
                headerLeft: () => <LogoTitle />,          
                title: '',
    })}
>
</Stack.Screen>

        <Stack.Screen name="Settings" options={{
          headerLeft: (props) => <LogoTitle {...props} />,
          title: "", 
        }} >
          {(props) => <SettingScreen {...props} signout={signout} auth={user} />}
        </Stack.Screen>

      </Stack.Navigator>  
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  

  titleText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 17,
    marginLeft: 15,
   
  }

});
