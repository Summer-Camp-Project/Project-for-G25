import { DashboardProvider } from "./context/DashboardContext";
import { Sidebar } from "./components/dashboard/layout/Sidebar";
import { TopBar } from "./components/dashboard/layout/TopBar";
import { MainContent } from "./components/dashboard/MainContent";
import { CreateTourModal } from "./components/dashboard/modals/CreateTourModal";
import { BookingRequestsModal } from "./components/dashboard/modals/BookingRequestsModal";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-stone-50 flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <TopBar />
          
          {/* Page Content */}
          <MainContent />
        </div>
        
        {/* Modals */}
        <CreateTourModal />
        <BookingRequestsModal />
        
        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </DashboardProvider>
  );
}