import { fetchEventSource } from "@microsoft/fetch-event-source";
import { create } from "zustand";
import { jwtDecoder } from "../pages/Auth/Auth_utils";

type NotificationStoreType = {
  notifications: string[];
  getNotifications: (
    token: string | null,
    controller: AbortController
  ) => Promise<void>;
  isRead: boolean;
  markAsRead: () => void;
};

export const useNotificationStore = create<NotificationStoreType>((set) => ({
  notifications: [],
  isRead: true,

  getNotifications: async (token, controller) => {
    const decodedToken = jwtDecoder(token);
    const userId = decodedToken?.userId;

    fetchEventSource(`${import.meta.env.VITE_BACKEND_API}/notifications`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onopen: async () => {
        console.log("SSE connection established.");
      },

      onmessage(msg) {
        const data = JSON.parse(msg.data);

        if (data.author === userId) {
          const formattedLiker = `Someone just liked your review`;
          set((prev) => ({
            notifications: [formattedLiker, ...prev.notifications],
            isRead: false,
          }));
        }
      },

      onerror(err) {
        console.error("Error with SSE connection:", err);
        controller.abort();
      },
    });
  },
  markAsRead: () => set({ isRead: true }),
}));
