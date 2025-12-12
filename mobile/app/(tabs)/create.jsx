import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";

const Create = () => {
  // États du formulaire : titre, image, base64 de l'image, description, note et état de chargement
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook pour la navigation


  //#region PickImage
  // Fonction pour sélectionner et traiter l'image depuis la galerie
  const pickImage = async () => {
    try {
      // Demande de permission galerie UNIQUEMENT sur mobile (pas web)
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission refusée", "Accès à la galerie nécessaire pour l'image");
          return;
        }
      }
      
      // Ouvre la galerie avec options optimisées pour éviter les images trop lourdes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // Limite aux images uniquement
        allowsEditing: true, // Permet recadrage simple
        aspect: [4, 3], // Ratio 4:3 pour les couvertures de livres
        quality: 0.5, // Qualité 50% pour réduire la taille
        base64: true, // Récupère l'image en base64 pour l'envoi API
        maxFileSize: 1 * 1024 * 1024, // Limite à 1MB brut
      });
      
      // Vérifie si l'utilisateur a annulé OU si pas d'assets
      if (!result.canceled) {
        console.log("Résultat ImagePicker:", result);
        const asset = result.assets[0]; // Premier (et seul) asset sélectionné
        setImage(asset.uri); // URI pour l'affichage preview

        if (asset.base64) {
          // Calcule taille réelle base64 (base64 = ~33% plus gros que binaire)
          const base64Size = asset.base64.length * 0.75;
          if (base64Size > 800 * 1024) { // Refus si > 800KB (limite serveur)
            Alert.alert("Image trop lourde", "Choisissez une image plus petite (< 800KB)");
            return;
          }
          setImageBase64(asset.base64); // Stocke base64 valide
          console.log("✅ Image OK:", Math.round(base64Size / 1024), "KB");
        }
      }
    } catch (error) {
      console.error("❌ Erreur sélection image:", error);
      Alert.alert("Erreur", "Problème lors de la sélection de l'image");
    }
  };

  //#endregion








  //#region HandleSubmit
  // Fonction principale d'envoi du formulaire vers l'API
  const handlesubmit = async () => {
    // Validation : tous les champs obligatoires remplis
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true); // Active l'indicateur de chargement

      // Extrait extension depuis URI pour déterminer type MIME
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      // Crée URL data complète pour l'image (format standard)
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      // Récupère token d'authentification depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Logs de debug (à supprimer en prod)
      console.log("🔑 Token:", token ? "OK" : "NULL");
      console.log("📤 Données envoyées:", {
        title,
        caption,
        rating,
        image: imageDataUrl.substring(0, 50) + "...",
      });

      // Requête POST vers l'API création livre
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Auth Bearer token
          "Content-Type": "application/json", // JSON payload
        },
        body: JSON.stringify({
          title: title.toString(), // Force string (évite [object Object])
          caption: caption.toString(), // Force string (évite [object Object])
          rating: rating.toString(), // Force string pour cohérence API
          image: imageDataUrl, // Image complète en data URL
        }),
      });

      // Logs réponse serveur
      console.log("📊 Status:", response.status);
      console.log("📋 Headers:", response.headers.get("content-type"));

      // Succès : status 200-299
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Réponse succès:", data);
        Alert.alert("Succès", "Votre recommandation a été postée !");
        
        // Reset formulaire complet
        setTitle("");
        setCaption("");
        setRating(0);
        setImage(null);
        setImageBase64(null);
        router.push("/"); // Redirection accueil
        return;
      }

      // Erreur serveur : lit le message d'erreur
      const errorText = await response.text();
      console.error("❌ Erreur API:", errorText);
      throw new Error(errorText || "Erreur serveur");

    } catch (error) {
      console.error("💥 Erreur création post:", error);
      Alert.alert("Erreur", error.message || "Quelque chose s'est mal passé");
    } finally {
      setLoading(false); // Toujours désactiver loading
    }
  };
//#endregion









//#region RatingPicker
  // Composant étoiles de notation (1 à 5)
  const renderRatingPicker = () => {
    const stars = [];
    // Boucle pour créer 5 étoiles cliquables
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i} // Clé unique React
          onPress={() => setRating(i)} // Met la note à l'étoile cliquée
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"} // Pleine/vide selon note
            size={32}
            color={i <= rating ? "#fab400" : COLORS.textSecondary} // Jaune/gris
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>; // Container horizontal
  };
  //#endregion 


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        styles={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* HEADER */}
          <View>
            <Text style={styles.title}>Ajouter une recommandation</Text>
            <Text style={styles.subtitle}>
              Partager vos favoris avec la commu{" "}
            </Text>
          </View>

          <View style={styles.form}>
            {/* TITRE DU LIVRE */}
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
                  placeholder="Entrer le titre du livre"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* NOTATION */}
            <View style={styles.formGroup}>
              <Text style={styles.label}> Notation </Text>
              {renderRatingPicker()}
            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image de couverture</Text>
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
                    <Text style={styles.placeholderText}>
                      {" "}
                      Toucher pour séléctionner une image{" "}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.formGroup}>
              <Text style={styles.label}> Description </Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tapez votre avis"
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* BOUTON SUBMIT */}
            <TouchableOpacity
              style={styles.button}
              onPress={handlesubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Valider mon Avis</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
