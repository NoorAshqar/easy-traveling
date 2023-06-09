import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, View, Button, } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';
import LoadingPopup from "../components/LoadingPopup";

const DriverListScreen = ({ navigation }) => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDriverDetails = (driver) => {
    navigation.navigate('DriverEdit', { driver: driver });
  };

  useEffect(() => {
    setIsLoading(true)
    const fetchDrivers = async () => {
      try {
        const querySnapshot = await firestore().collection('Drivers').get();
        const driverData = [];
        querySnapshot.forEach((doc) => {
          const driver = doc.data();
          driverData.push(driver);
        });

        setDrivers(driverData);
        setIsLoading(false)
      } catch (error) {
        console.log('Error', error.message);
        setIsLoading(false)
      }
    };

    fetchDrivers();
  }, []);

  const renderDriverItem = ({ item, index }) => (
    <Card >
      <ListItem key={index}>
        <ListItem.Content>
          <ListItem.Title>Name: {item.Name}</ListItem.Title>
          <ListItem.Title>Phone Number: {item.PhoneNumber}</ListItem.Title>
          <ListItem.Title>Street: {item.Street}</ListItem.Title>
          <ListItem.Title>Production Date:: {item.ProductionDate}</ListItem.Title>
          <ListItem.Title>License expiration date: {item.LicenseExpirationDate}</ListItem.Title>
          <ListItem.Title>Vin No: {item.VinNo}</ListItem.Title>
          <ListItem.Title>Vehicle ID: {item.VehicleID}</ListItem.Title>
          <TouchableOpacity onPress={() => { handleDriverDetails(item) }} style={{ position: 'absolute', top: 10, right: 10 }}>
            <Text style={{ color: 'red', fontSize: 20 }}>Edit</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
      <View style={styles.header}>
        <Button title="اضافة سائق" onPress={() => {
          navigation.navigate('AddDriver');
        }} />
        <Text style={styles.title}>قائمة السائقين</Text>
      </View>
      <FlatList
        data={drivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.VehicleID}
      />
      <LoadingPopup isVisible={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'black',
    fontFamily: 'Roboto',
  },
  list: {
    color: 'black'
  },
  title: {
    fontSize: 25,
    fontWeight: 500,
    textAlign: 'left',
    display: 'flex',
    alignSelf: 'center',
    color: 'black',
    marginTop: 40,
    marginBottom: 40,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
});

export default DriverListScreen;
