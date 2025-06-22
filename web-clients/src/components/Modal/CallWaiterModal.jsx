import React, { useState } from "react";
import "./TipModal.css";

export default function CallWaiterModal({ openModal, onConfirm }) {// recibe las funciones definidas en el componente App.jsx para poder pasarle la nota y cerrar el modal
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note);
    openModal(false);
  };

  return (
    <div className="modal-window">
      <div className="modal-container">
        <h3>Solicitando servicio a la mesa</h3>
        <div className="form-container">
          <label className="modal-label">
            Mensaje para el mozo/a (opcional):
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ej: Cambiar la gaseosa por agua"
            />
          </label>
          <button className="modal-button" onClick={handleConfirm}>
            Llamar
          </button>
          <button className="modal-button" style={{background:"#ccc", color:"#333"}} onClick={() => openModal(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}