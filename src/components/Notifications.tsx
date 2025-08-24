import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  useNotifications,
  useNotificationSender,
} from "../hooks/useNotifications";

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const { markAsRead } = useNotificationSender();

  return (
    <div className="w-full">
      {notifications.length === 0 ? (
        <div className="text-center py-4">
          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                !notification.read 
                  ? "bg-primary-50 border-primary-200 hover:bg-primary-100" 
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-medium line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))}
          {notifications.length > 5 && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                +{notifications.length - 5} more notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;