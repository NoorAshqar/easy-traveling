import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';

const DriverListScreen = ({ navigation }) => {
  const [drivers, setDrivers] = useState([]);

  const handleDriverDetails = (driver) => {
    navigation.navigate('DriverEdit',{driver: driver});
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const querySnapshot = await firestore().collection('Drivers').get();
        const driverData = [];
        querySnapshot.forEach((doc) => {
          const driver = doc.data();
          driverData.push(driver);
        });

        setDrivers(driverData);

      } catch (error) {
        console.log('Error', error.message);
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
          <TouchableOpacity onPress={()=>{handleDriverDetails(item)}} style={{ position: 'absolute', top: 10, right: 10 }}>
            <Text style={{ color: 'red', fontSize: 20 }}>Edit</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
      <Text style={styles.title}>Driver List</Text>
      <FlatList
        data={drivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.VehicleID}
      />
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
});

export default DriverListScreen;
