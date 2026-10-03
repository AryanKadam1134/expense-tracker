import { createRoot } from "react-dom/client";
import "./index.css";
import "./notification.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { NotificationsProvider } from "./context/notification/NotificationProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <NotificationsProvider>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </NotificationsProvider>,
);
