// Importation de la fonction 'create' pour créer un store Zustand
import { create } from "zustand"; 

// Importation d'AsyncStorage pour stocker des données localement sur le mobile
import AsyncStorage from '@react-native-async-storage/async-storage';



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
            const response = await fetch("https://applibibliothequebackend.onrender.com/api/auth/register", {
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
    }
}));
