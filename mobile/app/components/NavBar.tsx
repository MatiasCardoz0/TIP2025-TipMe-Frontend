import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Navbar() {
  const router = useRouter();
  const logout = () => {  
    localStorage.removeItem("my-jwt");
    router.push("/login");
  }
  
  return (
    <View style={styles.navbar}>
      <View style={styles.leftIcons}>
        <View style={styles.iconItem}>
          <Icon name="home" size={30} color="#fff" onPress={() => router.push("../home")} />
          <Text style={styles.label}>Inicio</Text>
        </View>
        {/* <View style={styles.iconItem}>
          <Icon name="notifications" size={30} color="#fff" onPress={() => router.push("/pages/notificationScreen")} />
          <Text style={styles.label}>Notificaciones</Text>
        </View> */}
        <View style={styles.iconItem}>
          <Icon name="credit-score" size={30} color="#fff" onPress={() => router.push("../tipsScreen")} />
          <Text style={styles.label}>Propinas</Text>
        </View>
        <View style={styles.iconItem}>
          <Icon name="add-location-alt" size={30} color="#fff" onPress={() => router.push("../tableLocationScreen")} />
          <Text style={styles.label}>Mesas</Text>
        </View>
      </View>
      <View style={styles.rightIcon}>
        <Icon name="logout" size={30} color="#fff" onPress={logout} />
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