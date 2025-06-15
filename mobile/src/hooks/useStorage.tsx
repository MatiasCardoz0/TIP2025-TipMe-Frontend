import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";


export const useStorage = () => {

    //Método que guarda la clave y el valor en el local storage si es web o storage si es android
    const saveDataLocal = async (clave : String,  valor : any) => {
    if (Platform.OS === "web") {
            localStorage.setItem(clave.toString(), valor);
        } else {
            await AsyncStorage.setItem(clave.toString(), valor);
        }
    };

    const getDataLocal = (clave: string) => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        const value = Platform.OS === "web" 
            ? localStorage.getItem(clave) 
            : await AsyncStorage.getItem(clave);
            
        setData(value);
        };

        fetchData();
    }, [clave]);

    return data;
};
    
    return {getDataLocal ,saveDataLocal}
}
