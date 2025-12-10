import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {

    //Utilisation de hook useSafeAreaInsets pour récupérer les infos de zone de sécurité de l'écran
    const insets = useSafeAreaInsets();

  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            headerTitleStyle: {
                color: COLORS.textPrimary,
                fontWeight: "600",
            },
            headerShadowVisible: false,
            tabBarStyle: {
                backgroundColor: COLORS.background,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingTop: 5,
                paddingBottom: insets.bottom,
                height: 60 + insets.bottom,
            },
        }}
    >
        <Tabs.Screen 
            name="index"
            options={{
                title: "Accueil",
                tabBarIcon: ({color, size}) => (<Ionicons name="home-outline" size={size} color={color} />)
            }}
        />
        <Tabs.Screen 
            name="create"
            options={{
                title: "Créer",
                tabBarIcon: ({color, size}) => (<Ionicons name="add-circle-outline" size={size} color={color} />)
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: "Profil",
                tabBarIcon: ({color, size}) => (<Ionicons name="person-outline" size={size} color={color} />)
            }} 
        />
    </Tabs>
   
  )
}

export default TabLayout

const styles = StyleSheet.create({})