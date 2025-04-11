import { Stack } from "expo-router";
import Navbar from "./components/NavBar";
import HomeScreen from ".";
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// export default function RootLayout() {
//   //uso stack para navegar múltiples páginas
// //   return (
// //   <NavigationContainer>
// //     <Stack.Navigator>
// //       <Stack.Screen name="navbar" component={HomeScreen} options={{title: 'TipMe'}}/>
// //     </Stack.Navigator>
// //   </NavigationContainer>
// //  );
// };
