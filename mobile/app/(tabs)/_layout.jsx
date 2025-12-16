// Ce composant gère la navigation par onglets (barre en bas de l’écran) dans une application mobile React Native.
// Il permet à l’utilisateur de passer facilement d’un écran à un autre comme « Accueil », « Créer », et « Profil ».

import { StyleSheet, Text, View } from 'react-native' // Import des composants de base de React Native
import React from 'react' // Import de la bibliothèque React pour construire les composants
import { Tabs } from 'expo-router' // Import du composant Tabs fourni par Expo Router pour gérer les onglets
import { Ionicons } from "@expo/vector-icons" // Import d’icônes Ionicons pour illustrer les onglets
import COLORS from "../../constants/colors"; // Import des couleurs définies dans un fichier de constantes
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import du hook pour gérer les marges de sécurité selon l’écran

// Déclaration du composant principal TabLayout
const TabLayout = () => {

    // Hook pour récupérer les marges de sécurité (zone non couverte par caméra, encoche, etc.)
    const insets = useSafeAreaInsets();

    // Retourne le composant Tabs qui gère plusieurs écrans avec une barre d’onglets
    return (
        <Tabs
            // Configuration générale des onglets et de la barre
            screenOptions={{
                headerShown: false, // Cache l’en-tête supérieur de chaque écran
                tabBarActiveTintColor: COLORS.primary, // Définit la couleur principale pour l’onglet actif
                headerTitleStyle: { // Style du titre (même si caché ici)
                    color: COLORS.textPrimary, // Couleur du texte du titre
                    fontWeight: "600", // Poids de police du titre
                },
                headerShadowVisible: false, // Supprime l’ombre sous l’en-tête
                tabBarStyle: { // Style général de la barre d’onglets
                    backgroundColor: COLORS.background, // Couleur de fond de la barre
                    borderTopWidth: 1, // Ajoute une fine bordure au-dessus de la barre
                    borderTopColor: COLORS.border, // Définit la couleur de la bordure du haut
                    paddingTop: 5, // Espace intérieur en haut de la barre
                    paddingBottom: insets.bottom, // Espace en bas selon la zone de sécurité
                    height: 60 + insets.bottom, // Hauteur totale de la barre (ajustée à l’écran)
                },
            }}
        >

            {/* Premier onglet : Accueil */}
            <Tabs.Screen 
                name="index" // Nom du fichier ou de la route associée
                options={{
                    title: "Accueil", // Titre affiché sous l’icône
                    tabBarIcon: ({ color, size }) => ( // Icône de l’onglet
                        <Ionicons name="home-outline" size={size} color={color} /> // Icône de maison
                    )
                }}
            />

            {/* Deuxième onglet : Créer */}
            <Tabs.Screen 
                name="create" // Nom du fichier ou de la route associée
                options={{
                    title: "Créer", // Titre affiché pour l’onglet
                    tabBarIcon: ({ color, size }) => ( // Icône correspondante
                        <Ionicons name="add-circle-outline" size={size} color={color} /> // Icône de création (+)
                    )
                }}
            />

            {/* Troisième onglet : Profil */}
            <Tabs.Screen 
                name="profile" // Nom du fichier ou de la route associée
                options={{
                    title: "Profil", // Titre affiché de l’onglet
                    tabBarIcon: ({ color, size }) => ( // Icône associée
                        <Ionicons name="person-outline" size={size} color={color} /> // Icône de personne
                    )
                }} 
            />
        </Tabs>
    )
}

// Export du composant pour pouvoir l’utiliser ailleurs dans l’application
export default TabLayout

// Feuille de style vide (peut être complétée plus tard si besoin)
const styles = StyleSheet.create({})
