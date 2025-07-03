import { useState } from "react";
import { config } from "../../config"

export const useNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET Notas (Obtener notas)
  const fetchNotes = async (mesaId : number) => {
    setLoading(true);
    try {
      const response = await fetch(config.API_URL+"/api/nota?idMesa="+ mesaId);
      const json = await response.json();
      setNotes(json.data);
      console.log(json.data)
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al obtener notas");
    } finally {
      setLoading(false);
    }
  };

  // POST Notas (Agregar una nueva nota)
  const addNote = async (mesaId : number, message : string) => {
    try {
      const newNote = {
        "mesaId" : mesaId,
        "mensaje" : message
      }
      console.log(newNote);
      const response = await fetch(config.API_URL+"/api/nota/grabar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la nota");
      }
      console.log(response);
      const createdNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, createdNote]);
      fetchNotes(mesaId);
    } catch (err: any) {
      setError(err.message || "Error al agregar nota");
    }
  };

  // PUT Notas (Modificar una nota)
  const updateNote = async (mesaId : number, renglon: number, mensaje : string) => {
    try {
        const notaActualizada = {
            "mesaId" : mesaId,
            "renglon" : renglon,
            "mensaje" : mensaje
        };

      const response = await fetch(config.API_URL+"/api/nota/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notaActualizada),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la mesa");
      }
      setNotes((prevNotes) =>
        prevNotes.map((nota) =>
          nota.id === mesaId ? { ...nota, ...notaActualizada } : nota
        )
      );
    } catch (err: any) {
      setError(err.message || "Error al actualizar nota");
    }
  };

  // DELETE Nota (Borra una nota)
  const deleteNote = async (idMesa: number, idNota : number) => {
    try {      
      console.log("mesa: "+idMesa + ", renglon: " + idNota)
      const response = await fetch(config.API_URL+"/api/nota/borrarUnaNota/"+idMesa+"/"+idNota, {
        method: "DELETE",         
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la nota");
      }
      setNotes((prevNotes) => prevNotes.filter((mesa) => mesa.id !== idMesa));
      fetchNotes(idMesa);
    } catch (err: any) {
      setError(err.message || "Error al eliminar mesa");
    }
  };

  // DELETE Nota (Borra todas las notas)
  const deleteAllNotes = async (idMesa: number) => {
    try {      
      const response = await fetch(config.API_URL+"/api/nota/borrarNotas/"+idMesa, {
        method: "DELETE",        
      });
      if (!response.ok) {
        throw new Error("Error al eliminar las notas");
      }
      setNotes((prevNotes) => prevNotes.filter((mesa) => mesa.id !== idMesa));
    } catch (err: any) {
      setError(err.message || "Error al eliminar mesa");
    }
  };

  return { notes, setNotes ,fetchNotes, addNote, updateNote, deleteNote, deleteAllNotes, loading, error };
};