"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useSocket } from "@/hooks/useSocket";
import type {
  SocketApplicationUpdatedPayload,
  SocketBatchUpdatedPayload,
  SocketNotificationPayload,
} from "@/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface SocketContextValue {
  isConnected: boolean;
  onApplicationUpdated: (
    handler: (payload: SocketApplicationUpdatedPayload) => void,
  ) => () => void;
  onApplicationBatchUpdated: (
    handler: (payload: SocketBatchUpdatedPayload) => void,
  ) => () => void;
  onNotificationNew: (
    handler: (payload: SocketNotificationPayload) => void,
  ) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();

  // Keep stable handler registries so consumers can subscribe / unsubscribe
  // without triggering re-renders on every socket event.
  const appUpdatedHandlers = useRef<
    Set<(p: SocketApplicationUpdatedPayload) => void>
  >(new Set());
  const batchUpdatedHandlers = useRef<
    Set<(p: SocketBatchUpdatedPayload) => void>
  >(new Set());
  const notifNewHandlers = useRef<
    Set<(p: SocketNotificationPayload) => void>
  >(new Set());

  // Attach socket event listeners once when the socket instance is available
  useEffect(() => {
    if (!socket) return;

    const handleAppUpdated = (payload: SocketApplicationUpdatedPayload) => {
      appUpdatedHandlers.current.forEach((h) => h(payload));
    };
    const handleBatchUpdated = (payload: SocketBatchUpdatedPayload) => {
      batchUpdatedHandlers.current.forEach((h) => h(payload));
    };
    const handleNotifNew = (payload: SocketNotificationPayload) => {
      notifNewHandlers.current.forEach((h) => h(payload));
    };

    socket.on("application:updated", handleAppUpdated);
    socket.on("application:batch-updated", handleBatchUpdated);
    socket.on("notification:new", handleNotifNew);

    // On reconnect, consumers re-sync via their own GET fetches (see Phase 5
    // acceptance criterion #5) — we just re-attach listeners here.
    return () => {
      socket.off("application:updated", handleAppUpdated);
      socket.off("application:batch-updated", handleBatchUpdated);
      socket.off("notification:new", handleNotifNew);
    };
  }, [socket]);

  const onApplicationUpdated = useCallback(
    (handler: (p: SocketApplicationUpdatedPayload) => void) => {
      appUpdatedHandlers.current.add(handler);
      return () => appUpdatedHandlers.current.delete(handler);
    },
    [],
  );

  const onApplicationBatchUpdated = useCallback(
    (handler: (p: SocketBatchUpdatedPayload) => void) => {
      batchUpdatedHandlers.current.add(handler);
      return () => batchUpdatedHandlers.current.delete(handler);
    },
    [],
  );

  const onNotificationNew = useCallback(
    (handler: (p: SocketNotificationPayload) => void) => {
      notifNewHandlers.current.add(handler);
      return () => notifNewHandlers.current.delete(handler);
    },
    [],
  );

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        onApplicationUpdated,
        onApplicationBatchUpdated,
        onNotificationNew,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useSocketContext(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used inside <SocketProvider>");
  }
  return ctx;
}
