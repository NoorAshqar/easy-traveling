import React from 'react';
import { View, FlatList, StyleSheet, Text, Image,TouchableOpacity,Linking } from 'react-native';

const fakePosts = [
  { id: '1', title: 'اهلا وسهلا في تطبيق easy-traveling', content: 'تطبيقك لتسهيل سفرك في مدينتك', image: require('../img/post1.jpg') },
  { id: '2', title: 'اعثر على سيارة الاجرة المناسبة لك', content: 'من خلال الخريطة المتوفرة لك في التطبيق مع الشارع المناسب لك', image: require('../img/post2.jpg') },
  { id: '3', title: 'تواصل معنا على الواتس اب ', content: 'Aenean at odio luctus, semper tortor eu, posuere lacus.', image: require('../img/post3.jpg') },
  // Add more fake posts as needed
];

function HomeScreen() {
  const renderPostCard = ({ item }) => {
    if (item.id === '3') {
      return (
        <View style={styles.card}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              Linking.openURL('whatsapp://send?phone=+972569317219');
            }}>
            <Text style={styles.buttonText}>اضغط هنا للتواصل معنا</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={fakePosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black', // Set text color to black
  },
  content: {
    fontSize: 16,
    color: 'black', // Set text color to black
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: "center",
    padding: 20,
  },
  mainButton: {
    backgroundColor: 'black',
    textAlign: "center"
  }
});

export default HomeScreen;
