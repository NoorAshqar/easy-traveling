import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import MapScreenDriver from '../screens/MapScreenDriver';
import Settings from '../screens/Settings';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
function BottomTabNavigator() {
  const [userRole, setUserRole] = useState("Driver");

const Tab = createBottomTabNavigator();
const isDarkMode = useColorScheme() === 'dark';
const backgroundStyle = {
  backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
};

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {userRole === 'Driver' ? (
        <Tab.Screen name="Map" component={MapScreenDriver} />
      ) : (
        <Tab.Screen name="Map" component={MapScreen} />
      )
      }
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;