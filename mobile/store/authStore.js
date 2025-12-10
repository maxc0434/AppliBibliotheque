// Importation de la fonction 'create' pour créer un store Zustand
import { create } from "zustand"; 

// Importation d'AsyncStorage pour stocker des données localement sur le mobile
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from "../constants/api"



// Création du store Zustand et exportation du hook personnalisé 'useAuthStore'
export const useAuthStore = create((set) => ({
    // État utilisateur initial (aucun utilisateur connecté)
    user: null,
    // Jeton d'authentification (null par défaut)
    token: null, 
    // Indicateur de chargement, utile pour afficher un spinner pendant les requêtes
    isLoading: false,

    // Fonction asynchrone pour inscrire un nouvel utilisateur
    register: async (username, email, password) => {
        // Active le chargement avant l'envoi de la requête
        set({ isLoading: true });

        try {
            // Envoi d'une requête POST à l'API pour créer un compte
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST", // Type de requête
                headers: {
                    "Content-Type": "application/json", // Spécifie le type de contenu
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }), // Corps de la requête en JSON
            });

            // Conversion de la réponse en JSON
            const data = await response.json();

            // Si la réponse n'est pas OK, on lève une erreur avec le message renvoyé
            if (!response.ok) throw new Error(data.message || "Quelque chose s'est mal passé");

            // Stockage des données utilisateur et du token dans la mémoire locale
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            // Mise à jour du store Zustand avec les nouvelles données
            set({
                token: data.token,
                user: data.user,
                isLoading: false
            });

            // Retourne un objet indiquant le succès de l'opération
            return { success: true };

        } catch (error) {
            // Stoppe l'indicateur de chargement en cas d'erreur
            set({ isLoading: false });

            // Retourne un objet avec l'erreur capturée
            return {
                success: false,
                error: error.message
            };
        }
    },

// Fonction asynchrone pour vérifier l'état d'authentification de l'utilisateur au démarrage de l'app
checkAuth: async () => {
    try {  // Début du bloc try-catch pour gérer les erreurs potentielles
        // Récupère le token JWT stocké dans AsyncStorage (persistance locale React Native)
        const token = await AsyncStorage.getItem("token");
        
        // Récupère les données utilisateur stockées sous forme de chaîne JSON dans AsyncStorage
        const userJson = await AsyncStorage.getItem("user");
        
        // Parse le JSON utilisateur si existant, sinon assigne null (utilisateur non connecté)
        const user = userJson ? JSON.parse(userJson) : null;

        // Met à jour l'état global du store (Zustand/Jotai) avec token et user récupérés
        set({ token, user });
        
    } catch (error) {  // Capture toute erreur (AsyncStorage, JSON.parse, etc.)
        // Affiche l'erreur dans la console pour debug (ne bloque pas l'app)
        console.log("Authentification check échouée", error);
    }
},

logout: async () => {
    // Supprime le jeton d'authentification enregistré localement
    await AsyncStorage.removeItem("token");
    // Supprime les informations de l'utilisateur stockées localement
    await AsyncStorage.removeItem("user");
    // Réinitialise l'état global du store en mettant le token et l'utilisateur à null
    set({token: null, user: null});
},

login: async (email, password) => {
    // Passe l'état de chargement à true pendant la tentative de connexion
    set({isLoading: true});

    try {
        // Envoie une requête HTTP POST vers le backend pour tenter de se connecter
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST", // Méthode HTTP utilisée
            headers: {
                "Content-Type": "application/json", // Indique qu'on envoie du JSON
            },
            // Corps de la requête contenant l'email et le mot de passe
            body: JSON.stringify({
                email,
                password,
            }),
        });

        // Convertit la réponse du serveur en objet JSON
        const data = await response.json();
        // Vérifie si la réponse n'est pas correcte et lève une erreur avec un message adapté
        if(!response.ok) throw new Error(data.message || "Quelque chose s'est mal passé");

        // Sauvegarde les informations de l'utilisateur dans le stockage local
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        // Sauvegarde le jeton d’authentification dans le stockage local        
        await AsyncStorage.setItem("token", data.token);

        // Met à jour l'état global avec les nouvelles informations utilisateur et arrête le chargement
        set({ token: data.token, user: data.user, isLoading: false});
        // Retourne un objet indiquant que la connexion s’est bien déroulée
        return {success: true};
    } catch (error) {
        // Si une erreur survient, on arrête le chargement
        set({isLoading: false});
        // Retourne un objet indiquant l’échec de la connexion avec le message d’erreur
        return {success: false, error: error.message};
    }
},


}));
