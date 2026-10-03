import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { NotificationsProvider } from "./context/notification/NotificationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <NotificationsProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </NotificationsProvider>,
);
