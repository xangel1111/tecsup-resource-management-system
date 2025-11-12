import './LoginScreen.css';
import tecsupLogo from '../../assets/tecsup-logo.png';
import { useNavigate } from 'react-router';

// URL del logo de Tecsup (puedes cambiarla por una local)
const tecsupLogoUrl = tecsupLogo;
//const tecsupLogoUrl = 'https://www.tecsup.edu.pe/wp-content/uploads/2024/07/Group-680.png';

// SVG para el ícono de Google
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 2.73-2.21 5.07-4.79 6.69l7.38 5.71C44.97 36.6 46.98 31.05 46.98 24.55z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.38-5.71c-2.11 1.42-4.79 2.28-7.51 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const LoginScreen = () => {

  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/google";
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/login";
  };

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* --- Columna Izquierda: Formulario --- */}
        <div className="login-form-wrapper">
          <h1>Iniciar Sesión</h1>
          
          <form action="http://localhost:5000/login" method='POST'>
            <div className="input-group">
              <label htmlFor="email">Correo Institucional</label>
              <input type="email" id="email" name='email'/>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name='password'/>
            </div>
            
            <div className="button-container">
              <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                <GoogleIcon />
              </button>
              <button 
                type="submit" 
                className="submit-btn">
                Siguiente
              </button>
            </div>
          </form>
          
          <img src={tecsupLogoUrl} alt="Logo Tecsup" className="tecsup-logo" />
        </div>
        
        {/* --- Columna Derecha: Imagen --- */}
        <div className="login-image-wrapper">
          {/* La imagen se aplica como fondo en CSS */}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;