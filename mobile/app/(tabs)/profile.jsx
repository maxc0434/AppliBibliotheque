import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
// Import des composants React Native : indicateur de chargement, alertes, liste, texte, boutons et vues

import { useEffect, useState } from 'react'
// Import des hooks React pour gérer l’état et les effets (cycle de vie)

import { useRouter } from 'expo-router';
// Import du hook de navigation pour changer d’écran

import { API_URL } from "../../constants/api";
// Import de l’URL de base de l’API

import { useAuthStore } from "../../store/authStore";
// Import du store d’authentification pour récupérer le token de l’utilisateur

import styles from "../../assets/styles/profile.styles";
// Import des styles spécifiques à l’écran de profil

import ProfileHeader from '../../components/ProfileHeader';
// Import du composant d’en-tête du profil (infos utilisateur, etc.)

import LogoutButton from '../../components/LogoutButton';
// Import du bouton de déconnexion

import { Ionicons } from '@expo/vector-icons';
// Import des icônes Ionicons

import COLORS from '../../constants/colors';
// Import de la palette de couleurs

import { Image } from 'expo-image';
import { sleep } from '.';
import Loader from '../../components/Loader';
// Import du composant Image optimisé d’Expo





const Profile = () => {
// Déclaration du composant fonctionnel Profile


  const [books, setBooks] = useState([]);
  // État qui contient la liste des livres de l’utilisateur

  const [isLoading, setIsLoading] = useState(true);
  // État qui indique si les données sont en cours de chargement

  const [refreshing, setRefreshing] = useState(false);
  // État qui pourrait servir pour un rafraîchissement (pull-to-refresh)

  const [deleteBookId, setDeleteBookId] = useState(null);
  // État qui contient l’ID du livre en cours de suppression (pour afficher un loader ciblé)

  const { token } = useAuthStore();
  // Récupération du token d’authentification depuis le store

  const router = useRouter();
  // Initialisation du hook de navigation


    useEffect(() => {
  // Effet qui se lance au montage du composant
    fetchData();
    // Charge les livres de l’utilisateur dès l’arrivée sur la page
  }, []);


  const fetchData = async () => {
  // Fonction asynchrone pour récupérer les livres de l’utilisateur
    try{
      setIsLoading(true);
      // Active le chargement global

      const response = await fetch(`${API_URL}/books/user`, {
      // Appel à l’API pour récupérer les livres de l’utilisateur
        headers: { Authorization: `Bearer ${token}`},
        // Ajout du token dans le header pour l’authentification
      });

      const data = await response.json();
      // Conversion de la réponse en JSON

      if(!response.ok) throw new Error(data.message || 'Erreur lors de la récupération des livres');
      // Si la réponse n’est pas OK, on lève une erreur avec un message

      setBooks(data);
      // Mise à jour de l’état avec la liste des livres récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      // Affiche l’erreur dans la console pour le debug

      Alert.alert('Erreur', 'Impossible de récupérer les livres. Veuillez essayer de rafraichir.');
      // Affiche une alerte à l’utilisateur en cas d’échec
    } finally {
      setIsLoading(false);
      // Désactive l’indicateur de chargement
    }
  }


  const renderBookItem = ({item}) => (
  // Fonction de rendu pour chaque livre dans la FlatList
    <View style={styles.bookItem}>
    {/* Conteneur de la carte du livre */}
      <Image source={item.image} style={styles.bookImage} />
      {/* Affichage de l’image de couverture du livre */}

      <View style={styles.bookInfo} >
      {/* Conteneur des informations textuelles du livre */}
        <Text style={styles.bookTitle} > {item.title} </Text>
        {/* Titre du livre */}

        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        {/* Affichage des étoiles de notation via la fonction renderRatingStars */}

        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        {/* Description de la recommandation, limitée à 2 lignes */}

        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        {/* Date de création de la recommandation, formatée selon la locale */}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
      {/* Bouton pour supprimer le livre, ouvre une confirmation */}
        {deleteBookId === item._id ? (
        // Si ce livre est en cours de suppression, affiche un loader à la place de l’icône
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : ( 
        // Sinon, affiche l’icône de poubelle
        <Ionicons name="trash-outline" size={20} color={COLORS.primary}/>
        )}
      </TouchableOpacity>
    </View>
  )


  const confirmDelete = (bookId) => {
  // Fonction qui affiche une boîte de dialogue de confirmation avant suppression
    Alert.alert(
      'Supprimer le livre',
      'Etes vous sur de vouloir supprimer ce livre?',
      [ 
        {text: 'Annuler', style: 'cancel'},
        // Bouton pour annuler la suppression

        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleDeleteBook(bookId)
          // Si confirmé, appelle la fonction de suppression réelle
        },
      ]
    );
  };


  const handleDeleteBook = async (bookId) => {
  // Fonction asynchrone qui supprime un livre via l’API
    try {
      setDeleteBookId(bookId);
      // Indique quel livre est en cours de suppression (pour afficher le loader)

      const response = await fetch(`${API_URL}/books/${bookId}`, {
      // Appel à l’API pour supprimer le livre ciblé
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        // Ajout du token pour authentifier la requête
      });

      const data = await response.json();
      // Conversion de la réponse en JSON

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la suppression de la recommandation');
      // Si la suppression échoue, lève une erreur avec message

      setBooks(books.filter((book) => book._id !== bookId));
      // Met à jour la liste locale en retirant le livre supprimé

      Alert.alert('Succès', 'Le livre a été supprimé avec succès')
      // Affiche un message de succès à l’utilisateur
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de supprimer la recommandation')
      // Affiche une alerte d’erreur en cas de problème
    } finally {
      setDeleteBookId(null);
      // Réinitialise l’ID du livre en suppression (désactive le loader ciblé)
    }
  };


    const renderRatingStars = (rating) => {
    // Fonction qui génère les icônes d’étoiles pour la notation
    const stars = [];
    for (let i = 1; i < 5 ; i++) {
    // Boucle pour créer 4 étoiles (de 1 à 4)
      stars.push(
        // Affiche une étoile pleine si i <= rating, sinon une étoile vide
        <Ionicons
          key={i} // Clé unique pour chaque etoile
          name={i < rating ? 'star' : 'star-outline'}
          // Choix de l’icône pleine ou contour selon la note

          size={14}
          // Taille de l’icône

          color={i <= rating ? '#f4b400' : COLORS.textSecondary}
          // Couleur jaune si étoile active, gris sinon

          style={{ marginRight: 2 }}
          // Ajoute un petit espace entre les étoiles
        />
      );
    }
    return stars;
    // Retourne le tableau d’icônes pour affichage
  }


  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500); // simule un délai pour l'effet de rafraichissement
    await fetchData();
    setRefreshing(false);
  };

  if(isLoading && !refreshing) return <Loader/>;

  return (
  // Rendu JSX principal du composant
    <View style={styles.container}>
    {/* Conteneur global de la page profil */}
      <ProfileHeader/>
      {/* En-tête du profil (avatar, infos, etc.) */}

      <LogoutButton/>
      {/* Bouton pour se déconnecter */}

      <View style={styles.bookheader}>
      {/* En-tête de la section des recommandations */}
        <Text style={styles.bookTitle}> Vos recommandations</Text>
        {/* Titre de la section */}

        <Text style={styles.booksCount}>{books.length} Livres </Text>
        {/* Affiche le nombre total de livres de l’utilisateur */}
      </View>
      
      <FlatList
      // Liste performante pour afficher toutes les recommandations
        data={books}
        // Données de la liste (tableau de livres)

        renderItem={renderBookItem}
        // Fonction qui définit comment rendre chaque élément

        keyExtractor={(item) => item._id}
        // Utilise l’ID du livre comme clé unique

        showsVerticalScrollIndicator={false}
        // Cache la barre de défilement verticale

        contentContainerStyle={styles.booksList}
        // Styles appliqués au contenu de la liste

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

        ListEmptyComponent={
        // Composant affiché si la liste de livres est vide
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
              {/* Icône de livre pour illustrer l’état vide */}

              <Text style={styles.emptyText}>Aucune recommandation trouvée</Text>
              {/* Message informant qu’il n’y a pas encore de recommandation */}

              <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')} >
              {/* Bouton pour rediriger vers l’écran de création de livre */}
                <Text style={styles.addButtonText}>Ajouter un livre</Text>
                {/* Texte du bouton d’ajout */}
              </TouchableOpacity>
            </View>
        }
      />
    </View>
  )
}

export default Profile
// Export du composant Profile pour pouvoir l’utiliser dans l’application
