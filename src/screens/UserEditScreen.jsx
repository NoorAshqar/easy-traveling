import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, ListItem } from 'react-native-elements';
import auth from '@react-native-firebase/auth';


const UserEditScreen = ({ route,navigation }) => {
  const user = route.params.user;
  const [fullName, setFullName] = useState( user.FullName? user.FullName : '');
  const [phoneNumber, setPhoneNumber] = useState(user.PhoneNumber? user.PhoneNumber : '');

  const handleUpdateDriver = () => {
    const currentUser = auth().currentUser;
    const uid = currentUser.uid;
    firestore().collection('Users').doc(uid).update({
      FullName:fullName,
      PhoneNumber:phoneNumber
    })
      .then(() => {
        console.log('User updated successfully');
      })
      .catch(error => {
        console.log('Error updating user:', error);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit your user</Text>
      <TextInput
        style={styles.input}
        placeholder="fullName"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="PhoneNumber"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
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

export default UserEditScreen;