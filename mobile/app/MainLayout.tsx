import { Slot, useRouter, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import Navbar from "./components/NavBar";

export default function MainLayout() {
  console.log("MainLayout mounted")
  const { authState, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
        if (!isMounted || loading) return;

      console.log("authState in useEffect:", authState, "pathname:", pathname);

  if (authState?.authenticated === true && pathname === "/") {
    router.replace("/home");
  } else if (authState?.authenticated === false && pathname !== "/login") {
    console.log("Redirecting to login");
    router.replace("/login");
  }
  }, [authState, pathname, loading]);

  if (loading) return null;


   return (
    <>
      { pathname != "/login" && <Navbar />}
      <Slot />
    </>
  );
}