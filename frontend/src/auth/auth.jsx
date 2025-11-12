import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'jwtToken'; // El nombre de la key en localStorage

// Esta función la llamas en tu página de Login cuando el API te devuelve el token
export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// La llamas cuando el usuario presiona "Cerrar Sesión"
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  // Opcional: Redirige al login
  window.location.href = '/login'; 
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Revisa si el token existe Y si no ha expirado
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  try {
    const { exp } = jwtDecode(token); // 'exp' es la fecha de expiración
    // Compara la fecha de expiración (en segundos) con la fecha actual
    if (Date.now() >= exp * 1000) {
      logout(); // Limpia el token expirado
      return false;
    }
    return true;
  } catch (e) {
    // Si el token es inválido, lo limpia
    logout();
    return false;
  }
};

// Obtiene el rol del usuario desde el token (¡muy útil para el Admin!)
export const getUserRole = () => {
  const token = getToken();
  if (isAuthenticated() && token) {
    try {
      const { role } = jwtDecode(token); // Asume que tu JWT tiene un campo "role"
      return role; // ej: 'admin' o 'user'
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getUser = () => {
  const token = getToken();
  if (isAuthenticated() && token) {
    try {
      const user = jwtDecode(token);
      return user;
    } catch (e) {
      return null;
    }
  }
  return null;
}