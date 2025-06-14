import './App.css'
import './components/Modal/TipModal.jsx'
import logo from '../../shared/TipMe_Logo_transparent.png'

function App() {
    const navigate = useNavigate();

    const saveTip = async () => {           
        try {
            const response = await axios.post("http://localhost:5065/api/propina/grabar", {
                "monto": amount,
                "fecha": new Date().toISOString(),
                "idMesa": 10,
                //"idMozo": 1 
        });
        }
        catch (error){
          console.log("Error en el servidor." + error);
          }
      }

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

export default App;
