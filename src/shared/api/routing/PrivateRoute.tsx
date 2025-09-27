import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuth = Boolean(localStorage.getItem('TOKEN'));
  console.log(isAuth);
  return isAuth ? <Outlet /> : <Navigate to='/auth/singup' replace />;
};

export default PrivateRoute;
