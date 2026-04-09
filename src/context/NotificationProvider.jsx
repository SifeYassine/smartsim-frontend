import { createContext, useContext, useState, useCallback } from "react";
import { NotificationToast } from "@/components/NotificationToast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "info") => {
    const id = Date.now();

    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Render notifications - centered at top */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {notifications.map((n) => (
          <NotificationToast key={n.id} {...n} onClose={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
