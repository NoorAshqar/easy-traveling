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
import Unauthorized from './src/components/Unauthorized';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import auth from '@react-native-firebase/auth';



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


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user:any) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      {
        user ? (
          <BottomTabNavigator />
        ) : (
          <Unauthorized />
        )
      }
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