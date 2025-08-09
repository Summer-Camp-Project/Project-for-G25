import { useDashboard } from "../../context/DashboardContext";
import { DashboardMain } from "./widgets/DashboardMain";
import { TourPackagesPage } from "../pages/TourPackagesPage";
import { TourBookingsPage } from "../pages/TourBookingsPage";
import { SchedulesPage } from "../pages/SchedulesPage";
import { CustomerMessagesPage } from "../pages/CustomerMessagesPage";
import { ProfileSettingsPage } from "../pages/ProfileSettingsPage";

export function MainContent() {
  const { currentPage } = useDashboard();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardMain />;
      case "tour-packages":
        return <TourPackagesPage />;
      case "bookings":
        return <TourBookingsPage />;
      case "schedules":
        return <SchedulesPage />;
      case "customers":
        return <CustomerMessagesPage />;
      case "profile":
        return <ProfileSettingsPage />;
      default:
        return <DashboardMain />;
    }
  };

  return <div className="h-full">{renderPage()}</div>;
}
