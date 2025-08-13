import { DashboardProvider } from "./context/DashboardContext";
import { DashboardLayout } from "./components/dashboard/layout/DashboardLayout";
import UserTourPage  from "./components/pages/UserTourPage";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Users, LayoutDashboard } from "lucide-react";

import { useState } from "react";

export default function App() {
    const [viewMode, setViewMode] = useState("organizer"); 
  return (
    <DashboardProvider>
      {/* View Toggle */}
        <div className="fixed top-4 right-64 z-50 flex gap-2 animate-fadeInDown">
          <Button
            variant={viewMode === 'organizer' ? 'default' : 'outline'}
            onClick={() => setViewMode('organizer')}
            className={`${
              viewMode === 'organizer' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'border-green-300 text-green-700 hover:bg-green-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Organizer
          </Button>
          <Button
            variant={viewMode === 'user' ? 'default' : 'outline'}
            onClick={() => setViewMode('user')}
            className={`${
              viewMode === 'user' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'border-green-300 text-green-700 hover:bg-green-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Customer
          </Button>
        </div>

        {/* Content */}
        {viewMode === 'organizer' ? (
           <DashboardLayout />
        ) : (
          <UserTourPage />
        )}
      <Toaster position="top-right" />
    </DashboardProvider>
  );
}