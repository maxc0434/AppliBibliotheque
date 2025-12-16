// Ce composant RootLayout sert de “coquille” principale de l’application. Il gère la navigation globale, 
// vérifie si l’utilisateur est authentifié, et redirige automatiquement vers les bonnes piles d’écrans (authentification ou onglets principaux),
// tout en enveloppant le tout dans une zone sûre pour respecter les bordures des appareils.


import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
// Import des outils de navigation d’Expo Router : pile d’écrans et hooks pour l’état et les segments de navigation

import { SafeAreaProvider } from "react-native-safe-area-context";
// Fournisseur pour gérer automatiquement les zones sûres (encoches, barres système, etc.)

import SafeScreen from "../components/SafeScreen"
// Composant personnalisé qui encapsule l’écran dans une vue sûre (probablement un wrapper avec SafeAreaView)

import { StatusBar } from "react-native";
// Composant pour configurer l’apparence de la barre de statut (haut de l’écran)

import {useAuthStore} from "../store/authStore";
// Store d’authentification (probablement Zustand) pour accéder à l’utilisateur et au token

import { useEffect } from "react";
// Hook useEffect pour exécuter du code lors des changements de dépendances ou au montage


export default function RootLayout() {
// Composant racine qui définit la structure de navigation de l’application

  const router = useRouter();
  // Hook pour effectuer des navigations programmatiques (replace, push, etc.)

  const segments = useSegments();
  // Récupère les segments de l’URL de navigation (ex: ["(auth)", "login"])

  // console.log("segments", segments);
  // Ligne de debug (commentée) pour voir les segments de navigation dans la console

  const {checkAuth, user, token} = useAuthStore()
  // Récupère la fonction checkAuth et les infos d’authentification (user et token) depuis le store

  const navState = useRootNavigationState();
  // Récupère l’état global de la navigation (utile pour savoir si la nav est prête)


  useEffect(() => {
    checkAuth();
    // Au montage du composant, vérifie l’authentification (ex: lire AsyncStorage, valider le token, etc.)
  }, [])


  useEffect(() => {
    // Effet qui gère les redirections automatiques selon l’état d’authentification et la route actuelle

    if (!navState?.key || !segments || segments.length === 0) return; 
    // Si la navigation n’est pas encore prête ou que les segments sont vides, on ne fait rien

    const inAuthScreen = segments[0] ==="(auth)"; 
    // Vérifie si l’utilisateur se trouve actuellement dans le groupe d’écrans d’authentification (segment (auth))

    const isSignedIn = user && token; 
    // Considère l’utilisateur comme connecté si un user et un token existent

    if(!isSignedIn && !inAuthScreen) router.replace("/(auth)"); 
    // Si l’utilisateur n’est pas connecté et n’est pas déjà sur une page d’authentification,
    // on le redirige vers le groupe (auth)

    else if(isSignedIn && inAuthScreen) router.replace("/(tabs)") 
    // Si l’utilisateur est connecté mais se trouve dans les écrans d’authentification,
    // on le redirige vers les onglets principaux (groupe (tabs))
  }, [navState, user, token, segments]); 
  // Le code de redirection se relance à chaque changement de navState, user, token ou segments


  return (
    // Rendu principal du layout racine
    <SafeAreaProvider> 
    {/* Fournit le contexte des zones sûres pour toute l’app */}
      <SafeScreen>
      {/* Composant qui applique probablement des marges de zone sûre autour du contenu */}

        <Stack screenOptions={{ headerShown: false }}>
        {/* Déclare une pile de navigation sans en-tête par défaut */}

          <Stack.Screen name="(tabs)" />
          {/* Groupe d’écrans principaux avec barre d’onglets (home, profil, etc.) */}

          <Stack.Screen name="(auth)" />
          {/* Groupe d’écrans d’authentification (login, register, etc.) */}
        </Stack>
      </SafeScreen>

      <StatusBar style="dark"/>
      {/* Configure la barre de statut en thème sombre (texte sombre sur fond clair) */}
    </SafeAreaProvider>
  );
}
