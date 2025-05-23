import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from "react-native";
import { useTips } from "./hooks/useTips";
import Navbar from "./components/NavBar";
import Icon from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from "react-native-picker-select";


const { width, height } = Dimensions.get("window");

type Tip = {
  id: number;
  monto: number;
  fecha: string;
  numeroMesa: number;
  nombreMesa: string;
};

//Pantalla principal
export default function TipsScreen(){
  const { tips, fetchTips, loading, error } = useTips();
  const [sortedTips, setSortedTips] = useState<Tip[]>([]);
  
    useEffect(() =>{
      fetchTips();      
    }, []);

    useEffect(() => {
      setSortedTips(tips);
    }, [tips]);

    const handleSort = (value: string) => {
      let sorted = [];
      switch (value) {
        case "monto_asc":
          sorted = [...tips].sort((a, b) => a.monto - b.monto);
          break;
        case "monto_desc":
          sorted = [...tips].sort((a, b) => b.monto - a.monto);
          break;
        case "mesa_asc":
          sorted = [...tips].sort((a, b) => a.numeroMesa - b.numeroMesa);
          break;
        case "mesa_desc":
          sorted = [...tips].sort((a, b) => b.numeroMesa - a.numeroMesa);
          break;
        case "fecha_asc":
          sorted = [...tips].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          break;
        case "fecha_desc":
          sorted = [...tips].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          break;
        default:
          sorted = tips;
      }
      setSortedTips(sorted);
    };
      
    return(
        <View style={styles.container}>
            <View>
            <Text style={styles.title}>Resumen de propinas</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.dropDown}>
                <RNPickerSelect
                onValueChange={(value) => handleSort(value)}
                items={[
                  { label: "Monto Ascendente", value: "monto_asc" },
                  { label: "Monto Descendente", value: "monto_desc" },
                  { label: "Mesa Ascendente", value: "mesa_asc" },
                  { label: "Mesa Descendente", value: "mesa_desc" },
                  { label: "Fecha Ascendente", value: "fecha_asc" },
                  { label: "Fecha Descendente", value: "fecha_desc" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Ordenar por...", value: null }}
                />
                </View>
                <View style={styles.grid}>
                  <View style={styles.header}>
                  <Text style={styles.headerCell}>Mesa</Text>
                  <Text style={styles.headerCell}>Nombre</Text>
                  <Text style={styles.headerCell}>Monto</Text>
                  <Text style={styles.headerCell}>Fecha</Text>
                  </View>
                  <FlatList
                  data={sortedTips}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  renderItem={({ item }) => (
                      <View style={styles.row}>
                          <Text style={styles.cell}>{item.numeroMesa}</Text>
                          <Text style={styles.cell}>{item.nombreMesa}</Text>
                          <Text style={styles.cell}><Icon name="attach-money" size={18}/>{item.monto}</Text>
                          <Text style={styles.cell}>{new Date(item.fecha).toLocaleDateString()}</Text>                       
                      </View>
                  )}
                  />
                </View>
                
            </View>
            
        </View>

    );

}


//Estilos de la pantalla de tips

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
    },
    content: {
        paddingTop: "10%",
        width: "100%",
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
        backgroundColor: "#ffffff", // Fondo blanco para filas
        padding: 10,        
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: "#0056B3",
        //borderRadius: 10, // Bordes redondeados
        elevation: 2, // Sombra en Android
      },
      cell: {
        fontSize: 18,
        color: "#333", // Color oscuro para texto
      },      
    header: {
        flexDirection: "row", // Encabezados en una fila
        justifyContent: "space-evenly",
        backgroundColor: "#ffffff", // Fondo para distinguir encabezados
        padding: 10,
        margin: 10
    },
    headerCell: {
        fontSize: 18,
        fontWeight: "bold", // Resaltar los encabezados
    },
    title:{
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "left",
      marginTop: "10%",
      fontStyle: "normal",
      color: '#333',
    },
    dropDown:{
      width: "90%",
      height: "15%",
    },
    grid:{
      
    }
});


// Estilos del dropdown
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    marginBottom: 10,
    width: 105
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    marginBottom: 10,
    width: "75%",
    textAlign: 'left',
  },
});