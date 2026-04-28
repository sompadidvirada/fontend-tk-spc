"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStaffStore } from "@/store/staff"; // Import your store

const SocketContext = createContext<WebSocket | null>(null);

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    // Only connect if we have a staff ID
    if (!staff?.id) return;

    // Use ws:// for local development, wss:// for production
    const wsUrl = `ws://api.treekoff.store/ws?userId=${staff.id}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("✅ [Global WS] Connected to Go Backend");
    };

    newSocket.onclose = () => {
      console.log("🚫 [Global WS] Disconnected");
    };

    setSocket(newSocket);

    // Cleanup: Close the pipe when the app unmounts or user logs out
    return () => {
      newSocket.close();
    };
  }, [staff?.id]); // Reconnect only if the staff ID changes

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);