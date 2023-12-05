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
import DatePicker from 'react-native-date-picker'
export const SelectTime = (props) => {
  const { modalVisible, setModalVisible, seletedTime, saveAlarm, onTimeChange, resetSelectTime } = props;
  console.log(seletedTime, 'seletedTime')
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(false);
        }}
      >
        <View style={styles.content}>
          <View style={styles.modalView1}>
            <View style={styles.operate}>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={() => {
                  setModalVisible(false);
                  resetSelectTime();
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <Text style={styles.title}>Add Alarm</Text>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={() => {
                  saveAlarm();
                }}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.datepickContainer}>
              <DatePicker
                style={styles.DatePicker}
                mode={"time"}
                date={seletedTime}
                onDateChange={onTimeChange}
              />
            </View>
            
            <View style={styles.setting}>
              <Text style={styles.title}>Sound</Text>
              <Text style={styles.title}>Silk {">"} </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    datepickContainer: {
        marginTop: 140,
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      },
      DatePicker: {
        position: "absolute",
        bottom: 0,
        width: Dimensions.get("window").width,
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
      alarmTimeText:{
        fontWeight: "bold",
        fontSize:30,
        
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

});
