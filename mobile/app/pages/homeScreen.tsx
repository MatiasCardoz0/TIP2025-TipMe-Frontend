import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button } from "react-native";
import { useTables } from "../hooks/useTables";
import Navbar from "../components/NavBar";
import EstadoMesa from "../stateEnum";
import { formatEnumText } from "../stateEnum";

export default function HomeScreen() {

  const { tables, fetchTables, loading, error } = useTables();
  const [notification, setNotification] = useState<string | null>(null);

  
    useEffect(() => {
      fetchTables(); // Cargar las mesas al montar el componente
      console.log(tables);
    }, []);

    //declaro el tipo de las propiedades de table
    type Table = {
      id: string;
      nombre: string;
      lugares: number;
      estado: number;
    };

    const getStatusStyle = (estado:number) => {
      switch (estado) {
        case EstadoMesa.DISPONIBLE:
          return styles.statusAvailable;
        case EstadoMesa.RESERVADA:
          return styles.statusReserved;
        case EstadoMesa.OCUPADA:
          return styles.statusOccupied;
        case EstadoMesa.LLAMANDO:
          return styles.statusCallingWaiter;

          default:
          return {};
      
    };
  
  }; 

  return (
    <View style={styles.container}> 
      <Navbar/>
      <Text style= {styles.listItemsTitle}>Detalle de Mesas</Text>
      <FlatList 
        data={tables}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }: { item: Table }) => (

          <View style={styles.tableContainer}>
          <View style={styles.tableInfo}>
            <Text style={styles.tableName}>{item.nombre}</Text>
            <Text style={styles.seats}> Lugares: 3 </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(item.estado)]}>
              <Text style={styles.statusText}>{formatEnumText(Object.keys(EstadoMesa).find(key => EstadoMesa[key as keyof typeof EstadoMesa] === item.estado) || "UNKNOWN")}</Text>
            </View>
          </View>
        </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  tableInfo: {
    marginBottom: 12,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seats: {
    fontSize: 14,
    color: '#667',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#4caf50',
  },
  statusOccupied: {
    backgroundColor: '#f44336',
  },
  statusReserved: {
    backgroundColor: '#ff9800',
  },
  statusCallingWaiter: {
    backgroundColor: '#a231ee',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listItemsTitle: {
    margin: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: "center",
  },

});
