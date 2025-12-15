import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';




const Profile = () => {

  const [books, setBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try{
      setIsLoading(true);
      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || 'Erreur lors de la récupération des livres');

      setBooks(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les livres. Veuillez essayer de rafraichir.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader/>
      <LogoutButton/>

      <View style={styles.bookheader}>
        <Text style={styles.bookTitle}> Vos recommandations</Text>
        <Text style={styles.booksCount}>{books.length} Livres </Text>
      </View>
      
      <FlatList
      
      />
    </View>
  )
}

export default Profile

