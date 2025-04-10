import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <View style={styles.leftIcons}>
        <View style={styles.iconItem}>
          <Icon name="home" size={30} color="#fff" onPress={() => router.push("/")} />
          <Text style={styles.label}>Inicio</Text>
        </View>
        <View style={styles.iconItem}>
          <Icon name="notifications" size={30} color="#fff" onPress={() => router.push("/pages/notificationScreen")} />
          <Text style={styles.label}>Notificaciones</Text>
        </View>
        <View style={styles.iconItem}>
          <Icon name="credit-score" size={30} color="#fff" onPress={() => router.push("/pages/tipsScreen")} />
          <Text style={styles.label}>Propinas</Text>
        </View>
        <View style={styles.iconItem}>
          <Icon name="qr-code" size={30} color="#fff" onPress={() => router.push("/pages/profileScreen")} />
          <Text style={styles.label}>QR</Text>
        </View>
      </View>
      <View style={styles.rightIcon}>
        <Icon name="logout" size={30} color="#fff" onPress={() => router.push("/")} />
        <Text style={styles.label}>Salir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    height: "8.5%", 
    backgroundColor: "#339CFF", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20
  },
  leftIcons: {
    flexDirection: "row",
    justifyContent: "flex-start", 
    alignItems: "center",
  },
  rightIcon: {
    alignItems: "center", 
  },
  iconItem: {
    alignItems: "center", 
    marginHorizontal: 10, 
  },
  label: {
    fontSize: 12, 
    color: "#ffffff", 
    marginTop: 5, 
  },
});