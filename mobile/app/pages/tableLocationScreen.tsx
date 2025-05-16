import React, { useState, useRef } from "react";
import { View, Animated, PanResponder, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

const mesasIniciales = [
  { id: "mesa1", x: 50, y: 50 },
  { id: "mesa2", x: 150, y: 100 },
  { id: "mesa3", x: 250, y: 200 }
];

export default function MapaMesas() {
  const [mesas, setMesas] = useState(mesasIniciales);
  const panValues = useRef(mesas.map(mesa => new Animated.ValueXY({ x: mesa.x, y: mesa.y }))).current;

  const handleRelease = (index, event, gesture) => {
    const nuevasMesas = [...mesas];

    // 🔹 Aseguramos que la nueva posición se guarde correctamente
    const nuevoX = mesas[index].x + gesture.dx;
    const nuevoY = mesas[index].y + gesture.dy;

    nuevasMesas[index] = { ...nuevasMesas[index], x: nuevoX, y: nuevoY };
    setMesas(nuevasMesas); // 🔹 Ahora se guarda correctamente
    panValues[index].setValue({ x: nuevoX, y: nuevoY }); // 🔹 Se actualiza la animación con la nueva posición
  };

  return (
    <View style={styles.container}>
      <Svg height="400" width="400">
        <Rect x="0" y="0" width="400" height="400" fill="#ddd" />
      </Svg>

      {mesas.map((mesa, index) => {
        const panResponder = useRef(
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
              [null, { dx: panValues[index].x, dy: panValues[index].y }],
              { useNativeDriver: false }
            ),
            onPanResponderRelease: (event, gesture) => handleRelease(index, event, gesture),
          })
        ).current;

        return (
          <Animated.View key={mesa.id} style={[styles.mesa, { transform: [{ translateX: panValues[index].x }, { translateY: panValues[index].y }] }]} {...panResponder.panHandlers}>
            <Svg width="60" height="60">
              <Rect width="60" height="60" fill="orange" />
            </Svg>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" },
  mesa: { position: "absolute", width: 60, height: 60 },
});
