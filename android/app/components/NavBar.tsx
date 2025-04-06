import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Navbar() {
  const router = useRouter(); // Navegación entre vistas

  return (
    <View style={styles.navbar}>
      <View style={styles.topIcons}>
        <View style={styles.iconContainer}>
            <Icon name="home" accessibilityLabel="prueba" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/")} />
            <Text style={styles.label}>Home</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="notifications" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/pages/notificationScreen")} />
            {/* <Text style={styles.label}>Notifications</Text> */}
          </View>
          <View style={styles.iconContainer}>
          <Icon name="credit-score" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/pages/tipsScreen")} />
          <Text style={styles.label}>Tips</Text>
          </View>
          <View style={styles.iconContainer}>
          <Icon name="qr-code" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/pages/profileScreen")} />
          <Text style={styles.label}>QR</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="person" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/pages/profileScreen")} />
            <Text style={styles.label}>Profile</Text>
          </View>
      </View>
      <View style={styles.logOut}>
            <Icon name="logout" size={30} color="#fff" style={styles.icon} onPress={() => router.push("/")} />
            <Text style={styles.label}>Logout</Text>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: width * 0.05,
    height: height * 0.9,
    backgroundColor: "#003f5c",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 0,
  },
  iconContainer:{
    alignItems: "center",
    marginBottom: 20
  },
  label:{
    fontSize: 12,
    color: "#ffffff",
  },
  topIcons: {
    alignItems: "center"
  },
  logOut: {
    alignItems: "center",
    marginBottom: 20
  }
});