"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "../components/oidcIntegration";

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      await getToken();
    }
    fetchToken();
    router.push("/participant");
    router.refresh();
  }, []);
  return <div>redirecting...</div>;
}
