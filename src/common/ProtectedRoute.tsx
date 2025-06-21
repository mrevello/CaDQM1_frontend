import { Navigate, Outlet } from 'react-router-dom';
import { AUTH_CONFIG, ROUTES } from '../constants';

export const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = ROUTES.LOGIN,
}) => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  const isLoggedIn = token && token !== 'undefined' && token !== 'null';

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectPath} />;
};
