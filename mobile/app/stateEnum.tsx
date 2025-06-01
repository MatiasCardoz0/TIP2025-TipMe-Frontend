const EstadoMesa = {
    DISPONIBLE: 1,
    RESERVADA: 2,
    OCUPADA: 3,
    LLAMANDO: 4,
    ESPERANDO_CUENTA: 8
};

export const formatEnumText = (text: string) => {
    return text
      .toLowerCase() 
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Mayuscula en la primera letra de cada palabra
  };

export default EstadoMesa;