import React, { useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useTables } from "../hooks/useTables";
import Navbar from "../components/NavBar";

export default function ProfileScreen() {
  const { tables, fetchTables, addTable, loading, error } = useTables();

  useEffect(() => {
    fetchTables(); // Cargar las mesas al montar el componente
    console.log(tables);
  }, []);

  const handleAddTable = () => {
    const newTable = { id: "2", title: "mesa 2" }; // Datos de ejemplo
    addTable(newTable);
  };

  return (
    <View style={styles.container}>
         <Navbar />
        <View style={styles.content}>
        <Text>Perfil del Mozo</Text>
        {loading && <ActivityIndicator size="large" />}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <FlatList
            data={tables}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.table}>
                <Text style={styles.title}>{"Nombre: " + item.nombre}</Text>
                <Text style={styles.title}>{"Numero: " + item.numero}</Text>
            </View>
        )}
      />
      <Button title="Agregar Mesa" onPress={handleAddTable} />
        </View>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  content: { 
    flex: 1, // Ancho fijo de la barra lateral
    backgroundColor: "#F9F5EB", // Color de fondo oscuro para distinguirlo
    justifyContent: "space-between", // Espaciado entre los íconos
    alignItems: "center", // Centra los íconos horizontalmente
    //paddingVertical: 10, // Espaciado interno vertical
    padding: 10,
  },table: {
    backgroundColor: "#D3D3D3",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10, // Bordes redondeados
    elevation: 2, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
  },
});