import {StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>BIBLIOOOOOOOOOOOTHEQUE</Text>

      <Link href="/login"> Login </Link>
      <Link href="/signup"> Inscription </Link>



      {/* <Image
        source={{ uri: "https://unsplash.com/fr/photos/tete-humaine-numerique-abstraite-avec-des-effets-de-glitch-colores-qnHhZFU6rMQ"}}
      /> */}
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
  }

})