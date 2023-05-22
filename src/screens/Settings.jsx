import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function Settings({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        const uid = currentUser.uid;
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUser(userData);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log('Error', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    navigation.navigate('UserEditScreen',{user: user});
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>User Information:</Text>
          <Text style={styles.userInfoText}>Name: {user.fullName}</Text>
          <Text style={styles.userInfoText}>PhoneNumber: {user.PhoneNumber}</Text>
          {user.Role === "Admin" && (
            <Text style={styles.userInfoText}>you are an admin</Text>
          )}
          <Button title="Edit" onPress={handleEdit} />
        </View>
      )}
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
});

export default Settings;
