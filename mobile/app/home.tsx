import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button, TextInput, TouchableOpacity } from "react-native";
import { useTables } from "../src/hooks/useTables";
import EstadoMesa from "./stateEnum";
import { formatEnumText } from "./stateEnum";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Modal } from "react-native";
import QRCode  from "react-native-qrcode-svg";
import ModalDeleteTable from "./components/ModalDeleteTable";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { ToastContainer } from "react-toastify";

export default function HomeScreen() {

  const { tables, fetchTables, addTable, updateTable, deleteTable, loading, error } = useTables();
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTableQR, setSelectedTableQR] = useState<Table | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // si está el id abre el dropdown de estados, si es null lo cierra
  let sortedTables = [...tables].reverse(); // Mesas ordenadas con las mas nuevas primero
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); //menu de opciones de caad mesa
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);

  
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
        mozoId: localStorage.getItem("userId") || "0",
        estado: EstadoMesa.DISPONIBLE,
        qr: '',
      };
      await addTable(newTable);
      fetchTables();
      setName("");
      setNumber("");
  };

  const changeState = async (mesa: Table, nombreEstado: string) => {
    await updateTable(Number(mesa.id), { ...mesa, nombreEstado });
    fetchTables();
    setOpenDropdownId(null);
  }

  return (
    
    <View style={styles.container}> 
    {/* Modales */}
      <Modal visible={modalVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <Text style={styles.QRtableName}>QR de {selectedTableQR?.nombre}</Text>
      <View style={styles.modalContent}>
        <View style={{borderWidth: 1}}>{selectedTableQR && <QRCode value={selectedTableQR.qr} size={200} />}</View>
        <Text style={{ color: "black", fontSize: 16, marginTop: 10, marginBottom: 10 }}>
          {selectedTableQR?.qr}
        </Text>
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
            <Button title="Confirmar" testID="confirmar-btn" onPress={() => {newTable(); setAddModalVisible(false)}} disabled={!name.trim() || !number.trim()|| !isInteger(number)} />
          </View>
          <View style={{ margin: 2 }}>
            <Button title="Cerrar" onPress={() => setAddModalVisible(false)} />

          </View>
        </View>
      </View>
    </Modal>
    
    {/* Lista de mesas */}
      <Text style= {styles.listItemsTitle}>Mis Mesas</Text>
      <TouchableOpacity style={styles.addTableButton} onPress={() => setAddModalVisible(true)} ><Text style={{color: "#339CFF"}}>╋ Agregar Mesa</Text></TouchableOpacity>
      <TouchableWithoutFeedback
    onPress={() => {
      setOpenMenuId(null);
      setOpenDropdownId(null);}}>
      <FlatList 
        data={sortedTables}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          
          <View style={styles.tableContainer}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.tableInfo}>
                <Text style={styles.tableName}>{item.nombre}</Text>
                <Text style={styles.seats}>Mesa numero: {item.numero}</Text>
              </View>
              {/*** dropdown de estados ***/}
              <View style={styles.statusContainer}>
                  <TouchableOpacity style={[styles.statusBadge, getStatusStyle(item.estado), { flexDirection: "row", alignItems: "center" }]} onPress={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}>
                  <Text style={styles.statusText}>
                    {formatEnumText(
                      Object.keys(EstadoMesa).find(
                        key => EstadoMesa[key as keyof typeof EstadoMesa] === item.estado
                      ) || "UNKNOWN"
                    )}
                  </Text>
                  <Icon name={ openDropdownId === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
                {openDropdownId === item.id && (
                  <View style={styles.dropdownMenu}>
                    {[EstadoMesa.DISPONIBLE, EstadoMesa.RESERVADA, EstadoMesa.OCUPADA].map((estado) => (
                      <TouchableOpacity
                      key={estado}
                      style={styles.dropdownItem}
                        onPress= {() => changeState(item, Object.keys(EstadoMesa).find((key) => EstadoMesa[key as keyof typeof EstadoMesa] === estado) || "UNKNOWN")}>
                        <Text style={styles.dropdownItemText}>
                          {formatEnumText(
                            Object.keys(EstadoMesa).find(
                              (key) =>
                                EstadoMesa[key as keyof typeof EstadoMesa] === estado
                            ) || "UNKNOWN"
                          )}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View> )}
              </View>
            </View>
            {/* menú de tres puntitos */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setOpenMenuId(item.id)} style={{ padding: 6 }}>
                <Icon name="more-vert" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            {openMenuId === item.id && (
              <View style={styles.meatballMenu}>
                <TouchableOpacity
                  style={{ padding: 7}}
                  onPress={() => {
                    setTableToDelete(item);
                    setDeleteModalVisible(true);
                    setOpenMenuId(null);
                  }}
                  >
                  <Text style={{ color: "red"}}>Eliminar mesa</Text>
                </TouchableOpacity>
              </View>
            )}      
            {/* QR */}
            <View style={styles.qrIconContainer}>
              <Icon
                name="qr-code"
                size={30}
                onPress={() => {
                  setSelectedTableQR(item);
                  setModalVisible(true);
                }}/>
            </View>
          </View>
        </View>
        )}/>
        </TouchableWithoutFeedback>
    <ModalDeleteTable visible={deleteModalVisible} onConfirm={() => {
      if (tableToDelete) {
        deleteTable(Number(tableToDelete.id));
        setDeleteModalVisible(false);
        setTableToDelete(null);
      }
    }}
    onCancel={() => {
      setDeleteModalVisible(false);
      setTableToDelete(null);
    }}
  />
    <ToastContainer />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    padding: 15,
    backgroundColor: '#fafafa',
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    margin: 20,
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
    backgroundColor: "#fafafa",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#339CFF",
    borderWidth: 3
  },
  row: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
},
  QRtableName: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
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
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  menuConfirmacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
    
  },
  dropdownMenu: {
  position: "absolute",
  top: -35,
  left: 126,
  borderRadius: 8,
  elevation: 100,
  zIndex: 10000, 
  borderWidth: 1,
  borderColor: "#ccc",
  backgroundColor: "#fff",
},
dropdownItem: {
  padding: 6,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
dropdownItemText: {
  color: "#333",
  fontSize: 14,
},
meatballMenu: {
  position: "absolute",
  top: 45,
  right: 65,
  backgroundColor: "#fff",
  borderRadius: 8,
  elevation: 5,
  zIndex: 100,
  borderWidth: 1,
  borderColor: "#ccc",
  minWidth: 100,
  shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
});

