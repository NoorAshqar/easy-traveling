import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LoadingPopup from "../components/LoadingPopup";


export default function MapScreenDriver() {

  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackingOn, setTrackingOn] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState("");
  const [userID, setUserID] = useState(null);
  const [userStreet, setUserStreet] = useState(null);
  const [passengerMarkers, setPassengerMarkers] = useState([]);
  const [passengerCount, setPassengerCount] = useState(0);
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
    setIsLoading(true)
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        const uid = currentUser.uid;
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
          setUserID(uid);
          const userData = userDoc.data();
          setUserStreet(userData.Street);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error', error.message);
      }
    };
    fetchUserData();

    requestLocationPermission();
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
    setIsLoading(false)
  }, []);

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = firestore()
      .collection('Users')
      .where('Role', '==', 'passenger')
      .where('Street', '==', userStreet)
      .onSnapshot(snapshot => {
        const markers = snapshot.docs
          .filter(doc => {
            const currentLocation = doc.data().CurrentLocation;
            return currentLocation && currentLocation.latitude !== 0 && currentLocation.longitude !== 0;
          })
          .map(doc => ({
            id: doc.id,
            location: {
              latitude: doc.data().CurrentLocation.latitude,
              longitude: doc.data().CurrentLocation.longitude,
            },
            fullName: doc.data().FullName,
            phoneNumber: doc.data().PhoneNumber,
          }));
        setPassengerMarkers(markers);
      });

    setIsLoading(false)
    return () => unsubscribe();
  }, [userStreet]);

  const ShareMylocation = () => {
    setTrackingOn(true);
    var interval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          const { latitude, longitude } = position.coords;
          firestore().collection('Users').doc(userID).update({
            CurrentLocation: {
              latitude: latitude,
              longitude: longitude,
            },
          })
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }, 60000);
    setIntervalId(interval);
  };

  const stopSharing = () => {
    setTrackingOn(false);
    return () => clearInterval(intervalId);
  };

  const increasePassengerCount = () => {
    setPassengerCount(prevCount => prevCount + 1);
    firestore().collection('Users').doc(userID).update({
      Passengers: passengerCount
    })
      .then(() => {
        console.log('Passengers increased');
      })
      .catch(error => {
        console.log('Error updating user:', error);
      })

  };

  const handleRemovePassenger = (passengerId) => {
    firestore().collection('Users').doc(passengerId).update({
      Street: '',
      CurrentLocation: {
        latitude: 0,
        longitude: 0,
      },
    })
      .then(() => {
        setSelectedPassenger("");
        console.log('Passenger data updated successfully');
      })
      .catch(error => {
        console.log('Error updating passenger data:', error);
      });
  };
  const decreasePassengerCount = () => {
    setPassengerCount(prevCount => (prevCount > 0 ? prevCount - 1 : prevCount));

  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: selectedPassenger ? 1 : 0, // Animate to 1 if selectedDriver is not null, otherwise 0
      duration: 500, // Set the duration of the animation
      useNativeDriver: true, // Enable native driver for better performance
    }).start();
  }, [selectedPassenger]);
  useEffect((() => {
    firestore().collection('Users').doc(userID).update({
      Passengers: passengerCount
    })
  }), [passengerCount])
  const customMarkerIcon = require('../img/person.png');

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={currentPosition}
          onPress={()=>{setSelectedPassenger("")}} 
        >
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title={"My Location"}
              description={"This is my current location"}
            />
          )}
          {passengerMarkers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.location}
              title={marker.fullName + ''}
              description={marker.phoneNumber + ''}
              onPress={() => {
                setSelectedPassenger(marker.id)
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
        <TouchableOpacity
          onPress={trackingOn ? stopSharing : ShareMylocation}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{trackingOn ? 'Stop Tracking' : 'Start Tracking'}</Text>
        </TouchableOpacity>
        <View style={styles.passengerCountContainer}>
          <Text style={styles.buttonText}>ركاب</Text>
          <TouchableOpacity
            onPress={decreasePassengerCount}
            style={[styles.button, styles.passengerButton]}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.passengerCountText}>{passengerCount}</Text>
          <TouchableOpacity
            onPress={increasePassengerCount}
            style={[styles.button, styles.passengerButton]}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        {selectedPassenger && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.driverDataRow}>
              <TouchableOpacity onPress={() => handleRemovePassenger(selectedPassenger)}>
                <Text style={styles.removeText}>استلام</Text>
              </TouchableOpacity>
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
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  passengerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerButton: {
    marginHorizontal: 8,
  },
  passengerCountText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  removeText: {
    color: 'white',
    backgroundColor: 'red',
    padding: 3,
    textAlign: 'center'
  }
});
