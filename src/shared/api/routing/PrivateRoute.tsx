import { Navigate, Outlet } from 'react-router-dom';
//import { useAuthStore } from '../../features/auth/model/store/useAuthStore';

const PrivateRoute = () => {
  //const isAuth = Boolean(useAuthStore((state) => state.accessToken));
  const isAuth = true;
  return isAuth ? <Outlet /> : <Navigate to='/auth/login' replace />;
};

export default PrivateRoute;
