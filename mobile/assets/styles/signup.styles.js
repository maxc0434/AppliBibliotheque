//#region Signup Style
// styles/signup.styles.js - Styles pour l'écran d'inscription utilisateur
import { StyleSheet } from "react-native"; // Créateur de styles optimisés React Native
import COLORS from "../../constants/colors"; // Palette de couleurs centralisée


const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // S'étend verticalement, ne remplit pas forcément toute la largeur
    backgroundColor: COLORS.background, // Fond général de l'écran
    padding: 20, // Marges internes généreuses
    justifyContent: "center", // Centre le contenu verticalement
  },
  
  card: {
    backgroundColor: COLORS.cardBackground, // Fond de la carte formulaire
    borderRadius: 16, // Coins arrondis modernes
    padding: 24, // Espacement interne généreux
    shadowColor: COLORS.black, // Ombre iOS noire
    shadowOffset: { width: 0, height: 2 }, // Décalage ombre verticale
    shadowOpacity: 0.1, // Transparence légère
    shadowRadius: 8, // Flou important pour douceur
    elevation: 4, // Ombre Android prononcée
    borderWidth: 2, // Bordure plus épaisse
    borderColor: COLORS.border, // Couleur bordure subtile
  },
  
  header: {
    alignItems: "center", // Centrage horizontal du titre/sous-titre
    marginBottom: 32, // Grand espace avant formulaire
  },
  
  title: {
    fontSize: 32, // Titre très grand et impactant
    fontWeight: "700", // Gras épais
    fontFamily: "JetBrainsMono-Medium", // Police monospace moderne
    color: COLORS.primary, // Couleur principale (bleu/vert)
    marginBottom: 8, // Petit espace sous titre
  },
  
  subtitle: {
    fontSize: 16, // Taille normale
    color: COLORS.textSecondary, // Gris secondaire
    textAlign: "center", // Centré pour lisibilité
  },
  
  formContainer: { 
    marginBottom: 16, // Espace sous conteneur formulaire
  },
  
  inputGroup: { 
    marginBottom: 20, // Espacement généreux entre champs
  },
  
  label: {
    fontSize: 14, // Taille petite pour libellés
    marginBottom: 8, // Espace avant champ
    color: COLORS.textPrimary, // Texte principal
    fontWeight: "500", // Demi-gras
  },
  
  inputContainer: {
    flexDirection: "row", // Icône + champ en ligne
    alignItems: "center", // Alignement vertical centré
    backgroundColor: COLORS.inputBackground, // Fond champ clair
    borderRadius: 12, // Coins arrondis
    borderWidth: 1, // Bordure fine
    borderColor: COLORS.border, // Bordure subtile
    paddingHorizontal: 12, // Espacement latéral
  },
  
  inputIcon: { 
    marginRight: 10, // Espace entre icône et texte
  },
  
  input: {
    flex: 1, // Prend tout l'espace restant
    height: 48, // Hauteur standard champ (touch-friendly)
    color: COLORS.textDark, // Texte sombre
  },
  
  eyeIcon: { 
    padding: 8, // Zone tactile pour icône œil (mot de passe)
  },
  
  button: {
    backgroundColor: COLORS.primary, // Couleur principale bouton
    borderRadius: 12, // Coins arrondis
    height: 50, // Hauteur tactile standard
    justifyContent: "center", // Contenu centré verticalement
    alignItems: "center", // Contenu centré horizontalement
    marginTop: 16, // Espace au-dessus
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Ombre légère bouton
  },
  
  buttonText: {
    color: COLORS.white, // Texte blanc sur fond coloré
    fontSize: 16, // Taille confortable
    fontWeight: "600", // Semi-gras
  },
  
  footer: {
    flexDirection: "row", // Texte + lien en ligne
    justifyContent: "center", // Centré
    marginTop: 24, // Espace après bouton
  },
  
  footerText: {
    color: COLORS.textSecondary, // Texte gris
    marginRight: 5, // Espace avant lien
  },
  
  link: {
    color: COLORS.primary, // Couleur cliquable
    fontWeight: "600", // Mis en évidence
  },
});


export default styles;
// Export des styles pour le composant Signup
//#endregion
