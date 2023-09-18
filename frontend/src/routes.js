import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import PrivateRoute from './PrivateRoute';
import LoginPage from "./pages/LoginPage";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children:[
      { index: '/', 
      element:<Layout />,
      children: [{ index: true, element: <HomePage /> }]
    },
    ]
  },
]);

export default router;