import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string; // default redirect if user is logged in
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/dashboard",
}) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, redirectTo, navigate]);

  return <>{!user && children}</>;
};

export default PublicRoute;
