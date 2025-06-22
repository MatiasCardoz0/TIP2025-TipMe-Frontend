import { use, useState, useEffect } from 'react'
import './App.css'
import './components/Modal/TipModal.jsx'
import TipModal from './components/Modal/TipModal.jsx'
import CallWaiterModal from './components/Modal/CallWaiterModal.jsx'
import logo from '../../shared/TipMe_Logo_transparent.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
//import config from '../../config.ts'

function App() {
  const [message, setMessage] = useState('')
  const [waitingAction, setWaitingAction] = useState(false)
  const [openTipModal, setOpenTipModal] = useState(false)
  const [callWaiterModal, setOpenCallWaiterModal] = useState(false)
   const { id } = useParams();


  useEffect(() => {
    localStorage.setItem('mesaId', id);
    console.log(`Mesa ID: ${id}`);
  }, [id]);
  

  const handleAction = async (num) => {
    await setWaitingAction(true);
    setMessage("Procesando solicitud...");
    console.log({num})
    if(num === 1) {
      setOpenCallWaiterModal(true);
    }
    if(num === 2){debugger
      //opción de avisar con qué método de pago
      try {
        await axios.post(
          `http://localhost:5065/api/mesa/pedirCuenta?idMesa=${id}`
        );
        setMessage(`Esperando la cuenta...`);
      } catch (error) {
        setMessage("Hubo un error al pedir la cuenta");
      }
    }
    else {
      setMessage("Hubo un error. Intente nuevamente");
    }
  }

  const confirmCallWaiter = async (note) => {
    setWaitingAction(true);
    setMessage("Procesando llamado al mozo...");
    try {
      await axios.post(
        `http://localhost:5065/api/mesa/llamarMozo?idMesa=${id}`,
        { nota: note }
      ); 
      setMessage("Esperando servicio solicitado...");
    } catch (error) {
      setMessage("Hubo un error al llamar al mozo.");
    }
  };

  const cancelAction = async () => {
    setWaitingAction(false);
    setMessage("Llamado cancelado");
    // Llamado al service para cancelar el llamado al mozo
  };

  const leaveATip = () => {
    setOpenTipModal(true);
    console.log('tipping..');
  }

  return (
    <div>
      <div className='header'>
        <div className='logo'>     
          <img src={logo} alt="Logo" className='logo-image' /> <h1>TipMe</h1>
        </div>
      </div>

      <div className='main-content'>
        <h2 className='portal-title'>Portal del cliente</h2>

        <div className='buttons'>
          <button className='menu-button' onClick={() => handleAction( 1)}>
            ✋ Solicitar servicio
          </button>
          <button className='menu-button' onClick={() => handleAction(2)}>
            📃Pedir la cuenta
          </button>
          <button className='menu-button' onClick={() => leaveATip()}>
            ⭐ Dejar Propina
          </button>
        </div>
        <div className="status">
          { waitingAction && (<div className='waiting-message'>{message} <button className='cancel-call' onClick={cancelAction}>Cancelar llamado</button></div>) }
        </div>
        {openTipModal && <TipModal openModal={setOpenTipModal} />}
        {callWaiterModal && <CallWaiterModal openModal={setOpenCallWaiterModal} onConfirm={confirmCallWaiter} />}
      </div>
    </  div>
  )
  
}

export default App;
