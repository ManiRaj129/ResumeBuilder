import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Protected = () => {
  const { authenticated } = useAuth();

  {
    /*
     outlet: to render actual pages
     replace : to prevent back rendering the protected pages
    */
  }
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;
