import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';


const DriverEditScreen = ({ route }) => {
  const driver = route.params.driver;
  console.log(driver);
  const [name, setName] = useState( driver.Name? driver.Name : '');
  const [phoneNumber, setPhoneNumber] = useState(driver.PhoneNumber? driver.PhoneNumber : '');
  const [street, setStreet] = useState(driver.Street? driver.Street : '');
  const [prodDate, setProdDate] = useState(driver.ProductionDate? driver.ProductionDate : '');
  const [licExpDate, setLicExpDate] = useState(driver.LicenseExpirationDate? driver.LicenseExpirationDate : '');
  const [vinNo, setVinNo] = useState(driver.VinNo? driver.VinNo : '');
  const [vehicleID, setVehicleID] = useState(driver.VehicleID? driver.VehicleID : '');
  // useEffect(() => {
  //   setName(initialName);
  //   setAge(initialAge);
  // }, [initialName, initialAge]);
  
  // Add more state variables for other fields you want to edit

  // Add a function to handle updating the driver data
  const handleUpdateDriver = () => {
    // Perform the update logic using the entered data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit the driver</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="PhoneNumber"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={street}
        onChangeText={setStreet}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="ProdDate"
        value={prodDate}
        onChangeText={setProdDate}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="licExpDate"
        value={licExpDate}
        onChangeText={setLicExpDate}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Vin No"
        value={vinNo}
        onChangeText={setVinNo}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle ID"
        value={vehicleID}
        onChangeText={setVehicleID}
        placeholderTextColor="#999"
      />
      
      <Button title="Save" onPress={handleUpdateDriver} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    color: 'black',
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

export default DriverEditScreen;