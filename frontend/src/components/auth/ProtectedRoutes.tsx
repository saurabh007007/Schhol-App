import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: string; // default: recruiter
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole = "student",
}) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // If no user → redirect to login/home
    if (!user) {
      navigate("/");
      return;
    }

    // If role mismatch → redirect
    if (allowedRole && user.role !== allowedRole) {
      navigate("/");
      return;
    }
  }, [user, allowedRole, navigate]);

  // When user exists & role matches → render children
  return <>{children}</>;
};

export default ProtectedRoute;
