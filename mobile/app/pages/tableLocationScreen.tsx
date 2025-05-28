import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button, ImageBackground } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { GestureHandlerRootView, PanGestureHandler, LongPressGestureHandler, State, HandlerStateChangeEvent, LongPressGestureHandlerEventPayload, GestureEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { Modal, useWindowDimensions } from "react-native";
import QRCode  from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "../components/NavBar";
import { Dimensions } from "react-native";



const mesasIniciales = [
  { id: "mesa1", x: 50, y: 50 , nombre: "mesa 1", estado: "DISPONIBLE", qr : "qrParaMesa1"},
  { id: "mesa2", x: 150, y: 100, nombre: "mesa 2" , estado: "LLAMANDO", qr : "qrParaMesa2"},
  { id: "mesa3", x: 250, y: 200, nombre: "mesa 3" , estado: "LLAMANDO", qr : "qrParaMesa3"},
  { id: "mesa4", x: 270, y: 200, nombre: "mesa 4" , estado: "OCUPADO" , qr : "qrParaMesa4"}
];

export default function MapaMesas() {
  const [mesas, setMesas] = useState(mesasIniciales);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTableQR, setSelectedTableQR] = useState<Table | null>(null);
  const { width, height } = useWindowDimensions();
  //Tengo que ver si calcular con el alto y ancho de pantalla o con copilot

type Table = {
      id: string;
      nombre: string;
      lugares: number;
      estado: string;
      qr: string;
    };

  const handleLongPress = (index: number, event: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setMenuVisible(true);
      setMenuPos({ x: mesas[index].x + 40, y: mesas[index].y - 20 });
      setSelectedTableQR({
      id: index.toString(),
      nombre: mesas[index].nombre,
      lugares: 3,
      estado: mesas[index].estado,
      qr: mesas[index].qr
    });
    }
  };

  const handleDrag = (index: number, event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { absoluteX, absoluteY } = event.nativeEvent;
    setMenuVisible(false);
    setMesas(mesas.map((mesa, i) => 
      i === index 
        ? { ...mesa, x: absoluteX - (width * 0.2), y: absoluteY - (height/6.5) } 
        : mesa
    ));
  };


  return (
    <View style={styles.container}>
        <Navbar/>
    <GestureHandlerRootView style={styles.gestureContainer}>
      <Svg  width={width * 0.6} height={height * 0.8}>
        <Rect x="0" y="0" width={width * 0.6} height={height * 0.8} fill="#ddd" />
      </Svg>
      <Modal visible={modalVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <Text style={styles.tableName}>QR de {selectedTableQR?.nombre}</Text>
      <View style={styles.modalContent}>
        {selectedTableQR && <QRCode value={selectedTableQR.qr} size={200} />}
        <Button title="Cerrar" onPress={() => {setModalVisible(false) }} />
      </View>
    </View>
  </Modal>
      {mesas.map((mesa, index) => (
        <LongPressGestureHandler onHandlerStateChange={(event) => handleLongPress(index, event)} minDurationMs={500}>
          <PanGestureHandler onGestureEvent={(event) => handleDrag(index, event)}>
            <View key={mesa.id} style={[styles.mesa, { left: mesa.x, top: mesa.y }]}>
              <Svg width="70" height="70">
                <Rect width="70" height="70" fill={mesa.estado == "LLAMANDO"? "#a231ee" : mesa.estado == "DISPONIBLE"? "#4caf50" : "#f44336"} />
              </Svg>
              <Text style={[styles.texto, { top: 10 }]}>{mesa.nombre}</Text>
              <Text style={[styles.estado, { top: 30 }]}>{mesa.estado}</Text>
            </View>
          </PanGestureHandler>
        </LongPressGestureHandler>
      ))}

      {/* 🔹 Menú flotante con 3 iconos */}
      {menuVisible && (
        <View style={[styles.menu, { left: menuPos.x, top: menuPos.y }]}>
          <TouchableOpacity style={styles.menuIconContainer}>
            <Icon name="qr-code" size={30}  onPress={() => { setModalVisible(true); }} />
            <Text style={styles.menuIconContainer}>QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuIconContainer}>
            <Icon name="sticky-note-2" size={30}  onPress={() => { setModalVisible(true); }} />
            <Text style={styles.menuIconContainer}>Detalle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuIconContainer}>
            <Icon name="delete" size={30}  onPress={() => { setMenuVisible(false); }} />
            <Text style={styles.menuIconContainer}>Borrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuIconContainer}>
            <Icon name="cancel" size={30} color="red" onPress={() => { setMenuVisible(false); }} />
            <Text style={styles.menuIconContainer}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  gestureContainer : { flex: 1, justifyContent: "center", alignItems: "flex-start", backgroundColor: "#f0f0f0"}, 
  container: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" },
  mesa: { position: "absolute", width: 60, height: 60, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 14, fontWeight: "bold", color: "white", position: "absolute", top: 20 },
  estado: { fontSize: 12, fontWeight: "bold", color: "white", position: "absolute", top: 30 },
  menu: { position: "absolute", backgroundColor: "white", padding: 10, borderRadius: 10, flexDirection: "row", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
  icono: { fontSize: 24, marginHorizontal: 10 },
   modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#339CFF",
    padding: 60,
    borderRadius: 10,
    alignItems: "center",
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
  menuIconContainer: {
    alignItems: "center",
    fontSize: 10,
    padding: 5
  }
});
