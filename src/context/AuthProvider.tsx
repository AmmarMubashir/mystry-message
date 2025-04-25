"use client";

import { SessionProvider } from "next-auth/react";
import { ReactFormState } from "react-dom/client";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
