import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Notification } from "../types/notificationTypes";

export class NotificationService {
  private channel: RealtimeChannel | null = null;

  async getNotifications(
    userId: string
  ): Promise<{ data: Notification[] | null; error: null }> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      console.log("Notifications fetched:", data);
    }
    return { data: data || [], error: null };
  }

  async createNotification(
    senderId: string,
    receiverId: string,
    message: string
  ) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        { sender_id: senderId, recipient_id: receiverId, message: message },
      ]);
    if (error) {
      console.error("Error creating notification:", error);
    } else {
      console.log("Notification created:", data);
    }
  }

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      console.log("Notification marked as read:", data);
    }
  }
  subscribe(currentUserId: string,onNotificationReceived: (notification: Notification) => void) {
    this.channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.log("noted", payload);
          onNotificationReceived(payload.new as Notification);
        }
      )
      .subscribe();
    return () => {
      if (this.channel) {
        supabase.removeChannel(this.channel);
      }
    };
  }
}
