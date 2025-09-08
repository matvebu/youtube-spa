import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='mx-auto flex w-full flex-col justify-center sm:w-[350px]'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
