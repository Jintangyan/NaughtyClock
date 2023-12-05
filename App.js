// / Imported from react mostyl hooks
import { useState } from 'react';

// Imported from react-native components
import { StyleSheet, Text, View, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Imported all screens for this app
import  {HomeScreen}  from './screens/HomeScreen'
import { SigninScreen } from './screens/SigninScreen'
import { SignupScreen } from './screens/SignupScreen'
import { SignoutButton } from './components/SignoutButton'
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
  doc
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

  // Verify user authentication
  const register = (email, password) => {

    createUserWithEmailAndPassword(authObj, email, password)
      .then((userCredential) => {
        setUser(userCredential.user)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Sign in function
  const signin = (email, password) => {

    signInWithEmailAndPassword(authObj, email, password)
      .then((userCredential) => setUser(userCredential.user))
      .catch((error) => console.log(error))
  }

  // Sign out function
  const signout = () => {
    signOut(authObj)
      .then(() => setUser(null))
      .catch((error) => console.log(error))
  }

  // Adding data/document to firestore
  const addDataToFirestore = async (FScollection, data) => {
    // add data to a collection with FS generated id
    const ref = await addDoc(collection(db, FScollection), data)
    return ref.id
  }

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

  // edit data to fiestore
  const editDataToFirestore = async (FScollection, data,) => {

    // edit data to a collection with FS generated id
    const frankDocRef = doc(db, FScollection, data.id);
    const ref = await updateDoc(frankDocRef, data)
    console.log(ref.id)
  }

  // change status of data to firestore
  const changeDataStatusToFirestore = async (FScollection, data) => {
    // edit data to a collection with FS generated id
    const frankDocRef = doc(db, FScollection, data.id);
    const ref = await updateDoc(frankDocRef, data)
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
//   const authObj = getAuth()
//  onAuthStateChanged(authObj, (user) => {
//      if (user) {
//          setUser(user)
//          if (!appData) {
//              getAlarmsFromFirebase(user.uid).then(alarmList => {
//                 
//              });
//         }     }
//    else {
//          setUser(null)
//      }
//  })


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
        
        {/* <Stack.Screen
          name="Home"
          component={BarNavigator}
          options={({ route }) => ({  
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerRight: (props) => <SignoutButton {...props} signout={signout} />,
          headerLeft: () => (
          <Text style={styles.titleText}>
           {route.name}
           </Text>
           ),
           })}> */}
           <Stack.Screen
            name="Home"
            component={BarNavigator}
            options={({ route }) => ({
            headerLeft: () => <LogoTitle />,
            headerRight: (props) => <SignoutButton {...props} signout={signout} />,
            headerTitleAlign: 'center',
            title: '',
            headerTintColor: '#000'
    })}
>
          {/* {(props) => <HomeScreen {...props} auth={user} addDataToFirestore={addDataToFirestore} data={appData} getDataFromFirestore={getDataFromFirestore} changeDataStatusToFirestore={changeDataStatusToFirestore} />} */}
        </Stack.Screen>

        {/* <Stack.Screen
          name="AddAlarm"
          component={AddAlarmScreen}
          options={({ route }) => ({  
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerRight: (props) => <SignoutButton {...props} signout={signout} />,
          headerLeft: () => (
          <Text style={styles.titleText}>
           {route.name}
           </Text>
           ),
           })}>
          </Stack.Screen> */}
          <Stack.Screen
            name="AddAlarm"
            component={AddAlarmScreen}
            options={({ route }) => ({  
                headerLeft: () => <LogoTitle />,
                headerRight: (props) => <SignoutButton {...props} signout={signout} />,
                headerTitleAlign: 'center',
                headerTintColor: '#000',
                title: '',
    })}
>
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
