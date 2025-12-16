// Ce composant SafeScreen est un wrapper universel qui applique automatiquement les marges de sécurité
// (encoches, barres système) en haut de l'écran pour tous les écrans de l'application.

import { View, StyleSheet } from 'react-native';
// Import View pour le conteneur et StyleSheet pour les styles optimisés

import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Hook qui récupère les marges de sécurité de l'appareil (iPhone X+, Android)

import COLORS from '../constants/colors';
// Palette de couleurs centralisée de l'application

export default function SafeScreen({children}) {
// Composant wrapper réutilisable qui reçoit les enfants à encapsuler

    const insets = useSafeAreaInsets();
    // Récupère les valeurs de sécurité : insets.top (encoche), bottom, left, right

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
    {/* Conteneur principal avec paddingTop dynamique pour l'encoche */}
      {children}
      {/* Contenu de l'écran passé en props (Stack, FlatList, etc.) */}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Occupe tout l'espace disponible
        backgroundColor: COLORS.background, // Fond cohérent partout
    },
})
// Styles optimisés : fond + flex complet
