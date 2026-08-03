"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { logger } from "@/lib/logger";

export type AppSocket = Socket;

export interface UseSocketReturn {
  socket: AppSocket | null;
  isConnected: boolean;
}

export function useSocket(): UseSocketReturn {
  const { data: session, status } = useSession();
  const socketRef = useRef<AppSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Expose the socket instance through state so it's safe to read during render
  const [socketInstance, setSocketInstance] = useState<AppSocket | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setIsConnected(false);
      }
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    const socket = io({
      path: "/socket.io",
      auth: { token: session.token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (err) => {
      logger.warn({ err: err.message }, "Socket connection error");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
      setIsConnected(false);
    };
  }, [status, session?.token]);

  return { socket: socketInstance, isConnected };
}
