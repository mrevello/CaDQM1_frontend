import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";

export const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/login",
}) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const isLoggedIn = token && token !== "undefined" && token !== "null";

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectPath} />;
};
