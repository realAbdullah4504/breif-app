import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NotificationService } from "../services/notificationService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Notification } from "../types/notificationTypes";
import { queryClient } from "../lib/queryClient";
const notificationService = new NotificationService();

export const useNotificationSender = () => {
  const { currentUser } = useAuth();

  const createNotification = useMutation({
    mutationFn: (data: {
      sender_id: string;
      receiver_id: string;
      message: string;
    }) => {
      return notificationService.createNotification(
        data.sender_id,
        data.receiver_id,
        data.message
      );
    },
    onSuccess: () => {
      console.log("Notification sent successfully");
    },
    onError: (error) => {
      console.error("Error sending notification:", error);
    },
  });
  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => {
      return notificationService.markAsRead(notificationId);
    },
    onSuccess: () => {
      // Refetch notifications or update local state if needed
      queryClient.invalidateQueries({
        queryKey: ["notifications", currentUser?.id],
      });
      console.log("Notification marked as read successfully");
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
    },
  });
  return {
    createNotification: createNotification.mutate,
    markAsRead: markAsRead.mutate,
    isLoading: createNotification.isPending,
  };
};

export const useNotifications = () => {
  const { currentUser } = useAuth();
  //   console.log("current",currentUser)

  const getNotifications = useQuery({
    queryKey: ["notifications", currentUser?.id],
    queryFn: () => {
      return notificationService.getNotifications(currentUser?.id || "");
    },
    enabled: !!currentUser?.id,
  });

  const unreadCount =
    (getNotifications?.data?.data &&
      getNotifications?.data?.data.filter(
        (notification: Notification) => !notification.read
      ).length) ||
    0;

  useEffect(() => {
    if (!currentUser?.id) return;
    const unsubscribe = notificationService.subscribe(
      currentUser?.id,
      (newNotification: Notification) => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", currentUser?.id],
        });
      }
    );
    return () => {
      unsubscribe();
    };
  }, [currentUser?.id]);

  return {
    notifications: getNotifications.data?.data || [],
    unreadCount: unreadCount,
    isLoading: getNotifications.isLoading,
  };
};
