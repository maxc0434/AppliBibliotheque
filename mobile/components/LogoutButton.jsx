import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import  { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';


export default function LogoutButton() {

  const { logout } = useAuthStore();
   // Fonction pour afficher une boîte de dialogue de confirmation avant la déconnexion
  const confirmLogout = () => {
    Alert.alert(
      // Titre de la boîte de dialogue
      "Confirmer la deconnexion ",
      // Message affiché à l'utilisateur
      "Etes- vous sûr de vouloir vous déconnecter ?",
      [
        {
          // Bouton pour annuler la déconnexion
          text: "Annuler",
          style: "cancel"
        },
        {
          // Bouton pour confirmer la déconnexion
          text: "Deconnexion",
           // Appelle la fonction logout si l'utilisateur confirme
          onPress: () => logout(), 
          style: "destructive"
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}