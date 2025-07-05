import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ModalDeleteTable({ visible, onConfirm, onCancel } : {visible:boolean, onConfirm: () => void, onCancel: () => void}) {
    return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContentConfirmacion}>
          <Text style={{ margin: 10 }}>
            Eliminando mesa
          </Text>
          <View style={styles.menuEstadoConfirmacion}>
            <TouchableOpacity style={styles.menuIconContainer} onPress={onConfirm}>
              <Icon name="check-circle" size={30} color="green" />
              <Text style={styles.menuIconContainer}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuIconContainer} onPress={onCancel}>
              <Icon name="cancel" size={30} color="red" />
              <Text style={styles.menuIconContainer}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContentConfirmacion: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  menuEstadoConfirmacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  menuIconContainer: {
    alignItems: "center",
    fontSize: 10,
    padding: 5,
  },
});