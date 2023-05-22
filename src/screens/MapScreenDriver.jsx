import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View,TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MapScreenDriver() {

  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackingOn, setTrackingOn] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs to access your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted.');
      } else {
        console.log('Location permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  

  useEffect(() => {
   requestLocationPermission();
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);
  
  const ShareMylocation = () => {
    // get the user's location every minute
    setTrackingOn(true);
    var interval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          // update the current location state
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // update the location data to Firebase real-time database
          database().ref('/Users').set({
            CurrentLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }, 60000);
    setIntervalId(interval);

  }
  const stopSharing = () => {
    setTrackingOn(false);
    return () => clearInterval(intervalId);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentPosition}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title={"My Location"}
            description={"This is my current location"}
          />
        )}
      </MapView>
      <TouchableOpacity
        onPress={trackingOn ? stopSharing : ShareMylocation}
      >
        <Text>{trackingOn ? 'Stop Tracking' : 'Start Tracking2'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
