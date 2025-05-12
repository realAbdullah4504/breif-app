import React, { useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  useNotifications,
  useNotificationSender,
} from "../hooks/useNotifications";

interface NotificationsProps {
  isDarkMode: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const { markAsRead } = useNotificationSender();
  return (
    <div className="relative">
      {/* <button onClick={() => createNotification(data)}>click</button> */}
      <button
        className={`p-1 rounded-full relative ${
          isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-400 hover:text-gray-500"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-3 w-80 rounded-md shadow-lg ${
              isDarkMode
                ? "bg-dark-secondary border border-dark-border"
                : "bg-white ring-1 ring-black ring-opacity-5"
            }`}
          >
            <div className="py-2 max-h-96 overflow-y-auto">
              <div
                className={`px-4 py-2 border-b ${
                  isDarkMode ? "border-dark-border" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Notifications
                </h3>
              </div>

              {notifications.length === 0 ? (
                <p
                  className={`px-4 py-3 text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 ${
                      !notification.read
                        ? isDarkMode
                          ? "bg-dark-hover"
                          : "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {format(
                        new Date(notification.created_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
