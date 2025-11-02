import AuthLayout from '../../shared/components/AuthLayout';
import LoginForm from '../../features/auth/login/ui/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
