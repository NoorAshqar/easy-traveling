import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
const Landing = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerHead}>
        <Image
          style={{
            width: '100%',
            height: 450,
          }}
          source={require("../img/taxi.png")}
        />
        <Text style={styles.title}>welcome to <Text style={{ fontWeight: "bold" }}>easy traveling</Text>...your app for easy traveling</Text>
      </View>
      <View style={styles.containerBody}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={()=>{navigation.navigate('SignUpM')}}
        >
          <Text style={styles.buttonText}>Lets Get Started</Text>
        </TouchableOpacity>
      </View>
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

export default Landing;
