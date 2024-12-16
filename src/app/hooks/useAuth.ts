"use client";
import { AuthContextType } from "@/types/auth/auth";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
