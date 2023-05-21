import React from 'react';
import { Button, View } from 'react-native';
import auth from '@react-native-firebase/auth';

function HomeScreen() {
  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

export default HomeScreen;