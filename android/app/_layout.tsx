import { Stack } from "expo-router";

export default function RootLayout() {
  //uso stack para navegar múltiples páginas
  return <Stack
  screenOptions={{
    headerStyle: {
      backgroundColor: 'black',
    },
    
    headerTintColor: '#fafafa',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    contentStyle: { //aplica a cualquier página dentro del layout
      paddingHorizontal: 10,
      paddingTop: 10,
      backgroundColor: '#fff'
    }
  }}>
  <Stack.Screen name="index" options={{title: 'TipMe'}}/>
  </Stack>;
}
