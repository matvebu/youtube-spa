import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-1 overflow-hidden'>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
