export interface Notification {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  read: boolean;
  created_at: string;
}