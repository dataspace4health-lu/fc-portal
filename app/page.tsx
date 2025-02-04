"use client";
import * as React from "react";
import { useEffect } from "react";
import { login } from "./components/oidcIntegration";

export default function Main() {
  useEffect(() => {
    login();
  });

  return <></>;
}
