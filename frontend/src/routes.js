import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import PrivateRoute from './PrivateRoute';
import LoginPage from "./pages/LoginPage";
import CreateGame from "./pages/CreateGame";
import DeletePage from "./pages/DeletePage";
import BattleField from "./pages/BattleField";

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
    children: [
      {
        index: '/',
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'create', element: <CreateGame /> },
          { path: 'delete', element: <DeletePage /> },
          { path: 'battle_field', element: <BattleField /> }
        ]
      },
      
    ]
  },
]);

export default router;