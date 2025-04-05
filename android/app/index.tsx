import { Text, View, StyleSheet, FlatList } from "react-native";

export default function HomeScreen() {

  const TablesTemp = [
    {
      id: '1',
      title: 'mesa 1',
    },]

    const TipHistoryTemp = [
      {
        pesos: 1000.00,
        mesa_id: 1,
      },]
  
  const tables = async () => {
    try {//el mozo id está harcodeado para el poc
      const response = await fetch(
        'http://localhost:5065/api/mesa/historico/1',
      );
      const json = await response.json();
      return json.mesas;
    } catch (error) {
      console.error(error);
    }
  };

  const tipHistory = async () => {
    try {
      const response = await fetch(
        'http://localhost:5065/api/tipHistory/1',
      );
      const json = await response.json();
      return json.propinas;
    } catch (error) {
      console.error(error);
    }
  };


  type ItemProps = {title: string};


  const Table = ({title}: ItemProps) => (
    <View style={styles.table}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return ( 
    <View style={styles.container}>
      <Text>Mesas Activas</Text>
      <FlatList  data={TablesTemp}
        renderItem={({ item }) => <Table title={item.title} />}
        keyExtractor={item => item.id}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  table: {
    backgroundColor: '#D3D3D3',
    padding:10,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  title: {
    fontSize: 32,
  },
  
});
