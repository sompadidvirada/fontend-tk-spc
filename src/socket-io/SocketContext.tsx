"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStaffStore } from "@/store/staff"; // Import your store

const SocketContext = createContext<WebSocket | null>(null);

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    if (!staff?.id) return;

    let heartbeatInterval: NodeJS.Timeout;
    
    // Wrap connection in a function so we can call it again if it fails
    const connect = () => {
      const wsUrl = `wss://api.treekoff.store/ws?userId=${staff.id}`;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("✅ [Global WS] Connected to Go Backend");
        
        // Start heartbeat when opened
        heartbeatInterval = setInterval(() => {
          if (newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      newSocket.onclose = (event) => {
        console.log("🚫 [Global WS] Disconnected");
        clearInterval(heartbeatInterval);
        
        // Auto-reconnect logic: try again in 3 seconds if not a normal logout
        if (event.wasClean === false) {
           setTimeout(connect, 3000);
        }
      };

      setSocket(newSocket);
    };

    connect();

    return () => {
      clearInterval(heartbeatInterval);
      // We don't want the auto-reconnect to fire when we manually logout
      setSocket((prev) => {
        prev?.close();
        return null;
      });
    };
  }, [staff?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);