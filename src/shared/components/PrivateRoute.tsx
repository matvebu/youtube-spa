import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuth = Boolean(localStorage.getItem('TOKEN'));
  return isAuth ? <Outlet /> : <Navigate to='/auth/singup' replace />;
};

export default PrivateRoute;
