import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import MapScreenDriver from '../screens/MapScreenDriver';
import Settings from '../screens/Settings';
import AdminConsole from '../screens/AdminConsole';
import DriverEditScreen from '../screens/DriverEditScreen';
import AddDriver from '../screens/AddDriver';
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
      <Stack.Screen
        name="AddDriver"
        component={AddDriver}
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
  
  if (userRole === 'confirmDriver') {
    return (
      <View style={styles.container}>
        <View style={styles.containerHead}>
          <Image
            style={{
              width: '100%',
              height: 450,
            }}
            source={require('../img/bus-wait.jpg')}
          />
          <Text style={styles.title}>
            في حال انك تمتلك صفات سائق جيد ، تواصل معنا وادخل معلوماتك من هنا{' '}
          </Text>
        </View>
        <View style={styles.containerBody}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              Linking.openURL('whatsapp://send?phone=+972569317219');
            }}>
            <Text style={styles.buttonText}>اضغط هنا للتواصل معنا عبر الواتس اب</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
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
  }
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'black',
    fontFamily: 'Roboto',
  },
  title: {
    margin: 'auto',
    fontSize: 27,
    textAlign: 'right',
    display: 'flex',
    alignSelf: 'center',
    marginBottom: 40,
  },
  mainButton: {
    paddingRight: 50,
    paddingLeft: 50,
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#20232a',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 500,
  },
});
export default BottomTabNavigator;
