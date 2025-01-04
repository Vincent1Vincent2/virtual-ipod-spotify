"use client";

import { AuthProviderProps } from "@/types/auth/auth";
import { Suspense } from "react";
import { AuthProviderContent } from "./AuthProviderContent";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  );
};
