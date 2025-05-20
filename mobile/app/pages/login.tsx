import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
//import TransparentLogo from "../../assets/images/TipMe_Logo_transparent.png";
import { useAuth } from "../context/AuthContext";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();


  const handleLogin = async () => {debugger
    console.log("login button pressed");
      if (!onLogin) {
      window.alert("Error en Login");
    return;
  }
  const response = await onLogin?.(email, password);
  console.log("response from login", response);
  debugger
  if (!response || response?.error) {
    Alert.alert("Error en Login");
    console.log("Error en Login ", response);
  }
};

const handleRegister = async () => {
  const response = await onRegister?.(email, password);
  if (response?.error) {
    Alert.alert("Error", response.message);
  } else {
    onRegister?.(email, password);
  }
}; 
//<Image source={TransparentLogo} style={{ width: 100, height: 100 }} />
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text:string) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text:string)=> setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});