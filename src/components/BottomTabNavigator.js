import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import MapScreenDriver from '../screens/MapScreenDriver';
import Settings from '../screens/Settings';
import AdminConsole from '../screens/AdminConsole';
import DriverEditScreen from '../screens/DriverEditScreen';
import UserEditScreen from '../screens/UserEditScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DriverEdit"
        component={DriverEditScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserEditScreen"
        component={UserEditScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
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

  return (
    <Tab.Navigator
      initialRouteName={'MainHome'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === 'MainHome') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (rn === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (rn === 'AdminConsole') {
            iconName = focused ? 'eye' : 'eye-off';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="MainHome"
        options={{
          title: 'MainHome',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
        }}
        component={HomeScreen}
      />
      {userRole === 'driver' ? (
        <Tab.Screen
          name="Map"
          options={{
            title: 'Map',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
          component={MapScreenDriver}
        />
      ) : (
        <Tab.Screen
          name="Map"
          options={{
            title: 'Map',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
          component={MapScreen}
        />
      )}
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
        }}
        component={Settings}
      />
      {userRole === 'Admin' && (
        <Tab.Screen
          name="AdminConsole"
          options={{
            title: 'Admin',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
          component={AdminConsole}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
