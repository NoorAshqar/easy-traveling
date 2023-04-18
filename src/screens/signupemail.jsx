import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SignUpEmail = () => {
  return (
    <View style={styles.container}>
      <Text>asd</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  {
    height: '100%',
    backgroundColor: 'black',
    fontFamily: 'Roboto',
  },
  title: {
    margin: 'auto',
    fontSize: 38,
    textAlign: 'left',
    display:'flex',
    alignSelf: 'center',
    marginBottom: 40,
  },
  mainButton: {
    paddingRight:50,
    paddingLeft:50,
    paddingTop:15,
    paddingBottom:15,
    borderWidth: 4,
    borderRadius:10,
    borderColor: "#20232a",
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 500
  }

});

export default SignUpEmail;
