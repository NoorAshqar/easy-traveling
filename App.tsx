/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import Landing from './src/screens/landing';
import SignUpMobile from './src/screens/signupmobile';
import SignUpEmail from './src/screens/signupemail';



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
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createStackNavigator();


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Landing} options={{ headerShown: false }} />
        <Stack.Screen
            name="SignUpM" 
            component={SignUpMobile} 
            options={{ 
              title:"Sign Up",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white',
              }} />
        <Stack.Screen
            name="SignUpE" 
            component={SignUpEmail} 
            options={{ 
              title:"Sign Up",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white', }} />
        <Stack.Screen
            name="Account" 
            component={SignUpEmail} 
            options={{ 
              title:"Sign Up",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white', }} />
        <Stack.Screen
            name="SignUpName" 
            component={SignUpEmail} 
            options={{ 
              title:"Sign Up",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white', }} />
        <Stack.Screen
            name="MapScreen" 
            component={SignUpEmail} 
            options={{ 
              title:"",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white', }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
