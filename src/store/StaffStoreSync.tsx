// components/StaffStoreSync.tsx
"use client";

import { useEffect } from "react";
import { useStaffStore } from "./staff";

export const StaffStoreSync = ({ session }: { session: any }) => {
  const setStaff = useStaffStore((state) => state.setStaff);

  useEffect(() => {
    if (session?.user) {
      setStaff({
        id: session.user.id,
        phonenumber: session.user.phonenumber || "",
        role: session.user.role || "",
        birthdate: session.user.birthdate || "",
        image: session.user.image || "",
        branchId: session.user.branchId || null,
      });
    }
  }, [session, setStaff]);

  return null; // This component renders nothing, it just syncs state
};