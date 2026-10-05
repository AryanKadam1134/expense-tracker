import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import LoadingScreen from "./components/common/LoadingScreen";

import DashboardLayout from "./layouts/DashboardLayout";

import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import ResetPassword from "./pages/authentication/ResetPassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";

import Dashboard from "./pages/private/Dashboard";
import AccountsPage from "./pages/private/accounts/AccountsPage";
import AccountFormPage from "./pages/private/accounts/AccountFormPage";

import { useAuth } from "./context/auth";

const PublicRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  // ❌ If logged in → redirect to dashboard
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const ProtectedRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 🔓 Public Route (only if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔐 Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/accounts">
              <Route index element={<AccountsPage />} />
              <Route path="add" element={<AccountFormPage />} />
              <Route path=":accountId/edit" element={<AccountFormPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
