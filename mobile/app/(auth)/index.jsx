import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React from "react";
import styles from "../../assets/styles/login.styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import Icon from "react-native-vector-icons/Ionicons";

export default function Login() {
  // Déclare l'état local pour stocker l'email saisi par l'utilisateur
  const [email, setEmail] = useState("");
  // Déclare l'état local pour stocker le mot de passe saisi par l'utilisateur
  const [password, setPassword] = useState("");
  // Déclare un état booléen pour afficher ou masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);
  // Récupère depuis le store les valeurs user, isLoading, et la fonction login
  const { user, isLoading, login } = useAuthStore();

  // Fonction appelée lorsque l'utilisateur clique sur le bouton de connexion
  const handleLogin = async () => {
    // Appelle la fonction login avec les valeurs d'email et de mot de passe
    const result = await login(email, password);

    // Si la connexion échoue, affiche une alerte avec le message d'erreur
    if (!result.success) Alert.alert("Erreur", result.error);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>
                BookShare <Icon name="book" size={24} color="#e0a931" />{" "}
              </Text>
              <Text style={styles.subtitle}>CONNECTEZ-VOUS</Text>
            </View>
          </View>
        </View>
        <View>
          <Image
            source={require("../../assets/images/Login-amico.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}> Email </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Entrer votre email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-adress"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}> Mot de Passe </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Entrer votre mot de passe"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte?</Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.link}> Inscription </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
