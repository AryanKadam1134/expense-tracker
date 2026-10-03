import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import LoadingScreen from "./components/common/LoadingScreen";
import { useAuth } from "./context/auth";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import Dashboard from "./pages/private/Dashboard";

function PublicRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  // ❌ If logged in → redirect to details
  return user ? <Navigate to="/details" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/details" />} />

        {/* 🔓 Public Route (only if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔐 Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/details" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
