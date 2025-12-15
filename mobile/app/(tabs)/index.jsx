import { 
  FlatList, Text, 
  TouchableOpacity, View 
} from "react-native";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";


export default function Home() {
  const { logout, user, token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isAuthenticated = !!user && !!token;

  // Fonction asynchrone pour récupérer les livres depusi l'API
  // pageNum: numéro de la page a charger (=> pagination)
  // refresh: indique si c'est une rafraichissement (RAZ de la liste)
  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      // si c'est un rafraichissement on active l'indicateur de rafraichissement
      if (refresh) setRefreshing(true);
      // sinon, si c'est la premiere page, on active l'indicateur de chargement
      else if (pageNum === 1) setLoading(true);

      console.log('TOKEN FRONT:', token);
      console.log('URL:', `${API_URL}/books?page=${pageNum}&limit=5`);

      //Appel à l'API pour récupérer les livres avec pagination (5 livres par page)
      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // on récupère les données de la réponse 
      const data = await response.json();
      // Si la réponse n'est pas OK, on relève une erreur
      if (!response.ok) throw new Error(data.message || 'Echec du fetch des livres');

       // On crée une liste de livres sans doublons
      // Si c'est un rafraîchissement ou la première page, on remplace simplement la liste par les nouveaux livres
      const uniqueBooks = 
        refresh || pageNum === 1
          ? data.books // Si c'est un rafraîchissement ou la première page, on remplace la liste
          // Sinon, on fusionne l'ancienne liste et la nouvelle, puis on retire les doublons grâce à l'_id
          : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) => 
            [...books, ...data.books].find((book) => book._id === id)
          );

      // On met à jour la liste des livres avec la liste sans doublons
      setBooks(uniqueBooks);
      // on met à jour l'état pour savoir s'il reste des pages à charger
      setHasMore(pageNum < data.totalPages);
      // On met à jour le numéro de la page courante
      setPage(pageNum);

    } catch (error) {
      console.log('Erreur dans le fetch des livres', error);
    } finally {
      // On désactive les indicateurs de chargement et de rafraichissement
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };


  // useEffect: effet qui sera executé au montage du composant:
  // ici il permet de charger les livres dès l'affichage de la page
  useEffect(() => {
    fetchBooks();
  }, []);

  //fonction pour charger plus de livres (pagination)
  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1)
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{uri: item.user.profilImage}}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}> Partagé le {formatPublishDate(item.createdAt)} </Text>
      </View>
    </View>
  );

  // Fonction pour afficher les étoiles de notation
  const renderRatingStars = (rating) => {
    const stars = [];
    //Boucle pour générer 4 étoiles
    for (let i = 1; i < 5 ; i++) {
      stars.push(
        // Affiche une étoile pleine si i <= rating, sinon une étoile vide
        <Ionicons
          key={i} // Clé unique pour chaque etoile
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#f4b400' : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  }

  console.log('BOOKS STATE:', books);

  return (
    <View style={styles.container}>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={
            <View style={styles.header}>
            <Text style={styles.headerTitle}> Bienvenue sur BookShare</Text>
            <Text style={styles.headerSubtitle}>Découvrez les derniers livres partagés par la commu</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Aucun livre trouvé</Text>
              <Text style={styles.emptySubtext}>Partagez votre premier livre!</Text>
            </View>
          }
        />

      {isAuthenticated && (
        <TouchableOpacity onPress={logout}>
          <Text>Déconnexion</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};