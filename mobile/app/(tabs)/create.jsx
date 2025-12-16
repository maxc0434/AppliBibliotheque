// Ce composant permet de créer une recommandation de livre complète : titre, note étoiles, image de couverture et description.
// L'utilisateur sélectionne une image depuis sa galerie, évalue le livre et publie vers le serveur avec authentification.

import {
  ActivityIndicator, // Indicateur de chargement (spinner)
  Alert, // Boîte de dialogue d'alerte/information
  Image, // Composant pour afficher des images
  KeyboardAvoidingView, // Évite que le clavier cache les champs
  Platform, // Détecte iOS/Android/Web
  ScrollView, // Contenu défilable
  Text, // Texte simple
  TextInput, // Champ de saisie texte
  TouchableOpacity, // Bouton tactile
  View, // Conteneur de mise en page
} from "react-native";

import { useState } from "react"; // Hook pour gérer les états du formulaire
import { useRouter } from "expo-router"; // Hook pour naviguer entre écrans
import COLORS from "../../constants/colors"; // Couleurs prédéfinies
import styles from "../../assets/styles/create.styles"; // Styles spécifiques à ce formulaire
import { Ionicons } from "@expo/vector-icons"; // Icônes pour l'interface
import * as ImagePicker from "expo-image-picker"; // Sélection d'images depuis galerie
import AsyncStorage from "@react-native-async-storage/async-storage"; // Stockage local sécurisé
import { API_URL } from "../../constants/api"; // URL de l'API serveur

// Composant principal de création de recommandation
const Create = () => {
  // États du formulaire (champs utilisateur)
  const [title, setTitle] = useState(""); // Titre du livre
  const [image, setImage] = useState(null); // URI de l'image pour aperçu
  const [imageBase64, setImageBase64] = useState(null); // Image encodée pour l'API
  const [caption, setCaption] = useState(""); // Description/avis
  const [rating, setRating] = useState(0); // Note de 0 à 5 étoiles
  const [loading, setLoading] = useState(false); // État chargement (bouton bloqué)
  const router = useRouter(); // Outil de navigation

  //#region PickImage - SÉLECTION D'IMAGE
  // Ouvre la galerie et traite l'image sélectionnée
  const pickImage = async () => {
    try {
      // Demande permission galerie (seulement mobile, pas web)
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission refusée", "Accès à la galerie nécessaire pour l'image");
          return; // Arrête si refus
        }
      }
      
      // Ouvre galerie avec options optimisées
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // Images seulement (pas vidéo)
        allowsEditing: true, // Permet recadrage
        aspect: [4, 3], // Format 4:3 (couverture livre)
        quality: 0.5, // Compression 50% (réduit taille)
        base64: true, // Récupère image en base64 pour API
      });
      
      // Vérifie si sélection valide
      if (!result.canceled) {
        console.log("Résultat ImagePicker:", result);
        const asset = result.assets[0]; // Première image sélectionnée
        setImage(asset.uri); // Affiche aperçu

        if (asset.base64) {
          // Vérifie taille (base64 ≈ 33% plus gros que binaire)
          const base64Size = asset.base64.length * 0.75;
          if (base64Size > 10000 * 1024) { // > 10MB → refus
            Alert.alert("Image trop lourde", "Choisissez une image plus petite (< 10MB)");
            return;
          }
          setImageBase64(asset.base64); // Stocke pour envoi API
          console.log("✅ Image OK:", Math.round(base64Size / 1024), "KB");
        }
      }
    } catch (error) {
      console.error("❌ Erreur sélection image:", error);
      Alert.alert("Erreur", "Problème lors de la sélection de l'image");
    }
  };
  //#endregion

  //#region HandleSubmit - ENVOI FORMULAIRE
  // Valide et envoie les données vers l'API
  const handleSubmit = async () => {
    // Vérifie tous les champs remplis
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true); // Montre spinner, bloque bouton

      // Détermine type MIME depuis extension fichier
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      // Crée URL data complète (format standard API)
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      // Récupère token utilisateur depuis stockage local
      const token = await AsyncStorage.getItem("token");

      // Envoi POST vers API livres
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Authentification token
          "Content-Type": "application/json", // Format JSON
        },
        body: JSON.stringify({
          title: title.toString(), // Force texte
          caption: caption.toString(),
          rating: rating.toString(),
          image: imageDataUrl, // Image complète
        }),
      });

      console.log("📊 Status:", response.status);

      // Succès (200-299)
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Création réussie:", data);
        Alert.alert("Succès", "Votre recommandation a été postée !");
        
        // Reset formulaire
        setTitle(""); setCaption(""); setRating(0);
        setImage(null); setImageBase64(null);
        router.push("/"); // Retour accueil
        return;
      }

      // Erreur serveur
      const errorText = await response.text();
      console.error("❌ Erreur API:", errorText);
      throw new Error(errorText || "Erreur serveur");

    } catch (error) {
      console.error("💥 Erreur création:", error);
      Alert.alert("Erreur", error.message || "Quelque chose s'est mal passé");
    } finally {
      setLoading(false); // Toujours arrêter le chargement
    }
  };
  //#endregion

  //#region RatingPicker - SYSTÈME ÉTOILES
  // Affiche 5 étoiles cliquables (1-5)
  const renderRatingPicker = () => {
    const stars = [];
    // Crée 5 boutons étoiles
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i} // ID unique React
          onPress={() => setRating(i)} // Définit note cliquée
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"} // Pleine/vide
            size={32}
            color={i <= rating ? "#fab400" : COLORS.textSecondary} // Jaune/gris
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };
  //#endregion 

  // INTERFACE UTILISATEUR
  return (
    <KeyboardAvoidingView
      style={{ flex:1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>

        <View style={styles.card}>
          {/*HEADER */}
          <View>
            <Text style={styles.title}>Ajouter une recommandation</Text>
            <Text style={styles.subtitle}>Partager vos favoris avec la communauté</Text>
          </View>
         
          <View style={styles.form}>
             {/*Titre du livre*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Titre du livre</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Entrer le titre du livre'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />

              </View>
            </View>
            {/*Notation*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Votre note</Text>
              {renderRatingPicker()}
            </View>
            {/*Image*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image du livre </Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                   <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons 
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary} 
                    />
                    <Text style={styles.placeholderText}>Toucher pour selectionner une image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/*Description*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder='Ecrivez votre avis sur ce livre...'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>
            {/*Submit*/}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name='cloud-upload-outline'
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Partager</Text>
                  </>
                )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
export default Create; // Export pour utilisation dans les onglets
