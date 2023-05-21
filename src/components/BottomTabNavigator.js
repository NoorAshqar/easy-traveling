import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import MapScreenDriver from '../screens/MapScreenDriver';
import Settings from '../screens/Settings';
import AdminConsole from '../screens/AdminConsole';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
function BottomTabNavigator() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const currentUser = auth().currentUser;
        const uid = currentUser.uid;

        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const role = userData.Role;
          setUserRole(role);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error', error.message);
      }
    };

    fetchUserRole();
  }, []);

  const Tab = createBottomTabNavigator();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: 'black',
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {userRole === 'Driver' ? (
        <Tab.Screen name="Map" component={MapScreenDriver} />
      ) : (
        <Tab.Screen name="Map" component={MapScreen} />
      )}
      <Tab.Screen name="Settings" component={Settings} />
      {userRole === 'Admin' && <Tab.Screen name="AdminConsole" component={AdminConsole} />}
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
