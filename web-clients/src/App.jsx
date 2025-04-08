import { useState } from 'react'
import './App.css'
import './components/Modal/TipModal.jsx'
import TipModal from './components/Modal/TipModal.jsx'

function App() {
  const [message, setMessage] = useState('')
  const [waitingAction, setWaitingAction] = useState(false)
  const [openTipModal, setOpenTipModal] = useState(false)
  // contador de tiempo de espera

  const handleAction = async (actionType, num) => {
    await setWaitingAction(true);
    setMessage("Procesando solicitud...");

    console.log({num})
    if(num === 2){
      //opción de avisar con qué método de pago
      setMessage(`Esperando la cuenta...`);
    }
    if(num === 1) {
      setMessage(`Esperando servicio solicitado...`);
    }
     else {
        setStatusMessage("Hubo un error. Intente nuevamente.");
    }
  }


  const cancelAction = async () => {
    setWaitingAction(false);
    setMessage("Llamado cancelado.");
    //llamado al service para cancelar el llamado al mozo
  };

  const leaveATip = () => {
    setOpenTipModal(true);
    console.log('tipping..');
  }

  return (
    <div>
      <div className='header'>
        <div className='logo'>     
          <h1>TipMe</h1>
        </div>
      </div>

      <div className='main-content'>
        <h2 className='portal-title'>Portal del cliente</h2>

        <div className='buttons'>
          <button className='menu-button' onClick={() => handleAction("Solicitar Servicio", 1)}>
            ✋ Solicitar servicio
          </button>
          <button className='menu-button' onClick={() => handleAction("Pedir Cuenta", 2)}>
            💳 Pedir la cuenta
          </button>
          <button className='menu-button' onClick={() => leaveATip()}>
            ⭐ Dejar Propina
          </button>
        </div>
        <div className="status">
                    {waitingAction && (<div className='waiting-message'>{message} <button className='cancel-call' onClick={cancelAction}>Cancelar llamado</button></div>) }
                </div>
        {openTipModal && <TipModal openModal={setOpenTipModal} />}
      </div>

      <div className='footer'>
      TipMe - Todos los derechos reservados.
      </div>
    </div>
    )
  
}

export default App;
