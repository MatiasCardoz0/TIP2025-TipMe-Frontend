import React from "react";
import { useState } from 'react';
import "./TipModal.css";
import axios from 'axios';

function TipModal({openModal}) {

    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const saveTip = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setErrorMsg("Por favor, ingresá un monto válido.");
            return;
        }
        try {
        const response = await axios.post("http://localhost:5065/api/propina/grabar", {
            "monto": amount,
            "fecha": new Date().toISOString(),
            "idMesa": 10,
            "idMozo": 1 
        });
    
        if (response.status === 200) {
            setSuccess(true);
          console.log("Gracias por su colaboración! :)");
        }
        else {
          console.log ("Ocurrió un error al intentar transferir dinero")
        }
      }
        catch (error){
          console.log("Error en el servidor." + error);
        }
    }

    return (
        <div className="modal-window">
            <div className="modal-container">
            {success ? (
            <>
            <h2> ¡Gracias por su colaboración! </h2>
            <button className="modal-button" onClick={() => openModal(false)}>Cerrar</button>
            </>) :
                (
                <>
                    <h2>Enviando propina</h2>
                    <div className="form-container">
                            <div className="input-row">
                                <span className="currency-symbol">$</span>
                                <input type="number" placeholder="Ingrese cantidad" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                { errorMsg !== '' && <div className="error-msg"> {errorMsg} </div> }
                            </div>
                            <button className="modal-button" onClick={saveTip}>Continuar</button>
                            <button className="modal-button" onClick={() => openModal(false)}>Cancelar</button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default TipModal;