import { LogOut, SunMoon, Menu } from 'lucide-react';
import { useTheme } from '../../app/providers/theme/useTheme';
import logout from '../utils/logout';
import { Button } from '../../components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets//logo.png';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../utils/useMediaQuery';
import { Sheet, SheetContent } from '../../components/ui/sheet';

const Header = () => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('search');

  const [open, setOpen] = useState(false);
  const openHandler = () => {
    setOpen(true);
  };
  const handleTabs = (val: string) => {
    setValue(val);
    navigate(`/main/${val}`);
  };

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    setValue(path === 'video' ? 'search' : path);
  }, [location.pathname]);
  const themeContext = useTheme();
  const themeToggler = () =>
    themeContext.theme === 'dark' ? themeContext.setTheme('light') : themeContext.setTheme('dark');
  const logoutHandler = () => {
    logout();
    navigate('auth/signin');
  };
  return (
    <header className='flex h-(--header-height) shrink-0 items-center border-b justify-between py-2 px-8'>
      {!isMobile && (
        <>
          <div className='flex gap-2 items-center'>
            <img src={Logo} alt='logo' />
            <Tabs value={value} onValueChange={handleTabs}>
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
          <div className='flex gap-3 items-center'>
            <SunMoon onClick={themeToggler} />
            <Button size={'default'} onClick={logoutHandler}>
              <LogOut />
              Log
            </Button>
          </div>
        </>
      )}
      {isMobile && (
        <>
          <div>
            <img src={Logo} alt='logo' />
          </div>
          <Menu onClick={openHandler} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side='right' className='w-full flex flex-col gap-3 max-w-xs'>
              <div className='p-4 pb-0 flex justify-center'>
                <Tabs value={value} onValueChange={handleTabs}>
                  <TabsList className='bg-transparent flex flex-col h-full'>
                    <TabsTrigger className='text-base h-20' value='search'>
                      Search
                    </TabsTrigger>
                    <TabsTrigger className='text-base h-20' value='favorites'>
                      Favorites
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className='flex flex-col gap-4 items-center'>
                <SunMoon onClick={themeToggler} />
                <Button size={'default'} onClick={logoutHandler}>
                  <LogOut />
                  Log
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </header>
  );
};

export default Header;
