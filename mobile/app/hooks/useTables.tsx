import { useState } from "react";

export const useTables = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET Mesas (Obtener mesas)
  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5065/api/mesa/historico/:idMozo?idMozo=1");
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
      const response = await fetch("http://localhost:5065/api/mesa", {
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

  return { tables, fetchTables, addTable, loading, error };
};