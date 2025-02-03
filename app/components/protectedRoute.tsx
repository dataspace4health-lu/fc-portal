import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { login } from "./oidcIntegration";

const ProtectedRoute = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const storedData = localStorage.getItem(
        `oidc.user:${process.env.NEXT_PUBLIC_OIDC_AUTHORITY}:${process.env.NEXT_PUBLIC_OIDC_CLIENT_ID}`
      );
      if (!storedData) {
        login();
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Add a displayName for debugging
  WithAuth.displayName = `ProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuth;
};

export default ProtectedRoute;
