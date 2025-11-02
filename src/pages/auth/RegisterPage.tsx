import RegisterForm from '../../features/auth/register/ui/RegisterForm';
import AuthLayout from '../../shared/components/AuthLayout';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
