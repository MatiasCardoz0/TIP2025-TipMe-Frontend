import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button, TextInput } from "react-native";
import Svg, { Rect } from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  LongPressGestureHandler,
  State,
  GestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Modal, useWindowDimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "./components/NavBar";
import { useTables } from "../src/hooks/useTables";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

export default function MapaMesas() {
  const { width, height } = useWindowDimensions();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuEstadoVisible, setMenuEstadoVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [modoMover, setModoMover] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(0);
  const [posicionOriginal, setPosicionOriginal] = useState<{
    posicionX: number;
    posicionY: number;
  } | null>(null);
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [selectedTableQR, setSelectedTableQR] = useState<Table | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const { tables, setTables, addTable ,fetchTables, updateTable, deleteTable, error } = useTables();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  //declaro el tipo de las propiedades de table
  type Table = {
    id: string;
    nombre: string;
    estado: string;
    qr: string;
    x: Int32;
    y: Int32;
  };

   const newTable = async () => {
        const newTable = {
          nombre: name,
          numero: number,
          mozoId: 1,
          estado: 1,
          qr: `https://miapp.com/mesa${number}`,
        };
        await addTable(newTable);
        fetchTables();
        setName("");
        setNumber("");
      };

  const handleLongPress = (index: number) => {
    setMenuVisible(true);
    setModoMover(false);
    setMesaSeleccionada(index);
    setMenuPos({
      x: tables[index].posicionX + 40,
      y: tables[index].posicionY - 20,
    });
    setSelectedTableQR({
      id: index.toString(),
      nombre: tables[index].nombre,
      estado: tables[index].nombreEstado,
      qr: tables[index].qr,
      x: tables[index].posicionX,
      y: tables[index].posicionY,
    });
  };

  const iniciarMenuEstado = () => {
    setMenuVisible(false);
    setMenuEstadoVisible(true);
  };

  const iniciarMovimiento = () => {
    if (mesaSeleccionada !== null) {
      setModoMover(true);
      setMenuVisible(false);
      setPosicionOriginal({
        posicionX: tables[mesaSeleccionada].posicionX,
        posicionY: tables[mesaSeleccionada].posicionY,
      });
      
    }
  };



  const handleDrag = (
    index: number,
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    if (!modoMover || mesaSeleccionada === null || index !== mesaSeleccionada)
      return;

    const { absoluteX, absoluteY } = event.nativeEvent;

    setTables(
      tables.map((mesa, i) =>
        i === mesaSeleccionada
          ? {
              ...mesa,
              //posicionX: absoluteX - width * 0.04,
              //posicionY: absoluteY - height / 3.5,
              posicionX: Math.max(10, Math.min(absoluteX - width * 0.04, width - 80)),
              posicionY: Math.max(10, Math.min(absoluteY - height / 3.5, height - 270)),
            }
          : mesa
      )
    );

    setMenuPos({
      x: absoluteX - width * 0.04 + 50,
      y: absoluteY - height / 3.5 - 20,
    });
  };

  const aceptarMovimiento = () => {
    setModoMover(false);
    updateTable(tables[mesaSeleccionada].id, tables[mesaSeleccionada]);
    setMesaSeleccionada(0);
  };

  const cancelarMovimiento = () => {
    if (mesaSeleccionada !== null) {
      setTables(
        tables.map((mesa, i) =>
          i === mesaSeleccionada ? { ...mesa, ...posicionOriginal } : mesa
        )
      );
    }
    setModoMover(false);
    setMesaSeleccionada(0);
  };

  const aplicarEstado = () => {
    console.log("estado cambiando " + nuevoEstado)
    console.log("tables antes: " + tables[mesaSeleccionada].nombreEstado)
    setTables(
      tables.map((mesa, i) =>
        i === mesaSeleccionada ? { ...mesa, nombreEstado: nuevoEstado } : mesa
      )
    );
    
    let estadoNuevo = tables[mesaSeleccionada];
    estadoNuevo.nombreEstado = nuevoEstado;
    updateTable(tables[mesaSeleccionada].id, estadoNuevo);
    setMenuEstadoVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Mesas</Text>
      <Modal visible={addModalVisible} transparent animationType="slide">
            <View style={styles.smallModalContainer}>
              <View style={styles.AddTableModalContent}>
              <Text style={styles.newTableName}>Nueva Mesa</Text>
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
                <View style={styles.statusContainer}>
                  <View style={styles.menuConfirmacion}>
                    <Button title="Confirmar" onPress={() => {newTable(); setAddModalVisible(false); fetchTables();}} />
                  </View>
                  <View style={styles.menuConfirmacion}>
                    <Button title="Cerrar" onPress={() => setAddModalVisible(false)} />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.agregarBoton}>
            <TouchableOpacity style={styles.addTableButton} onPress={() => setAddModalVisible(true)} ><Text style={{color: "#339CFF"}}>╋ Agregar Mesa</Text></TouchableOpacity>
          </View>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <Svg width={width * 0.9} height={height * 0.75}>
          <Rect width="100%" height="100%" fill="#ddd" />
        </Svg>
        <Modal visible={modalQRVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.tableName}>
              QR de {selectedTableQR?.nombre}
            </Text>
            <View style={styles.modalContent}>
              {selectedTableQR && (
                <QRCode value={selectedTableQR.qr} size={200} />
              )}
              <View style={styles.modalButton}>
                <Button
                  title="Cerrar"
                  onPress={() => {
                    setModalQRVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {tables.length > 0 &&
          tables.map((mesa, index) => (
            <LongPressGestureHandler
              onHandlerStateChange={(event) =>
                !modoMover && handleLongPress(index)
              }
              minDurationMs={500}
            >
              <PanGestureHandler
                onGestureEvent={(event) =>
                  modoMover && handleDrag(index, event)
                }
              >
                <View
                  key={mesa.id}
                  style={[
                    styles.mesa,
                    { left: mesa.posicionX, top: mesa.posicionY },
                  ]}
                >
                  <Svg width="70" height="70">
                    <Rect
                      width="70"
                      height="70"
                      fill={
                        mesa.nombreEstado === "LLAMANDO"
                          ? "#a231ee"
                          : mesa.nombreEstado === "DISPONIBLE"
                          ? "#4caf50"
                          : mesa.nombreEstado === "RESERVADA"
                          ? "#ff9800"
                          : "#f44336"
                      }
                    />
                  </Svg>
                  <Text style={styles.texto}>{mesa.numero}</Text>
                  <Text style={styles.estado}>{mesa.nombreEstado}</Text>
                </View>
              </PanGestureHandler>
            </LongPressGestureHandler>
          ))}

        {/*  Menú original */}
        {menuVisible && !modoMover && (
          <View style={[styles.menu, { left: menuPos.x, top: menuPos.y }]}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={() => iniciarMovimiento()}
            >
              <Icon name="zoom-out-map" size={30} />
              <Text style={styles.menuIconContainer}>Mover</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={() => iniciarMenuEstado()}
            >
              <Icon name="sync" size={30} />
              <Text style={styles.menuIconContainer}>Estado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuIconContainer}>
              <Icon
                name="qr-code"
                size={30}
                onPress={() => {
                  setModalQRVisible(true);
                }}
              />
              <Text style={styles.menuIconContainer}>QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuIconContainer}>
              <Icon
                name="delete"
                size={30}
                onPress={() => {
                  deleteTable(tables[mesaSeleccionada].id);
                  setMenuVisible(false);
                  setMesaSeleccionada(0);
                }}
              />
              <Text style={styles.menuIconContainer}>Borrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={() => setMenuVisible(false)}
            >
              <Icon name="cancel" size={30} color="red" />
              <Text style={styles.menuIconContainer}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu de aceptar o cancelar */}
        {modoMover && (
          <View style={[styles.menu, { left: menuPos.x, top: menuPos.y }]}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={aceptarMovimiento}
            >
              <Icon name="check-circle" size={30} color="green" />
              <Text style={styles.menuIconContainer}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={cancelarMovimiento}
            >
              <Icon name="cancel" size={30} color="red" />
              <Text style={styles.menuIconContainer}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu cambio de estado */}
        {menuEstadoVisible && (
          <View
            style={[styles.menuEstado, { left: menuPos.x, top: menuPos.y }]}
          >
            {["DISPONIBLE", "OCUPADA", "RESERVADA"].map((estado) => (
              <TouchableOpacity
                key={estado}
                onPress={() => setNuevoEstado(estado)}
                style={[
                  styles.estadoBoton,
                  {
                    backgroundColor:
                      estado === "DISPONIBLE"
                        ? "#4caf50"
                        : estado === "OCUPADA"
                        ? "#f44336"
                        : estado === "RESERVADA"
                        ? "#ff9800"
                        : "#a231ee",
                  },
                ]}
              >
                <Text style={styles.estadoTexto}>{estado}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.menuEstadoConfirmacion}>
              <TouchableOpacity
                style={styles.menuIconContainer}
                onPress={() => aplicarEstado()}
              >
                <Icon name="check-circle" size={30} color="green" />
                <Text style={styles.menuIconContainer}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuIconContainer}
                onPress={() => setMenuEstadoVisible(false)}
              >
                <Icon name="cancel" size={30} color="red" />
                <Text style={styles.menuIconContainer}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    height: "100%", overflow: "hidden"
  },
  mesa: {
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    top: 10,
  },
  estado: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    top: 30,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
  modalButton: {
    paddingTop: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  tableName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  newTableName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 10
  },
  menuIconContainer: {
    alignItems: "center",
    fontSize: 10,
    padding: 5,
  },
  menuEstado: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  estadoBoton: {
    width: 120,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
  },

  estadoTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  menuEstadoConfirmacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    margin: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
  },
  addTableButton: {
    color: "#339CFF",
    //backgroundColor: "white",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10
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
  menuConfirmacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
    
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agregarBoton : {
    flexDirection : "row",
    width: "100%"
  }
});
