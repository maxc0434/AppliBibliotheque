import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router';
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

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
            
            if (Platform.OS !== "web") { // Vérifie qu'on est sur mobile et pas sur web pour pouvoir ouvrir la galerie
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Requete pour ouvrir la galerie d'image
                if (status !== "granted"){
                    Alert.alert("Permission Denied", "Nous avons besoin d'acceder à votre galerie pour charger une image");
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
            if (!result.canceled) { //si l'user n'a pas annulé la selection d'image
                console.log("Résultat ici: ", result);
                const asset = result.assets[0];
                setImage(asset.uri);

                if(asset.base64) {
                    setImageBase64(asset.base64);

                } else {
                    Alert.alert("Erreur", "Impossible de récupérer l'image en base64");
                }
            }
            
        } catch (error){
            console.error("Error picking image:", error);
            Alert.alert("Erreur", "Probleme avec la sélection de l'image");
        }
    };

    const handlesubmit = async () => {

    }

    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#fab400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }


  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={ Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView 
            contentContainerStyle={styles.container}
            styles={styles.scrollViewStyle}
        >
            <View style={styles.card}>
                {/* HEADER */}
                <View>
                    <Text style={styles.title}>Ajouter une recommandation</Text>
                    <Text style={styles.subtitle}>Partager vos favoris avec la commu </Text>
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
                                placeholder='Entrer le titre du livre'
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
                        <Text style={styles.label}></Text>
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.previewImage}/>
                            ) : ( 
                                <View style={styles.placeholderContainer}>
                                    <Ionicons
                                        name="image-outline"
                                        size={40}
                                        color={COLORS.textSecondary}
                                    />
                                    <Text style={styles.placeholderText}> Toucher pour séléctionner une image </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Create
