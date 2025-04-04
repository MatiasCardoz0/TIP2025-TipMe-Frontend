import React from "react";
import "./TipModal.css"

function TipModal({openModal}) {


    return (
        <div className="modal-container">
            <h2>Enviando propina</h2>
            <div className="form-container">
                <input placeholder="Ingrese cantidad"></input>
                <button>Continuar</button>
                <button onClick={() => openModal(false)}>Cancelar</button>
            </div>
        </div>
    )
}

export default TipModal;