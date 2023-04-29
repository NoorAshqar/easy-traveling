import React from 'react';
import { View, Text } from 'react-native';

function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={{
            width: '100%',
            height: 450,
          }}
          source={require("../img/taxi.png")}
        />
        <View style={styles.header}>
          <Text style={styles.name}>Noor Ashqar</Text>
          <Text style={styles.phoneNumber}>0598489898</Text>
        </View>
      </View>
    </View>
  );
}

export default Settings;