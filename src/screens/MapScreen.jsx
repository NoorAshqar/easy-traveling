import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        const uid = currentUser.uid;
        console.log(uid,"uid")
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUser(uid);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error', error.message);
      }
    };

    fetchUserData();
  }, []);

  const shareMyLocation = () => {
    if (user) {
      const { uid } = user;
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          firestore().collection('Users').doc(uid).update({
            CurrentLocation: {
              latitude : 1,
              longitude : 2,
            },
          })
            .then(() => {
              console.log('User location updated successfully');
            })
            .catch(error => {
              console.log('Error updating user location:', error);
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        {/* Add your selector component here */}
        <Picker style={{color:'white'}}>
          <Picker.Item label="Option 1" value="option1" />
          <Picker.Item label="Option 2" value="option2" />
        </Picker>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={currentPosition}
        >
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title={"My Location"}
              description={"This is my current location"}
            />
          )}
        </MapView>
      </View>
      <View style={styles.driverDataContainer}>
        <Button title="Share My Location" onPress={shareMyLocation} />
        {/* Add your driver data components here */}
        <Text style={styles.driverDataText}>Driver Name: John Doe</Text>
        <Text style={styles.driverDataText}>Vehicle: ABC123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  selectorContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverDataContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  driverDataText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
});
