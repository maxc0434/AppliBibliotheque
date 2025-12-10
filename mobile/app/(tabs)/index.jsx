import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/authStore'

const Index = () => {

    const {logout} = useAuthStore();

  return (
    <View>
      <Text>Home</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({})