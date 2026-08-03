"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketContext } from "@/providers/SocketProvider";
import { listNotifications } from "@/actions/notifications";
import type { SocketNotificationPayload } from "@/types";

export interface AppNotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // Derived display date — ISO string or "Just now"
  date: string;
}

function toDisplayItem(raw: {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}): AppNotificationItem {
  return {
    ...raw,
    date: raw.createdAt,
  };
}

export interface UseNotificationReturn {
  notifications: AppNotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  prependNotification: (n: AppNotificationItem) => void;
  markAllRead: () => void;
}

export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { onNotificationNew } = useSocketContext();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await listNotifications({ limit: 50 });
    if (result.success) {
      setNotifications((result.data ?? []).map(toDisplayItem));
    } else {
      setError(result.message ?? "Failed to load notifications");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  // Live socket updates — prepend incoming notifications
  useEffect(() => {
    const unsubscribe = onNotificationNew((payload: SocketNotificationPayload) => {
      setNotifications((prev) => {
        // Deduplicate: don't insert if we already have this id
        if (prev.some((n) => n.id === payload.notification.id)) return prev;
        return [toDisplayItem(payload.notification), ...prev];
      });
    });
    return unsubscribe;
  }, [onNotificationNew]);

  const prependNotification = useCallback((n: AppNotificationItem) => {
    setNotifications((prev) => {
      if (prev.some((existing) => existing.id === n.id)) return prev;
      return [n, ...prev];
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    prependNotification,
    markAllRead,
  };
}
