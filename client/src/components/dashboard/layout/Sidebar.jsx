import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Users, 
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "../../ui/button";
import { useDashboard } from "../../../context/DashboardContext";

export function Sidebar() {
  const { currentPage, setCurrentPage } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tour-packages', label: 'Tour Packages', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'customers', label: 'Customer Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // Logout functionality would be implemented here
    console.log('Logout clicked');
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-gray-800">Tour Organizer</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {!isCollapsed && item.label}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-4">
        <Button
          variant="ghost"
          className="w-1/5 justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
