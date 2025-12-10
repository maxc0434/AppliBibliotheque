import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen"
import { StatusBar } from "react-native";
import {useAuthStore} from "../store/authStore";
import { useEffect } from "react";

export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments();

  // console.log("segments", segments);

  const {checkAuth, user, token} = useAuthStore()

  const navState = useRootNavigationState();

  useEffect(() => {
    checkAuth();
  }, [])

  useEffect(() => {

    if (!navState?.key || !segments || segments.length === 0) return; // ne pas naviguer tant que la nav n’est pas prête

    const inAuthScreen = segments[0] ==="(auth)"; // défini le segment[0] comme étant celui des screens de (auth)
    const isSignedIn = user && token; // Vérifiera la présence du user et de son token

    if(!isSignedIn && !inAuthScreen) router.replace("/(auth)"); //Si l'user pas connecté et qu'il n'est pas sur la page d'authentification...

    else if(isSignedIn && inAuthScreen) router.replace("/(tabs)") // ... redirection vers la page des onglets
  }, [navState, user, token, segments]); // Dépendances: utilisateurs, token et segments de l'URL

  return (
    <SafeAreaProvider> 
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  );
}
