import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NavBar from "../components/NavBar";

export default function NotificationScreen(){
    return(
        <View style={styles.container}>
            
            <Text>Pantalla de notificaciones</Text>
            <NavBar/>
        </View>
    );



    
}; 


//Estilos de la pantalla de notificaciones

const styles = StyleSheet.create({
    container:{

    }
});