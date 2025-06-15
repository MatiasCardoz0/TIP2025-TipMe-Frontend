import './App.css'
import './components/Modal/TipModal.jsx'
import logo from '../../shared/TipMe_Logo_transparent.png'
import { config } from "../../config.js";
import { useEffect } from "react";

function Success() {
    const navigate = useNavigate();
  //   const [searchParams] = useSearchParams();
  //   const mesaId = searchParams.get("id");

  //   useEffect(() => {
  //   if (mesaId) {
  //     //saveTip(mesaId);
  //   }
  // }, [mesaId]);

  //   const saveTip = async (mesaId) => {           
  //       try {
  //           const response = await axios.post(config.API_URL+"/api/propina/grabar", {
  //               "monto": amount,
  //               "fecha": new Date().toISOString(),
  //               "idMesa": mesaId,
  //               //"idMozo": 1 
  //       });
  //       }
  //       catch (error){
  //         console.log("Error en el servidor." + error);
  //         }
  //     }

  return (
    <div>
      <div className='header'>
        <div className='logo'>     
          <img src={logo} alt="Logo" className='logo-image' /> <h1>TipMe</h1>
        </div>
      </div>
      <div className='main-content'>
        <h2 className='portal-title'>Gracias por su colaboración!</h2>

        <div className='buttons'>
          <button className='menu-button' onClick={() => navigate("/")}>
            Volver
          </button>
        </div>
      </div>
    </div>
    )
  
}

export default Success;
