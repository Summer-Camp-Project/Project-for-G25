import { useDashboard } from "../../context/DashboardContext";
import { DashboardMain } from "./widgets/DashboardMain";
import { TourPackagesPage } from "../pages/TourPackagesPage";
import { TourBookingsPage } from "../pages/TourBookingsPage";
import { SchedulesPage } from "../pages/SchedulesPage";
import { CustomerMessagesPage } from "../pages/CustomerMessagesPage";
import { ProfileSettingsPage } from "../pages/ProfileSettingsPage";
import { CustomersPage } from "../pages/CustomersPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import EducationalTourManager from "../education/EducationalTourManager";
export function MainContent() {
  const { currentPage } = useDashboard();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardMain />;
      case "tour-packages":
        return <TourPackagesPage />;
      case "educational-tours":
        return <EducationalTourManager />;
      case "tour-bookings":
        return <TourBookingsPage />;
      case "schedules":
        return <SchedulesPage />;
      case "customersmessages":
        return <CustomerMessagesPage />;
      case "profile-settings":
        return <ProfileSettingsPage />;
      case "customers":
        return <CustomersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <DashboardMain />;
    }
  };

  return <div className="h-full">{renderPage()}</div>;
}
