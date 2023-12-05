import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  FlatList,
  Dimensions,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  DeviceEventEmitter,
} from "react-native";
//import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView } from "react-native";
import DatePicker from "react-native-date-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components
import { ListSeparator } from "../components/ListSeparator";

import { SelectTime } from "../components/SelectTime";

// Firebase config
import { firebaseConfig } from "../config/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "@firebase/firestore";
// Initialised the firebase app abd save reference
const FBapp = initializeApp(firebaseConfig);
// Initialised the firestore
const db = getFirestore(FBapp);


export const formatISODateToTimeString = (isoDateString) => {
  const date = new Date(isoDateString);
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const formattedHours = hours % 12 || 12;


  const ampm = hours >= 12 ? "pm" : "am";
  
  const timeString = `${formattedHours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;
  return timeString;
};

export const AddAlarmScreen = ({ navigation }) => {
  const [time, setTime] = useState('');
  const [ringtone, setRingtone] = useState("Default Ringtone");
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const addItem = async () => {
    let users = await AsyncStorage.getItem("user");
    users = JSON.parse(users);
    const usersRef = collection(db, "users"); 
    const querySnapshot = await getDocs(usersRef);
   
    const newItem = { time: time, isActive: true, date: JSON.stringify(date)};

    try {
      for (const doc of querySnapshot.docs) {
    
        if (doc.id === users.uid) {
          const alarmListRef = collection(doc.ref, "alarmList");
          const docRef = await addDoc(alarmListRef, newItem);
          console.log("New item added with ID: ", docRef.id);
        }
      }
    } catch (error) {
      console.error("Error adding new item: ", error);
    }
  };

  
  const saveAlarm = async () => {
    await addItem();
    setModalVisible(false);
    DeviceEventEmitter.emit("List.refresh");
    
    navigation.navigate("Home");
  };


  const onTimeChange = (selectedDate) => {
   
    console.log('SelectDate',selectedDate )
    setDate(selectedDate);
 
    const currentDate = formatISODateToTimeString(selectedDate);
    console.log(currentDate, 'currentDate')
  
    setTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.alarmTimeText}>SET ALARM TIME </Text>
      
      <TouchableHighlight
        style={styles.startButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.startText}>Start</Text>
      </TouchableHighlight>

      <SelectTime
        modalVisible={modalVisible}
        seletedTime={date}
        setModalVisible={setModalVisible}
        saveAlarm={saveAlarm}
        onTimeChange={onTimeChange}
        resetSelectTime={() => setTime(new Date())}
      />
      {/* <Button title="Save Alarm" onPress={saveAlarm} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  container: {
    paddingTop: 200,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    position: "relative",
    // backgroundColor: 'red',
    height: Dimensions.get("window").height,
  },
  DatePicker: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  buttonContainer: {
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  buttonItem: {
    marginRight: 10,
  },
  operate: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  modalView1: {
    // backgroundColor: "red",
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  datepickContainer: {
    marginTop: 140,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  openButton: {
    //  color: '#d1a853'
  },
  startButton:{
    backgroundColor: '#94D1FA', 
    padding: 20, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 80, 
    height: 80, 
    marginTop:20,

  },
  startText:{
    color: 'white',
    fontSize: 18, 
    fontWeight:'bold',
  },
  textStyle: {
    color: "#d1a853",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "white",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  setting: {
    // marginTop: 20,
    width: Dimensions.get("window").width - 32,
    flexDirection: "row",
    paddingHorizontal: 16,
    backgroundColor: "#f4f4f5",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    height: 40,
  },
  alarmTimeText: {
    fontWeight: "bold",
    fontSize: 30,
  },
});
