import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button } from "react-native";
import { useTables } from "../hooks/useTables";
import Navbar from "../components/NavBar";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Modal } from "react-native";
import QRCode  from "react-native-qrcode-svg";

export default function HomeScreen() {

  const { tables, fetchTables, loading, error } = useTables();
  const [notification, setNotification] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTableQR, setSelectedTableQR] = useState<Table | null>(null);
  
    useEffect(() => {
      fetchTables(); // Cargar las mesas al montar el componente
      console.log(tables);
    }, []);

    //declaro el tipo de las propiedades de table
    type Table = {
      id: string;
      nombre: string;
      lugares: number;
      estado: string;
      qr: string;
    };

    const getStatusStyle = (status:string) => {
      switch (status) {
        case "DISPONIBLE":
          return styles.statusAvailable;
        case "OCUPADA":
          return styles.statusOccupied;
        case "RESERVADA":
          return styles.statusReserved;
        case "LLAMANDO MOZO":
          return styles.statusCallingWaiter;

          default:
          return {};
      
    };
  
  }; 

  return (
    <View style={styles.container}> 
      <Modal visible={modalVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <Text style={styles.tableName}>QR de {selectedTableQR?.nombre}</Text>
      <View style={styles.modalContent}>
        {selectedTableQR && <QRCode value={selectedTableQR.qr} size={200} />}
        <Button title="Cerrar" onPress={() => {setModalVisible(false)
        }} />
      </View>
    </View>
  </Modal>
      <Navbar/>
      <Text style= {styles.listItemsTitle}>Detalle de Mesas</Text>
      <FlatList 
        data={tables}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (

          <View style={styles.tableContainer}>
          <View style={styles.tableInfo}>
            <Text style={styles.tableName}>{item.nombre}</Text>
            <Text style={styles.seats}> Lugares: 3 </Text>
            
            <Icon name="qr-code" size={30}  onPress={() => {
                setSelectedTableQR(item);
                setModalVisible(true);
              }} />

          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(item.estado)]}>
              <Text style={styles.statusText}>{item.estado}</Text>
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
    padding : 10,
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#339CFF",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
  },
});