import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import database from '@react-native-firebase/database';

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);

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

  requestLocationPermission();

  useEffect(() => {
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
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        database().ref('/Users').set({
          CurrentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
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
        <Button
          title={'Share My location'}
          onPress={ShareMylocation}
        />
      </MapView>
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
