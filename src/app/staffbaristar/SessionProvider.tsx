// components/SessionProvider.tsx
"use client";
import { StaffStoreSync } from "@/store/StaffStoreSync";
import React, { createContext, useContext } from "react";

const SessionContext = createContext<any>(null);

export const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return (
    <SessionContext.Provider value={session}>
      <StaffStoreSync session={session} />
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    console.warn("useSession must be used within a SessionProvider");
  }
  return context;
};
