import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Button, Image, Animated } from "react-native";

import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import LoadingPopup from "../components/LoadingPopup";

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [userID, setUserID] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streets, setStreets] = useState([]);
  const [driverMarkers, setDriverMarkers] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;




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
    if (selectedStreet) {
      fetchDriverLocations(selectedStreet);
    }
  }, [selectedStreet]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: selectedDriver ? 1 : 0, // Animate to 1 if selectedDriver is not null, otherwise 0
      duration: 500, // Set the duration of the animation
      useNativeDriver: true, // Enable native driver for better performance
    }).start();
  }, [selectedDriver]);


  useEffect(() => {
    setIsLoading(true);
    requestLocationPermission();
    // Clear previous interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        const uid = currentUser.uid;
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
          setUserID(uid);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
    const fetchStreets = async () => {
      try {
        const snapshot = await firestore().collection('Users').get();
        const streetsData = [...new Set(snapshot.docs.map(doc => doc.data().Street).filter(Street => Street !== ''))];
        setStreets(streetsData);
      } catch (error) {
        console.log('Error fetching streets:', error);
      }
    };

    fetchStreets();
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
    setIsLoading(false);
  }, []);

  const shareMyLocation = () => {
    if (userID) {
      setIsLoading(true);
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          firestore().collection('Users').doc(userID).update({
            CurrentLocation: {
              latitude: latitude,
              longitude: longitude,
            },
          })
            .then(() => {
              console.log('User location updated successfully');
            })
            .catch(error => {
              console.log('Error updating user location:', error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
        error => {
          console.log(error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    }
  };


  const fetchDriverLocations = async (street) => {
    try {
      firestore().collection('Users').doc(userID).update({
        Street:street,
      })
        .then(() => {
          console.log('User location updated successfully');
        })
        .catch(error => {
          console.log('Error updating user location:', error);
        })
      const snapshot = await firestore()
        .collection('Users')
        .where('Street', '==', street)
        .where('Role', '==', 'driver')
        .get();

      const markers = snapshot.docs.map(doc => ({
        id: doc.id,
        location: {
          latitude: doc.data().CurrentLocation.latitude,
          longitude: doc.data().CurrentLocation.longitude,
        },
        Passengers: doc.data().Passengers,
        FullName: doc.data().FullName,
        PhoneNumber: doc.data().PhoneNumber,
        Cost: doc.data().Cost,
      }));
      console.log(markers,"markers")
      setDriverMarkers(markers);

      const newIntervalId = setInterval(() => {
        fetchDriverLocations(street);
      }, 60000); // Fetch every 1 minute
      setIntervalId(newIntervalId);
    } catch (error) {
      console.log('Error fetching driver locations:', error);
    }
  };

  const customMarkerIcon = require('../img/bus-stop.png');

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Choose Your Street:</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedStreet}
          onValueChange={(value) => {
            setSelectedStreet(value)
            fetchDriverLocations(value);
          }}
        >
          <Picker.Item label="select a street" value="" />
          {streets.map((street, index) => (
            <Picker.Item key={index} label={street} value={street} />
          ))}
        </Picker>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={currentPosition}
          onPress={() => { setSelectedDriver([]) }}
        >
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title={"My Location"}
              description={"This is my current location"}
            />
          )}
          {driverMarkers.length > 0 && driverMarkers?.map(marker =>
          (
            <Marker
              key={marker.id}
              coordinate={marker.location}
              title={marker.FullName}
              description={marker.Cost + ""}
              onPress={() => {
                setSelectedDriver(
                  [
                    marker.FullName,
                    marker.PhoneNumber,
                    marker.Cost,
                    marker.Passengers
                  ]
                )
              }}
            >
              <Image
                source={customMarkerIcon}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </Marker>
          ))}
        </MapView>
      </View>
      <View style={styles.driverDataContainer}>
        <Button title={selectedStreet ? 'انشر موقعك للسائق' : 'اختر شارع اولا'} disabled={!selectedStreet} onPress={shareMyLocation} />
        {selectedDriver.length > 0 && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.driverDataRow}>
              <Text style={styles.label}>اسم السائق:</Text>
              <Text style={styles.driverDataText}>{selectedDriver[0]}</Text>
            </View>
            <View style={styles.driverDataRow}>
              <Text style={styles.label}>هاتف السائق:</Text>
              <Text style={styles.driverDataText}>{selectedDriver[1]}</Text>
            </View>
            <View style={styles.driverDataRow}>
              <Text style={styles.label}>سعر:</Text>
              <Text style={styles.driverDataText}>{selectedDriver[2]}</Text>
            </View>
            <View style={styles.driverDataRow}>
              <Text style={styles.label}>عدد الركاب:</Text>
              <Text style={styles.driverDataText}>{selectedDriver[3]}</Text>
            </View>
          </Animated.View>
        )}

      </View>
      <LoadingPopup isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  picker: {
    width: '50%',
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center'
  },
  driverDataContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  driverDataText: {
    fontSize: 16,
    color: 'white',
    // marginBottom: 8,
  },
  driverDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  }
});
