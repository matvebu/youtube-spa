import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from '../../../shared/api/routing/PrivateRoute';
import AuthLayout from '../../../shared/ui/AuthLayout';
import MainLayout from '../../../shared/ui/MainLayout';
import { LoginForm } from '../../../features/auth/login/ui/LoginForm';
import { RegisterForm } from '../../../features/auth/register/ui/RegisterForm';
import { FavoritesPage } from '../../../pages/favorites-page/FavoritesPage';
import VideoFeedPage from '../../../pages/video-feed-page/VideoFeedPage';
import { VideoPage } from '../../../pages/video-page/VideoPage';

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
        path: 'main',
        element: <MainLayout />,
        children: [
          {
            path: 'search',
            element: <VideoFeedPage />,
          },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'video/:videoId', element: <VideoPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/auth/signin' replace />,
  },
]);
