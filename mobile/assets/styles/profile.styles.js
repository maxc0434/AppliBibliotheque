//#region Profile Style
// styles/profile.styles.js - Styles pour l'écran de profil utilisateur
import { StyleSheet } from "react-native"; // Créateur de styles optimisés React Native
import COLORS from "../../constants/colors"; // Palette de couleurs centralisée


const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupe tout l'espace disponible
    backgroundColor: COLORS.background, // Fond de l'écran
    padding: 16, // Marges internes
    paddingBottom: 0, // Pas de marge en bas (pour onglets)
  },
  
  loadingContainer: {
    flex: 1, // Centrage complet
    justifyContent: "center", // Vertical
    alignItems: "center", // Horizontal
    backgroundColor: COLORS.background,
  },
  
  profileHeader: {
    flexDirection: "row", // Ligne horizontale
    alignItems: "center", // Alignement vertical centré
    backgroundColor: COLORS.cardBackground, // Fond carte
    borderRadius: 16, // Coins arrondis
    padding: 16, // Espacement interne
    marginBottom: 16, // Espace sous la carte
    shadowColor: COLORS.black, // Ombre noire
    shadowOffset: { width: 0, height: 2 }, // Décalage ombre
    shadowOpacity: 0.1, // Transparence ombre
    shadowRadius: 8, // Flou ombre
    elevation: 3, // Ombre Android
    borderWidth: 1, // Bordure fine
    borderColor: COLORS.border, // Couleur bordure
  },
  
  profileImage: {
    width: 80, // Largeur avatar
    height: 80, // Hauteur avatar
    borderRadius: 40, // Cercle parfait
    marginRight: 16, // Espace à droite
  },
  
  profileInfo: {
    flex: 1, // Prend l'espace restant
  },
  
  username: {
    fontSize: 20, // Taille pseudo
    fontWeight: "700", // Gras épais
    color: COLORS.textPrimary, // Couleur texte principal
    marginBottom: 4, // Espace sous pseudo
  },
  
  email: {
    fontSize: 14, // Taille email
    color: COLORS.textSecondary, // Gris secondaire
    marginBottom: 4,
  },
  
  memberSince: {
    fontSize: 12, // Taille petite
    color: COLORS.textSecondary,
  },
  
  logoutButton: {
    backgroundColor: COLORS.primary, // Couleur principale
    borderRadius: 12, // Coins arrondis
    padding: 12, // Espacement interne
    flexDirection: "row", // Icône + texte
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24, // Espace sous bouton
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  logoutText: {
    color: COLORS.white, // Texte blanc
    fontWeight: "600", // Semi-gras
    marginLeft: 8, // Espace après icône
  },
  
  booksHeader: {
    flexDirection: "row", // Titre + compteur
    justifyContent: "space-between", // Écartés aux bords
    alignItems: "center",
    marginBottom: 16,
  },
  
  booksTitle: {
    fontSize: 18,
    fontWeight: "700", // Gras
    color: COLORS.textPrimary,
  },
  
  booksCount: {
    fontSize: 14,
    color: COLORS.textSecondary, // Compteur gris
  },
  
  booksList: {
    paddingBottom: 20, // Espace en bas liste
  },
  
  bookItem: {
    flexDirection: "row", // Image + infos + bouton
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12, // Espacement entre cartes
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  bookImage: {
    width: 70, // Vignette couverture
    height: 100, // Format livre
    borderRadius: 8,
    marginRight: 12,
  },
  
  bookInfo: {
    flex: 1, // Prend espace restant
    justifyContent: "space-between", // Répartition verticale
  },
  
  bookTitle: {
    fontSize: 16,
    fontWeight: "600", // Semi-gras
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  
  ratingContainer: {
    flexDirection: "row", // Étoiles en ligne
    marginBottom: 4,
  },
  
  bookCaption: {
    fontSize: 14,
    color: COLORS.textDark, // Texte sombre
    marginBottom: 4,
    flex: 1, // S'adapte à l'espace
  },
  
  bookDate: {
    fontSize: 12, // Petite date
    color: COLORS.textSecondary,
  },
  
  deleteButton: {
    padding: 8, // Zone tactile bouton poubelle
    justifyContent: "center",
  },
  
  emptyContainer: {
    alignItems: "center", // Centrage icône/texte
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 20,
    textAlign: "center", // Centré
  },
  
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12, // Hauteur bouton
    paddingHorizontal: 20, // Largeur bouton
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  addButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});


export default styles;
// Export des styles pour utilisation dans Profile.js
//#endregion
