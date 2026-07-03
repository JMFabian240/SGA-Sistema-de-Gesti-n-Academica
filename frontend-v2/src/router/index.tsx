import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { AlumnosPage } from '../modules/alumnos/pages/AlumnosPage';
import { TutoresPage } from '../modules/tutores/pages/TutoresPage';


export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> }
    ]
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'alumnos', element: <AlumnosPage /> },
      { path: 'tutores', element: <TutoresPage /> },
      // Aquí se irán registrando las rutas de cada módulo (modules/pagos/...)
    ],
  },
]);
