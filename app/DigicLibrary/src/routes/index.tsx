import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import EmployeesPage from '../pages/EmployeesPage';
import BooksPage from '../pages/BooksPage';
import RentalsPage from '../pages/RentalsPage';
import HistoryPage from '../pages/HistoryPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/employees',
    element: <EmployeesPage />,
  },
  {
    path: '/books',
    element: <BooksPage />,
  },
  {
    path: '/rentals',
    element: <RentalsPage />,
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;