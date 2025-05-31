import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button } from "react-native";
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
import Navbar from "../components/NavBar";
import { useTables } from "../hooks/useTables";
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
  const { tables, setTables, fetchTables, updateTable, deleteTable, error } =
    useTables();

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
      console.log(posicionOriginal);
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
              posicionX: absoluteX - width * 0.2,
              posicionY: absoluteY - height / 6.5,
            }
          : mesa
      )
    );

    setMenuPos({
      x: absoluteX - width * 0.2 + 50,
      y: absoluteY - height / 6.5 - 20,
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
      <Navbar />
      <Text style={styles.title}>Mapa de Mesas</Text>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <Svg width={width * 0.6} height={height * 0.8}>
          <Rect width={width * 0.6} height={height * 0.8} fill="#ddd" />
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
                  setMenuVisible(false);
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
});
