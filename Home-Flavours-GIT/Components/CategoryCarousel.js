import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemGrid from './ItemGrid';
import DishDataGrid from './DishDataGrid';
import { useNavigation } from '@react-navigation/native';
import DishCategoryCarousel from './DishCategoryCarousel';
import { SearchBar } from 'react-native-elements';
import { db } from '../firebaseConfig';
import { collection, getDocs, query,where, orderBy } from 'firebase/firestore';
import AppBackground from './AppBackground';

export default function CategoryCarousel() {
  const [items, setItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    getCategoriesList();
    getPopularList();
    const interval = setInterval(getPopularList, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPopularList = async () => {
    try {
        const q = query(collection(db, "products"));
        let productQuery = query(q, where('isPopular', '==', true));

        const querySnapshot = await getDocs(productQuery);

        let myPopularList = [];

        querySnapshot.forEach((doc) => {
            
            myPopularList.push({
                id: doc.id, ...doc.data()
            });
        });
        
        setPopularItems(myPopularList);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoriesList = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('categoryId'));

      const querySnapshot = await getDocs(q);

      let myCategoryList = [];

      querySnapshot.forEach((doc) => {
        myCategoryList.push({
          id: doc.id,
          desc: doc.data().desc,
          image: doc.data().image,
          name: doc.data().name,
        });
      });

      setItems(myCategoryList);
    } catch (err) {
      console.log(err);
    }
  };

  const handleItemClick = (item) => {
    navigation.navigate('Category', { categoryId: item.id, categoryName: item.name });
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement your search logic and update items state accordingly
  };
  const handleItemPDPClick = (item) => {
    // Alert.alert('Item Clicked', `You clicked on ${item.title}`);
    navigation.navigate('PDPScreen', { item });
};

  return (
    <AppBackground>
    <View style={styles.container}>
      {/* <SearchBar
        placeholder="Search for categories..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        cancelButtonTitle="Cancel"
        onSubmitEditing={handleSearch}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
      /> */}
      <ItemGrid items={items} onItemClick={handleItemClick} />
      <DishDataGrid data={popularItems} onItemClick={handleItemPDPClick} />
    </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    searchBarContainer: {
      backgroundColor: '#F9F9F9',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      marginBottom: 20,
    },
    searchBarInputContainer: {
      backgroundColor: '#EFEFEF',
    },
    // Add styling for other components as needed
  });
  
