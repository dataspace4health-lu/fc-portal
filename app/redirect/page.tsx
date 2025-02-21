"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "../components/oidcIntegration";

export default function Redirect() {
  const router = useRouter();
  const basepath = usePathname().split("/").splice(0, usePathname().split("/").length - 1).join("/") || '';

  useEffect(() => {
    async function fetchToken() {
      await getToken();
      router.push(`${basepath}/participant`);
      router.refresh();
    }
    fetchToken();
  }, [router, basepath]);
  return <div>redirecting...</div>;
}
