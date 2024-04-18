import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AuthProps {
  isAuth: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
  children?:ReactElement
}

const Auth = ({
  isAuth,
  children,
  adminOnly,
  admin,
  redirect = "/",
}: AuthProps) => {
  if (!isAuth) return <Navigate to={redirect} />;

  if (adminOnly && !admin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default Auth;
