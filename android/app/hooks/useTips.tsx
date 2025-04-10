import { useState } from "react";

export const useTips = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET Propinas (Obtener propinas)
  const fetchTips = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.101:5065/api/propina/1");
      const json = await response.json();
      setTips(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al obtener las propinas");
    } finally {
      setLoading(false);
    }
  };

  // POST Propinas (Agregar una nueva propina)
  const addTip = async (newTable: any) => {
    try {
      const response = await fetch("http://192.168.0.100:5065/api/grabar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTable),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la propina");
      }
      const createdTable = await response.json();
      setTips((prevTables) => [...prevTables, createdTable]); // Agrega la nueva propina
    } catch (err: any) {
      setError(err.message || "Error al agregar propina");
    }
  };

  return { tips, fetchTips, addTip, loading, error };
};