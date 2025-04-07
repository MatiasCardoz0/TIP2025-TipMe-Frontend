import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from "react-native";
import { useTables } from "../hooks/useTables";
import Navbar from "../components/NavBar";
const { width, height } = Dimensions.get("window");


//Pantalla principal
export default function TipsScreen(){
    const [page, setPage] = useState(1); // Página actual
    const [loading, setLoading] = useState(false); // Indica si está cargando más datos

    const [datos, setDatos] = useState([
        {
          "id": 1,
          "monto": 1500,
          "fecha": "2025-04-01T12:30:00",
          "idMesa": 10,
          "idMozo": 1
        },
        {
          "id": 2,
          "monto": 2000,
          "fecha": "2025-04-01T13:00:00",
          "idMesa": 11,
          "idMozo": 1
        },
        {
          "id": 3,
          "monto": 1800,
          "fecha": "2025-04-01T14:45:00",
          "idMesa": 10,
          "idMozo": 1
        },
        {
          "id": 11,
          "monto": 5000,
          "fecha": "2025-04-04T23:55:27",
          "idMesa": 1,
          "idMozo": 1
        }
      ]);


      const handleFilterMonto = () => {
        const sorted = [...datos].sort((a,b) => a.monto - b.monto);
        setDatos(sorted);
      };

      const handleFilterMesa = () => {
        const sorted = [...datos].sort((a,b) => a.idMesa - b.idMesa)
        setDatos(sorted);
      };

    return(
        <View style={styles.container}>
            <Navbar />
            <View style={styles.content}>
                <View style={styles.filterContainer}>
                    <Button title="Sort by price" onPress={handleFilterMonto} color="#2f4b7c" />
                    <Button title="Sort by table" onPress={handleFilterMesa} color="#2f4b7c"/>
                </View>
                <View style={styles.header}>
                <Text style={styles.headerCell}>Monto</Text>
                <Text style={styles.headerCell}>Fecha</Text>
                <Text style={styles.headerCell}>Mesa</Text>
                </View>
                <FlatList
                data={datos} // Cambia a los datos reales cuando crees el hook
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>Monto: ${item.monto}</Text>
                        <Text style={styles.cell}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
                        <Text style={styles.cell}>Mesa: {item.idMesa}</Text>
                    </View>
                )}
                />
            </View>
            
        </View>

    );

}


//Estilos de la pantalla de tips

const styles = StyleSheet.create({
    container:{
        //flex: 1,
        flexDirection: "column",
        width: width,
        height: height * 0.8, 
    },
    content: {
        //flex: 1, // El resto del espacio después del navbar
        paddingTop: height * 0.1,
        width: width * 0.91,
        padding: 10,
        margin: height * 0.05,
        justifyContent: "flex-end",
        backgroundColor: "#ffffff", // Fondo claro
      },
      filterContainer: {
        flexDirection: "row", // Botones de filtro en una fila
        justifyContent: "space-evenly",
        marginBottom: 10, // Espaciado entre filtro y tabla
        padding: 10,
      },
      row: {
        flexDirection: "row", // Cada fila de la tabla
        justifyContent: "space-evenly",
        backgroundColor: "#e0e0e0", // Fondo blanco para filas
        padding: 10,        
        marginBottom: 5,
        borderRadius: 5, // Bordes redondeados
        elevation: 2, // Sombra en Android
      },
      cell: {
        fontSize: 14,
        color: "#333", // Color oscuro para texto
      },      
    header: {
        flexDirection: "row", // Encabezados en una fila
        justifyContent: "space-evenly",
        backgroundColor: "#669bbc", // Fondo para distinguir encabezados
        padding: 10,
    },
    headerCell: {
        fontSize: 14,
        fontWeight: "bold", // Resaltar los encabezados
    },
});