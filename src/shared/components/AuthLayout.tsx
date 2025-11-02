import Logo from '../../assets//logo.png';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto flex w-full flex-col sm:w-[350px] min-h-screen justify-center'>
      <img src={Logo} alt='logo' width={48} height={48} className='mb-6 self-center' />
      {children}
    </div>
  );
};

export default AuthLayout;
