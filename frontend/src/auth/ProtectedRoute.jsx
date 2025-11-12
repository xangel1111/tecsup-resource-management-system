import React from 'react';
import { Navigate } from 'react-router';
import { isAuthenticated, getUserRole } from './auth';

/**
 * @param {object} props
 * @param {React.ReactNode} props.element - El componente a renderizar
 * @param {string} [props.requiredRole] - El rol requerido (ej: 'admin')
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default ProtectedRoute;