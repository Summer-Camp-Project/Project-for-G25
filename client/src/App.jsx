import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardProvider } from "./context/DashboardContext";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Users, LayoutDashboard } from "lucide-react";
import "./styles/global.css";
import AppRoutes from "./routes/AppRoutes";

function ViewToggle() {
  const location = useLocation();

  return (
    <div className="fixed top-16 right-4 z-50 flex gap-2 animate-fadeInDown">
      <Link to="/organizer">
        <Button
          variant={location.pathname === "/organizer" ? "default" : "outline"}
          className={`${
            location.pathname === "/organizer"
              ? "bg-green-600 hover:bg-green-700"
              : "border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Organizer
        </Button>
      </Link>
      <Link to="/customer">
        <Button
          variant={location.pathname === "/customer" ? "default" : "outline"}
          className={`${
            location.pathname === "/customer"
              ? "bg-green-600 hover:bg-green-700"
              : "border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Customer
        </Button>
      </Link>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
      <DashboardProvider>
        <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
          <ViewToggle />
          <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Toaster position="top-right" />
        </div>
      </DashboardProvider>
  );
}
