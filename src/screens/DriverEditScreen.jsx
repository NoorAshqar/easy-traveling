import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity,Input } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';


const DriverEditScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const route = useRoute();
  const driverData = route.params.driverData;
  console.log(driverData)
  // Add more state variables for other fields you want to edit

  // Add a function to handle updating the driver data
  const handleUpdateDriver = () => {
    // Perform the update logic using the entered data
  };

  return (
    <View>
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      {/* Add more Input components for other fields */}
      <Button title="Update" onPress={handleUpdateDriver} />
    </View>
  );
};

export default DriverEditScreen;