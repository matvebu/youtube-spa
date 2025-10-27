import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import PrivateRoute from '../../../shared/api/routing/PrivateRoute';
import MainLayout from '../../../shared/ui/MainLayout';

const LoginPage = lazy(() => import('../../../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../../../pages/auth/RegisterPage'));
const FavoritesPage = lazy(() => import('../../../pages/favorites-page/FavoritesPage'));
const VideoFeed = lazy(() => import('../../../features/video-search/ui/VideoFeed'));
const VideoPage = lazy(() => import('../../../pages/video-page/VideoPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/signup' replace />,
  },
  {
    path: 'auth',
    children: [
      {
        path: 'signin',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <RegisterPage />,
      },
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
            element: <VideoFeed />,
          },
          {
            path: 'favorites',
            element: <FavoritesPage />,
          },
          {
            path: 'video/:videoId',
            element: <VideoPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/auth/signin' replace />,
  },
]);
