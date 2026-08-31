// useEffect subscribes to browser events, while useState stores the latest connection status.
import { useEffect, useState } from "react";

// This custom Hook exposes whether the browser currently believes it is online.
export default function useOnlineStatus() {
  // The lazy initializer reads navigator only during the first component render.
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  // This effect connects React state to the browser's online and offline events.
  useEffect(() => {
    // This named handler records that a connection became available.
    function handleOnline() {
      // React re-renders any component using this Hook with isOnline equal to true.
      setIsOnline(true);
      // The console message makes recovery visible during testing.
      console.log("[network] Browser is online");
    }

    // This named handler records that the browser lost its connection.
    function handleOffline() {
      // React re-renders any component using this Hook with isOnline equal to false.
      setIsOnline(false);
      // The console message helps learners test the optional offline feature.
      console.log("[network] Browser is offline");
    }

    // The browser calls handleOnline whenever it fires an online event.
    window.addEventListener("online", handleOnline);
    // The browser calls handleOffline whenever it fires an offline event.
    window.addEventListener("offline", handleOffline);
    // The cleanup function removes both listeners when the component disappears.
    return () => {
      // Removing the first listener prevents duplicate callbacks and memory leaks.
      window.removeEventListener("online", handleOnline);
      // Removing the second listener completes the cleanup.
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // The current boolean is returned directly because the Hook has one responsibility.
  return isOnline;
}
