import { SummaryCards } from "./SummaryCards";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { CalendarView } from "./CalendarView";

export function DashboardMain() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <div className="bg-yellow-900 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, Abebe!</h2>
        <p className="text-yellow-100">
          You have 3 new booking requests and 2 upcoming tours this week.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activities and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <CalendarView />
      </div>
    </div>
  );
}
