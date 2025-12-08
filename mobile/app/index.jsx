import {StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>BIBLIOOOOOOOOOOOTHEQUE</Text>
      <Link href="/(auth)"><Text style={styles.link}>Connexion</Text></Link>
      <Link href="/(auth)/signup"><Text style={styles.link}>Inscription</Text></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    color:'blue',
  },
  link:{
    color: 'blue',
    marginTop: 8,
  }
})