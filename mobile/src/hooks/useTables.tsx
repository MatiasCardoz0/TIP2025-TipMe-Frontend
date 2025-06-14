import { useState } from "react";
import { config } from "../../app/config"

export const useTables = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET Mesas (Obtener mesas)
  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.API_URL+"/api/mesa/historico/1");
      const json = await response.json();
      setTables(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al obtener mesas");
    } finally {
      setLoading(false);
    }
  };

  // POST Mesas (Agregar una nueva mesa)
  const addTable = async (newTable: any) => {
    try {
      const response = await fetch(config.API_URL+"/api/mesa/grabar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTable),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la mesa");
      }
      const createdTable = await response.json();
      setTables((prevTables) => [...prevTables, createdTable]); // Agrega la nueva mesa
    } catch (err: any) {
      setError(err.message || "Error al agregar mesa");
    }
  };

  // PUT Mesas (Modificar una mesa)
  const updateTable = async (mesaId : number, mesaActualizada: any) => {
    try {
      console.log(mesaId);
      console.log(mesaActualizada);
      const response = await fetch(config.API_URL+"/api/mesa/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mesaActualizada),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la mesa");
      }
      setTables((prevTables) =>
        prevTables.map((mesa) =>
          mesa.id === mesaId ? { ...mesa, ...mesaActualizada } : mesa
        )
      );
    } catch (err: any) {
      setError(err.message || "Error al actualizar mesa");
    }
  };

  // DELETE Mesas (Borra una mesa)
  const deleteTable = async (id: number) => {
    try {
      const response = await fetch(config.API_URL+"/api/mesa/borrar/"+id, {
        method: "DELETE", 
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la mesa");
      }
      setTables((prevTables) => prevTables.filter((mesa) => mesa.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar mesa");
    }
  };

  return { tables, setTables ,fetchTables, addTable, updateTable, deleteTable, loading, error };
};