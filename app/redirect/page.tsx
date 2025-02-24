"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "../components/oidcIntegration";

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      await getToken();
      router.push(`/participant`);
      router.refresh();
    }
    fetchToken();
  }, [router]);
  return <div>redirecting...</div>;
}
