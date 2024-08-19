import { useRoutes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Verify from "../pages/VerifyUser";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";
import Home from "../pages/Home";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify", element: <Verify /> },
    { path: "/forgot_password", element: <ForgotPassword /> },
    { path: "/change_password", element: <ChangePassword /> },
    { path: "/", element: <Home /> },
  ]);
  return routes;
};

export default AppRoutes;
