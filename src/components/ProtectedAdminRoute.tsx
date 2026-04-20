import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-muted/50 p-8 text-foreground">Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;