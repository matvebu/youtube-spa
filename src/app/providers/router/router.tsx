import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from '../../../shared/api/routing/PrivateRoute';
import AuthLayout from '../../../features/auth/ui/AuthLayout';
import { RegisterForm } from '../../../features/auth/ui/RegisterForm';
import { LoginForm } from '../../../features/auth/ui/LoginForm';

//TODO
// Lazy загрузка страниц
// const LoginPage = lazy(() => import(''));
// const RegisterPage = lazy(() => import(''));

// const UsersPage = lazy(() => import(''));
// const UserProfilePage = lazy(() => import('')); ...

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/signup' replace />,
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'signin', element: <LoginForm /> },
      { path: 'signup', element: <RegisterForm /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: 'users',
        //element: <MainLayout />,
        children: [
          { index: true, element: null },
          { path: ':userId/profile', element: /* UserProfilePage */ null },
          { path: ':userId/skills', element: /* UserSkillsPage */ null },
          { path: ':userId/languages', element: /* UserLanguagesPage */ null },
          { path: ':userId/cvs', element: /* UserCVsPage */ null },
        ],
      },
      {
        path: 'settings',
        // element: <MainLayout />,
        // children: [{ index: true, element: <SettingsPage /> }],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/auth/signin' replace />,
  },
]);
