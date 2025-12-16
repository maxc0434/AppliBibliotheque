// Ce composant ProfileHeader affiche les informations essentielles de l'utilisateur connecté
//  (avatar, pseudo, email, date d'inscription) dans une carte élégante en haut de l'écran profil.


import { View, Text } from 'react-native'
// Import des composants de base : conteneurs (View) et texte (Text)

import React from 'react'
// Import de React pour créer le composant fonctionnel

import { useAuthStore } from '../store/authStore'
// Store Zustand d'authentification pour récupérer les données utilisateur

import {Image} from 'expo-image'
// Composant Image optimisé Expo (cache, lazy loading, performances)

import styles from "../assets/styles/profile.styles";
// Styles spécifiques profil (carte, avatar, textes)

import { formatMemberSince } from '../lib/utils';
// Utilitaire pour formater la date d'inscription ("depuis 2 mois")

export default function ProfileHeader() {
// Composant d'en-tête profil (réutilisable)

  const { user } = useAuthStore();
  // Récupère les données utilisateur depuis le store global

  if (!user) return null;
  // Ne rend rien si pas d'utilisateur connecté (état de chargement)

  return (
    <View style={styles.profileHeader}>
    {/* Carte principale avec ombre et bordure */}
      
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} /> 
      {/* Avatar circulaire de l'utilisateur (80x80px) */}

      <View style={styles.profileInfo}>
      {/* Conteneur infos textuelles (flex:1 pour s'adapter) */}
        <Text style={styles.username}>{user.username}</Text>
        {/* Pseudo en gras (20px, fontWeight: 700) */}
        
        <Text style={styles.email}>{user.email}</Text>
        {/* Email en gris secondaire (14px) */}
        
        <Text style={styles.memberSince}> Inscrit : {formatMemberSince(user.createdAt)} </Text>
        {/* Date d'inscription formatée ("Inscrit : depuis 3 mois") */}
      </View>
    </View>
  )
}
