import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import ReactFlagsSelect from "react-flags-select";

// Import the functions you need from the SDKs you need+
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const signupmobileConfirm = ({ route, navigation }) => {
  async function sendVerificationCode() {
    const verificationId = await firebase.auth().signInWithPhoneNumber(route.number);
    // save the verification ID to use later
    setVerificationId(verificationId);
  }

  const handleVerifyCode = () => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then(user => {
          this.setState({ userId: user.uid })
          alert(`Verified! ${user.uid}`)
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Please enter a 6 digit OTP code.')
    }
  }

  async function signInWithVerificationCode() {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    await firebase.auth().signInWithCredential(credential);
    // user is now signed in
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your mobile number</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="123 456"
          maxLength={6}
          keyboardType="numeric" />
      </View>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleVerifyCode}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    bottom: '10%',
  },
  buttonText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 500
  }

});

export default signupmobileConfirm;
