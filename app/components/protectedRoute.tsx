import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem(
      "oidc.user:https://dataspace4health.local/iam/realms/gaia-x:federated-catalogue"
    );
    if (!storedData) {
      router.push("/");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
