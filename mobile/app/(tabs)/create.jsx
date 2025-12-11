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
import {API_URL} from "../../constants/api"


const Create = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        // Vérifie qu'on est sur mobile et pas sur web pour pouvoir ouvrir la galerie
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync(); // Requete pour ouvrir la galerie d'image
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Nous avons besoin d'acceder à votre galerie pour charger une image"
          );
          return;
        }
      }
      //lancer la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", //Spécifie le type de média à sélectionner
        allowsEditing: true, // Autorise l'édition de l'image sélectionnée
        aspect: [4, 3], //Définit le rapport d'aspect de l'image (4:3)
        quality: 0.5, // Définit la qualité de l'image (entre 0 et 1)
        base64: true, // Renvoie l'image sous forme de chaîne de caractères en base64
      });
      if (!result.canceled) {
        //si l'user n'a pas annulé la selection d'image
        console.log("Résultat ici: ", result);
        const asset = result.assets[0];
        setImage(asset.uri);

        if (asset.base64) {
          setImageBase64(asset.base64);
        } else {
          Alert.alert("Erreur", "Impossible de récupérer l'image en base64");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Erreur", "Probleme avec la sélection de l'image");
    }
  };

  const handlesubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
        Alert.alert("Error", "Veuillez remplir tout les champs");
        return;
    }
    try {
        // Définir l'état de chargement sur true pour indiquer que l'application est en train de charger
        setLoading(true);
        // Découpe l'URL de l'image en un tableau de parties en utilisant le point comme séparateur
        const uriParts = image.split(".");
        // Extrait l'extension de fichier à partir de la dernière partie de l'URL
        const fileType = uriParts[uriParts.length - 1];
        // Determine le type MIME de l'image en fonction de l'extension de fichier
        // Si l'extension de fichier n'est pas vide, utilise-la pour construire le type MIME
        // Sinon, utilise la valeur par défault "image/jpeg"
        const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
        //Construit une URL de données pour l'image en utilisant le type MIME determiné et les données d'image encodées en base64
        const imageDataUrl = `data:${imageType};base64,${imageBase64}`;
        
        const token = await AsyncStorage.getItem("token");
        // Envoie une requête HTTP POST à l'API pour créer un nouveau livre
        const response = await  fetch(`${API_URL}/books`, {
            //Spécifie la méthode HTTP à utiliser (dans ce cas, POST)
            
            method: "POST",
            
            // Définit les en-têtes de la requête
            headers: {
                //Inclut le token
                Authorization: `Bearer ${token}`,
                // Spécifie le type de contenu de la requete
                "Content-Type": "application/json",
            },
            // Convertit les données à envoyer en JSON et les inclus dans la requete
            body: JSON.stringify({
                //Titre du livre, description, note et url de l'image
                title,
                caption,
                rating: rating.toString(),
                image: imageDataUrl,
            }),
        });

        //Attend la reponse de l'API et la converti en JSON
        const data = await response.json();

        // Vérifie si la réponse de l'API est réussi, sinon lance une erreur
        if(!response.ok) throw new Error(data.message ||"Quelque chose s'est mal passé");

        //Affiche une alerte de succès pour informer l'utilisateur que la recommandation a été postée
        Alert.alert("Success", "Votre recommandation de livre a été posté");
        //Réinitialise les champs du formulaire pour une nouvelle saisie
        setTitle("");
        setCaption("");
        setRating(0);
        setImage(null);
        setImageBase64(null);
        //Redirige l'utilisateur vers la page d'accueil
        router.push("/");

    } catch (error) {
        console.error("Erreur dans la création du post", error);
        Alert.alert("Error", error.message || "Quelque chose s'est mal passé");        
    } finally {
        //Reinitialise l'état du chargement pour permettre de nouvelles actions
        setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#fab400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

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
                  onChange={setTitle}
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
                onChange={setCaption}
                multiline
              />
            </View>

            {/* BOUTON SUBMIT */}
            <TouchableOpacity style={styles.button} onPress={handlesubmit} disabled={loading}>
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
