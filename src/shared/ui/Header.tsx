import { LogOut, SunMoon } from 'lucide-react';
import { useTheme } from '../../app/providers/theme/useTheme';
import logout from '../utils/logout';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets//logo.png';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('search');

  const handleTabs = (val: string) => {
    setValue(val);
    navigate(`/main/${val}`);
  };
  const themeContext = useTheme();
  const themeToggler = () =>
    themeContext.theme === 'dark' ? themeContext.setTheme('light') : themeContext.setTheme('dark');
  const logoutHandler = () => {
    logout();
    navigate('auth/signin');
  };
  return (
    <header className='flex h-(--header-height) shrink-0 items-center border-b justify-between py-2'>
      <div className='flex gap-2 items-center'>
        <img src={Logo} alt='logo' />
        <Tabs defaultValue={value} onValueChange={handleTabs}>
          <TabsList className='bg-transparent'>
            <TabsTrigger className='text-base h-20' value='search'>
              Search
            </TabsTrigger>
            <TabsTrigger className='text-base h-20' value='favorites'>
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className='flex gap-2 items-center'>
        <SunMoon onClick={themeToggler} />
        <Button size={'default'} onClick={logoutHandler}>
          <LogOut />
          Log
        </Button>
      </div>
    </header>
  );
};

export default Header;
