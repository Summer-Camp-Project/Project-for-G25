import { Bell, ChevronDown, Search, Settings, User, LogOut } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useDashboard } from "../../../context/DashboardContext";
import { toast } from "sonner";

export function TopBar() {
  const {
    currentUser,
    notifications,
    searchQuery,
    setSearchQuery,
    markNotificationAsRead,
    currentPage,
  } = useDashboard();

  const getPageTitle = (page) => {
    switch (page) {
      case "dashboard":
        return "Dashboard";
      case "tour-packages":
        return "Tour Packages";
      case "tour-bookings":
        return "Tour Bookings";
      case "schedules":
        return "Schedules";
      case "customer-messages":
        return "Customer Messages";
      case "profile-settings":
        return "Profile & Settings";
      default:
        return "Dashboard";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleProfileSettings = () => {
    toast.info("Profile settings page would open here");
  };

  const handleBilling = () => {
    toast.info("Billing page would open here");
  };

  const handleTeamSettings = () => {
    toast.info("Team settings page would open here");
  };

  const handleSignOut = () => {
    toast.success("Signed out successfully");
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between">
      {/* Page Title and Search */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-stone-800">{getPageTitle(currentPage)}</h1>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            placeholder="Search tours, bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80 bg-stone-50 border-stone-200 focus:border-emerald-400 focus:ring-emerald-300"
          />
        </div>
      </div>

      {/* Right Side - Notifications and User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-stone-600" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-2 -right-3 w-5 h-5 text-xs bg-red-500 hover:bg-red-500">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Notifications</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    notifications.forEach((n) => {
                      if (!n.read) markNotificationAsRead(n.id);
                    });
                  }}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-stone-600 text-center py-4">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-stone-50 ${
                        !notification.read ? "bg-blue-50 border-blue-200" : "border-stone-200"
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800">{notification.title}</p>
                          <p className="text-xs text-stone-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-stone-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-stone-100">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-stone-800">{currentUser.name}</p>
                <p className="text-xs text-stone-600 capitalize">{currentUser.role.replace("_", " ")}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileSettings}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBilling}>
              <Settings className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTeamSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Team Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
