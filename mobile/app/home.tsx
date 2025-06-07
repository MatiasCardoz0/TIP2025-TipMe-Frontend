import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button, TextInput, TouchableOpacity } from "react-native";
import { useTables } from "../src/hooks/useTables";
import EstadoMesa from "./stateEnum";
import { formatEnumText } from "./stateEnum";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Modal } from "react-native";
import QRCode  from "react-native-qrcode-svg";

export default function HomeScreen() {

  const { tables, fetchTables, addTable, loading, error } = useTables();

  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTableQR, setSelectedTableQR] = useState<Table | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [errorMsg, setErrMsg] = useState("");
  
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
      qr: string;
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
          case EstadoMesa.ESPERANDO_CUENTA:
            return styles.statusWaitingBill;
            default:
            return {};
       };
    };

    const isInteger = (value: string) => {
  return /^\d+$/.test(value);
};

    const newTable = async () => {
        const newTable = {
          nombre: name,
          numero: number,
          mozoId: 1,
          estado: EstadoMesa.DISPONIBLE,
          qr: `https://miapp.com/mesa${number}`,
        };
        await addTable(newTable);
        fetchTables();
        setName("");
        setNumber("");
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
    <Modal visible={addModalVisible} transparent animationType="slide">
      <View style={styles.smallModalContainer}>
        <View style={styles.AddTableModalContent}>
        <Text style={styles.tableName}>Nueva Mesa</Text>
          <TextInput
            placeholder="Nombre de la mesa"
            value={name}
            onChangeText={(text) => setName(text)}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Numero de mesa"
            value={number}
            onChangeText={(text) => setNumber(text)}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
           {!isInteger(number) && number.length > 0 && (
        <Text style={{ color: "red", marginBottom: 8, fontSize:12.5 }}>Ingrese un número entero para identificar la mesa</Text>)}

          <View style={{ margin: 2 }}>
            <Button title="Confirmar" onPress={() => {newTable(); setAddModalVisible(false)}} disabled={!name.trim() || !number.trim()|| !isInteger(number)} />
          </View>
          <View style={{ margin: 2 }}>
            <Button title="Cerrar" onPress={() => setAddModalVisible(false)} />
          </View>
        </View>
      </View>
    </Modal>
      <Text style= {styles.listItemsTitle}>Mis Mesas</Text>
      <TouchableOpacity style={styles.addTableButton} onPress={() => setAddModalVisible(true)} ><Text style={{color: "#339CFF"}}>╋ Agregar Mesa</Text></TouchableOpacity>
      <FlatList 
        data={tables}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (

          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <View style={styles.tableInfo}>
                  <Text style={styles.tableName}>{item.nombre}</Text>
                  <Text style={styles.seats}>Lugares: 3</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, getStatusStyle(item.estado)]}>
                    <Text style={styles.statusText}>
                      {formatEnumText(
                        Object.keys(EstadoMesa).find(
                          key => EstadoMesa[key as keyof typeof EstadoMesa] === item.estado
                        ) || "UNKNOWN"
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.qrIconContainer}>
                <Icon
                  name="qr-code"
                  size={30}
                  onPress={() => {
                    setSelectedTableQR(item);
                    setModalVisible(true);
                  }}
                />
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
    width: '100%',
    padding: 15,
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
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
    padding: 10
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
  statusWaitingBill: {
    backgroundColor: '#df5722',
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
  row: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
},
qrIconContainer: {
  justifyContent: "center",
  alignItems: "flex-end",
  paddingLeft: 10,
},
  smallModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.23)",
  },
  AddTableModalContent: {
    backgroundColor: "rgba(185, 197, 209, 0.82)64)",
    borderWidth: 1,
    padding: 40,
    borderRadius: 10,
    borderColor: "#339CFF",
    alignItems: "center",
  },
  addTableButton: {
    color: "#339CFF",
    backgroundColor: "white",
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  menuConfirmacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
    
  },
});

