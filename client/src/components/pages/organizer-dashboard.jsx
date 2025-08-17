import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MainContent } from "../MainContent";
import { CreateTourModal } from "../modals/CreateTourModal";
import { BookingRequestsModal } from "../modals/BookingRequestsModal";
import { useDashboard } from "../../../context/DashboardContext";

export function DashboardLayout() {
  const { showCreateTourModal, showBookingRequestsModal } = useDashboard();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <MainContent />
        </div>
      </div>

      {/* Modals */}
      
      {showCreateTourModal && <CreateTourModal />}
      {showBookingRequestsModal && <BookingRequestsModal />}
    </div>
  );
}
