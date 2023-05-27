import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import ReactFlagsSelect from "react-flags-select";
import firestore from '@react-native-firebase/firestore';
import LoadingPopup from "../components/LoadingPopup";


const SignUpMobile = () => {
  const [number, onChangeNumber] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [confirmResult, setConfirmResult] = React.useState(null);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [fullName, setFullName] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);


  const signInWithPhoneNumber = async () => {
    setIsLoading(true)
    const fullnumber = '+970' + number;
    try {
      const confirmation = await auth().signInWithPhoneNumber(fullnumber);
      setConfirmResult(confirmation);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('Error', error.message);
    }
  };

  const confirmCode = async () => {
    try {
      setIsLoading(true)
      const userCredential = await confirmResult.confirm(verificationCode);
      const user = userCredential.user;
      await auth().signInWithPhoneNumber(user.phoneNumber);

      await firestore().collection('Users').doc(user?.uid).set({
        FullName: fullName,
        Role: 'passenger',
        PhoneNumber: number,
        CurrentLocation: ''
      });

      const querySnapshot = await firestore()
        .collection('Drivers')
        .where('phoneNumber', '==', phoneNumber)
        .get();

      if (!querySnapshot.empty) {
        const driverDoc = querySnapshot.docs[0];
        const driverData = driverDoc.data();
        const street = driverData.street;
        await firestore().collection('Users').doc(user?.uid).set({
          FullName: fullName,
          Role: 'driver',
          PhoneNumber: number,
          Street: street,
          CurrentLocation: ''
        });
      } else {
        await firestore().collection('Users').doc(user?.uid).set({
          FullName: fullName,
          Role: 'passenger',
          PhoneNumber: number,
          Street: '',
          CurrentLocation: '',
        });
      }
      setIsLoading(false)
      navigation.navigate('BottomTabNavigator');
    } catch (error) {
      setIsLoading(false)
      console.log('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!confirmResult && !fullName && (
        <>
          <Text style={styles.title}>Enter your Full Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={firstName}
              placeholder="first name"
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={setLastName}
              value={lastName}
              placeholder="last name"
            />
          </View>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setFullName(firstName + ' ' + lastName)}
          >
            <Text style={styles.buttonText}>confirm user</Text>
          </TouchableOpacity>
        </>
      )}
      {!confirmResult && fullName && (
        <>
          <Text style={styles.title}>Enter your mobile number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="12345 67890"
              maxLength={10}
              keyboardType="numeric" />
          </View>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={signInWithPhoneNumber}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}
      {confirmResult && fullName && (
        <>
          <Text style={styles.title}>Enter your sms code</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={setVerificationCode}
              value={verificationCode}
              placeholder=""
              maxLength={10}
              keyboardType="numeric" />
          </View>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={confirmCode}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}
      <LoadingPopup isVisible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'black',
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 25,
    fontWeight: 500,
    textAlign: 'left',
    display: 'flex',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
    borderWidth: 1,
    borderBottomColor: 'white',
    width: '60%',
    fontSize: 30,
    textAlign: 'center'
  },
  mainButton: {
    paddingRight: 50,
    paddingLeft: 50,
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 4,
    borderRadius: 10,
    borderColor: "#20232a",
    alignSelf: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  buttonText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 500
  }

});

export default SignUpMobile;
