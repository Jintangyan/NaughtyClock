import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Alert, Modal } from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

// Components
import { ListSeparator } from "../components/ListSeparator";
import { CustomSwitch, Switch } from "../components/CustomSwitch";
import { SwipeFlatList } from "../components/SwipeFlatList";
import { SwipeRow } from "../components/SwipeRow";
import { cloneDeep } from "lodash";
import { SelectTime } from "../components/SelectTime";
import { formatISODateToTimeString } from "./AddAlarmScreen";
// External Lib
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
import { firebaseConfig } from "../config/config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialised the firebase app abd save reference
const FBapp = initializeApp(firebaseConfig);
// Initialised the firestore
const db = getFirestore(FBapp);
const auth = getAuth(FBapp);




// console.log("Firestore connected", db);

export const HomeScreen = ({ route }) => {
  const navigation = useNavigation();

  const [alarms, setAlarms] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [updateItem, setUpdateItem] = useState({});
  // const fetchData = async () => {
  //   const dataFromFirebase = await getAlarmsFromFirebase();
  //   console.log( dataFromFirebase, 'dataFromFirebase')
  //   // const temp = dataFromFirebase
  //   setAlarms(dataFromFirebase);
  // };
  useEffect(() => {
    const listeners = [
      DeviceEventEmitter.addListener("List.refresh", getAlarmsFromFirebase),
    ];
    return () => {
      listeners?.forEach((item) => item?.remove());
    };
  }, []);
  
  useEffect(() => {
  
    // getAlarmList()

    getAlarmsFromFirebase();
  }, []);
  // xxxx

  
  async function getAlarmsFromFirebase() {
    try {
      const alarmList = [];
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      let users = await AsyncStorage.getItem("user");
      users = JSON.parse(users);
      if (querySnapshot.empty) {
        console.log("No documents found.");
      } else {
        for (const doc1 of querySnapshot.docs) {
          
          if (doc1.id === users.uid) {
            const alarmListRef = collection(doc1.ref, "alarmList");
            const alarmSnapshot = await getDocs(alarmListRef);

            alarmSnapshot.forEach((alarmDoc) => {
              alarmList.push({ id: alarmDoc.id, ...alarmDoc.data() });
            });
          }
        }
      }
      console.log(alarmList, "alarmList");
      if (alarmList.length === 0) {
        setAlarms([]);
        return;
      }
      const tempList = alarmList.sort((a, b) => {
        const [hourA, minuteA, periodA] = a.time.match(/(\d+):(\d+) ([ap]m)/)?.slice(1);
        const [hourB, minuteB, periodB] = b.time.match(/(\d+):(\d+) ([ap]m)/)?.slice(1);
   
        if (periodA !== periodB) {
          return periodA.localeCompare(periodB);
        }
      
        
        if (parseInt(hourA) !== parseInt(hourB)) {
          return parseInt(hourA) - parseInt(hourB);
        }
      
        return parseInt(minuteA) - parseInt(minuteB);
      });
      console.log(tempList, 'templist')
      // const tempList = cloneDeep(alarmList)
      setAlarms(tempList);
      // return alarmList;
    } catch (error) {
      console.error("Error getting alarm list: ", error);
      return [];
    }
  }

  
  const switchAlarm = async (index) => {
    const templist = cloneDeep(alarms);
    templist[index].isActive = !templist[index].isActive;
    setAlarms(templist);
    updateAlarmItem(templist[index]);
  };
  const onHiddenAreaPressed = async item => {
    let users = await AsyncStorage.getItem("user");
    users = JSON.parse(users);
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    try {
      for (const doc of querySnapshot.docs) {
        
        if (doc.id === users.uid) {
          const alarmListRef = collection(doc.ref, "alarmList");
          const docRefs = await getDocs(alarmListRef);
          for (const dc of docRefs.docs) {
            if (dc.id === item.id) {
              await deleteDoc(dc.ref);
              console.log("Item deleted successfully!");
              await getAlarmsFromFirebase();
            }
            
          }

        }
      }
    } catch (error) {
      console.error("Error deleted new item: ", error);
    }
  }

  
  const updateAlarmItem = async (newData) => {
    try {
      console.log("update", newData);
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      let users = await AsyncStorage.getItem("user");
      users = JSON.parse(users);
      
      if (querySnapshot.empty) {
        console.log("No documents found.");
      } else {
        for (const doc of querySnapshot.docs) {
          
          if (doc.id === users.uid) {
            const alarmListRef = collection(doc.ref, "alarmList");
            const docRefs = await getDocs(alarmListRef);
            for (const dc of docRefs.docs) {
              console.log(dc, 'doccccc')
              console.log()
              if (dc.id === newData.id) {
                console.log(dc.id, 'iddd')
                await updateDoc(dc.ref, {
                  time: newData.time,
                  date: newData.date,
                  isActive: newData.isActive
                });
                console.log("Item updated successfully!");
                setModalVisible(false);
                await getAlarmsFromFirebase();
              }
              
            }
            // getAlarmsFromFirebase();
          }
        }
      }
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

 
  const onTimeChange = (selectedDate) => {
    
    setDate(new Date(selectedDate));
   
    const currentDate = formatISODateToTimeString(selectedDate);
    
    setTime(currentDate);
  };
  
  const saveAlarm = () => {
    const newItem = {
      ...updateItem,
      time: time,
      date: JSON.stringify(date),
    };
    updateAlarmItem(newItem);
  };
  const showPicker = (item) => {
    setModalVisible(true);
    setDate(JSON.parse(item.date));
    console.log(item, "itttt");
    setUpdateItem(item);
  };
  // onPress={() => showPicker(item)}
  const renderAlarm = ({ item, index }) => (
    <TouchableOpacity style={styles.alarmItem} onPress={() => showPicker(item)}>
      <Text style={styles.alarmText}>{item.time}</Text>

      <CustomSwitch
        value={item.isActive}
        onValueChange={() => switchAlarm(index)}
      />
    </TouchableOpacity>
  );

  const _renderHiddenItem = () => {
    return (
      <View
        style={{
          width: 72,
          height: 64,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "red",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, lineHeight: 19 }}>
          Delete
        </Text>
      </View>
    );
  };
  const _getItemLayout = (item, index) => {
    return {
      length: 60,
      offset: 60 * index + 40, // ListHeaderComponent.height
      index,
    };
  };
  return (
    <View style={styles.container}>
    
      <SwipeFlatList
        data={alarms}
        keyExtrator={(item, index) => item.id}
        renderItem={renderAlarm}
        renderHiddenItem={_renderHiddenItem}
        onHiddenAreaPress={onHiddenAreaPressed}
        onLayout={() => {}}
        hiddenItemWidth={72}
        lineHeight={64}
        getItemLayout={_getItemLayout}
      />
        <TouchableOpacity onPress={() => getAlarmsFromFirebase()}>
          
        <Text style={styles.refreshText}>REFRESH</Text>

      </TouchableOpacity>
      <SelectTime
        modalVisible={modalVisible}
        seletedTime={new Date(date)}
        setModalVisible={setModalVisible}
        saveAlarm={saveAlarm}
        onTimeChange={onTimeChange}
        resetSelectTime={() => setTime("")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F3F5FA",
    // backgroundColor: 'red',
    alignItems: "center",
    // paddingHorizontal: 20,
    paddingTop: 0,
  },
  alarmItem: {
    // width: '100%',
    width: Dimensions.get("window").width,
    height: 64,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 30,
    //borderRadius: 8,
    backgroundColor: "#fff",
  },
  alarmText: {
    fontSize: 18,
    fontWeight: "500",
  },
  refreshText: {
    marginHorizontal: 10, 
    fontSize:15,
    marginTop:10,
    fontWeight:'bold',
  },
});
