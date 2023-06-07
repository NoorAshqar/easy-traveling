import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';


const AddDriver = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [prodDate, setProdDate] = useState('');
  const [licExpDate, setLicExpDate] = useState('');
  const [vinNo, setVinNo] = useState('');
  const [vehicleID, setVehicleID] = useState('');
  const [cost, setCost] = useState('');

  const addingDriver = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('PhoneNumber', '==', phoneNumber)
        .where('Role', '==', 'confirmDriver')
        .get();

      if (!querySnapshot.empty) {
        const updatePromises = querySnapshot.docs.map((driverDoc) => {
          const driverData = driverDoc.data();
          const id = driverData.id;
          return firestore().collection('Users').doc(id).update({
            Role: 'driver',
            Street: street,
            Cost: cost,
          });
        });

        await Promise.all(updatePromises);
      }

      await firestore().collection('Drivers').add({
        Name: name,
        PhoneNumber: phoneNumber,
        Street: street,
        ProductionDate: prodDate,
        LicenseExpirationDate: licExpDate,
        VinNo: vinNo,
        VehicleID: vehicleID,
        Cost: cost
      });

      console.log('User updated successfully');
    } catch (error) {
      console.log('Error updating user:', error);
    } finally {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تحرير السائق</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Cost"
        value={cost}
        onChangeText={setCost}
        placeholderTextColor="#999"
      />

      <Button title="Save"
        disabled={!cost || !vehicleID || !vinNo || !licExpDate || !prodDate || !street || !phoneNumber || !name}
        onPress={addingDriver} />
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

export default AddDriver;