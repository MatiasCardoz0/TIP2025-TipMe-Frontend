import React from "react";
import { useState } from 'react';
import "./TipModal.css";
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';




function TipModal({openModal}) {

    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [preferenceId, setPreferenceId] = useState(null);

    // Inicializa Mercado Pago con tu public key
    initMercadoPago('APP_USR-9cf7f19b-b2b7-4220-944a-da93fd1e151c', {
        locale: "es-AR"
    });

    const createPreference = async () => {
        try
        {
            const response = await axios.get("http://192.168.0.102:5065/api/mp/preferenceId/"+amount);
            const id = response.data.data.preferenceId;
            return id;
        }
        catch(error){
            console.log(error)
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if(id){
            setPreferenceId(id);
        }
    };

    const saveTip = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setErrorMsg("Por favor, ingresá un monto válido.");
            return;
        }
        try {
            handleBuy();
            const response = await axios.post("http://192.168.0.102:5065/api/propina/grabar", {
                "monto": amount,
                "fecha": new Date().toISOString(),
                "idMesa": 10,
                "idMozo": 1 
        });
    
        if (response.status === 200) {
            //setSuccess(true);
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
                            {/* ---------------MP inicio */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>                            
                            {/* Renderiza el botón de pago */}
                            {preferenceId &&
                            <div style={{ width: '300px' }}>
                                <Wallet initialization={{ preferenceId: preferenceId }} />
                            </div>}
                            </div>
                            {/* ----------------MP fin */}
                                {!preferenceId && <button className="modal-button" onClick={saveTip}>Continuar</button>}
                                <button className="modal-button" onClick={() => openModal(false)}>Cancelar</button>
                        </div></>
                )}
            </div>
        </div>
    )
}

export default TipModal;