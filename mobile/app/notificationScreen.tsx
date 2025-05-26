import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NotificationScreen(){
    return(
        <View style={styles.container}>
            <Text>Pantalla de notificaciones</Text>
        </View>
    );



    
}; 


//Estilos de la pantalla de notificaciones

const styles = StyleSheet.create({
    container:{       
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10,          
    }
});