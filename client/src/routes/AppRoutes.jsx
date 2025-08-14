import { Routes, Route, Navigate } from "react-router-dom";
import UserTourPage from "../components/pages/UserTourPage";
import { DashboardLayout } from "../components/dashboard/layout/DashboardLayout";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import ContactUs from "../pages/ContactUs"; // Fixed import

export default function AppRoutes({ darkMode, toggleDarkMode }) {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/auth"
        element={<Auth darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/contact"
        element={
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <ContactUs />
            <Footer />
          </>
        }
      />
            <Route
        path="/organizer/*"
        element={
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <DashboardLayout />
            <Footer />
          </>
        }
      />
            <Route
        path="/customer/*"
        element={
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <UserTourPage />
            <Footer />
          </>
        }
      />

      {/* Organizer & Customer dashboard routes */}
      {/* <Route path="/organizer/*" element={<DashboardLayout />} /> */}
      {/* <Route path="/customer/*" element={<UserTourPage />} /> */}

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/organizer" replace />} />
    </Routes>
  );
}
