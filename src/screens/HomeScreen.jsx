import React from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';

const fakePosts = [
  { id: '1', title: 'اهلا وسهلا في تطبيق easy-traveling', content: 'اهلا وسهلا في تطبيق easy-traveling', image: require('../img/taxi.png') },
  { id: '2', title: 'Post 2', content: 'Nulla euismod dui nec consectetur tristique.', image: require('../img/taxi.png') },
  { id: '3', title: 'Post 3', content: 'Aenean at odio luctus, semper tortor eu, posuere lacus.', image: require('../img/taxi.png') },
  // Add more fake posts as needed
];

function HomeScreen() {
  const renderPostCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

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
});

export default HomeScreen;
