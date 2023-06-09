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
  const [driverMode, setDriverMode] = React.useState(false);




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

      const querySnapshot = await firestore()
        .collection('Drivers')
        .where('PhoneNumber', '==', number)
        .get();

      if (!querySnapshot.empty) {
        const driverDoc = querySnapshot.docs[0];
        const driverData = driverDoc.data();
        console.log(driverData, "driverData");
        const street = driverData.Street;
        const Cost = driverData.Cost;
        await firestore().collection('Users').doc(user?.uid).set({
          FullName: fullName,
          Role: 'driver',
          PhoneNumber: number,
          Street: street,
          CurrentLocation: {
            latitude: 0,
            longitude: 0
          },
          Cost: Cost,
          Passengers: '',
        });
      }
      else if (driverMode) {
        await firestore().collection('Users').doc(user?.uid).set({
          FullName: fullName,
          Role: 'confirmDriver',
          PhoneNumber: number,
          Street: '',
          CurrentLocation: {
            latitude: 0,
            longitude: 0
          },
        });
      }
      else {
        await firestore().collection('Users').doc(user?.uid).set({
          FullName: fullName,
          Role: 'passenger',
          PhoneNumber: number,
          Street: '',
          CurrentLocation: {
            latitude: 0,
            longitude: 0
          },
        });
      }
      setIsLoading(false)
      if(driverMode){
        navigation.navigate('landing');
      }
      else {
        navigation.navigate('BottomTabNavigator');
      }
    } catch (error) {
      setIsLoading(false)
      console.log('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!confirmResult && !fullName && (
        <>
          
          <Text style={styles.title}>أدخل اسمك الكامل</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={firstName}
              placeholder="الاسم الأول"
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={setLastName}
              value={lastName}
              placeholder="اسم العائلة"
            />
          </View>
          {!driverMode && (
            <TouchableOpacity
              onPress={() => {
                setDriverMode(true);
              }}
            >
              <Text style={styles.title}>اضغط هنا للتسجيل الدخول كسائق</Text>
            </TouchableOpacity>
          )}


          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setFullName(firstName + ' ' + lastName)}
          >
            <Text style={styles.buttonText}>تأكيد المستخدم</Text>
          </TouchableOpacity>
        </>
      )}
      {!confirmResult && fullName && (
        <>
          <Text style={styles.title}>أدخل رقم هاتفك المحمول</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="رقم هاتفك"
              maxLength={10}
              keyboardType="numeric" />
          </View>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={signInWithPhoneNumber}
          >
            <Text style={styles.buttonText}>التالي</Text>
          </TouchableOpacity>
        </>
      )}
      {confirmResult && fullName && (
        <>
          <Text style={styles.title}>أدخل رمز SMS الخاص بك</Text>
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
            <Text style={styles.buttonText}>التالي</Text>
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
    position: 'relative',
    top: '10%',
  },
  buttonText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 500
  }

});

export default SignUpMobile;
