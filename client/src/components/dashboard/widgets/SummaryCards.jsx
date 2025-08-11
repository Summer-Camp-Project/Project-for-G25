import { Package, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useDashboard } from "../../../context/DashboardContext";

export function SummaryCards() {
  const { dashboardStats } = useDashboard();

  const summaryData = [
    {
      title: "Total Tours Offered",
      value: dashboardStats.totalTours?.toString() || "0",
      change: "+3 this month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Upcoming Bookings",
      value: dashboardStats.upcomingBookings?.toString() || "0",
      change: "+5 this week",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completed Tours",
      value: dashboardStats.completedTours?.toString() || "0",
      change: "+12 this month",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Requests",
      value: dashboardStats.pendingRequests?.toString() || "0",
      change: "3 new today",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <Card
          key={index}
          className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {item.title}
            </CardTitle>
            <div
              className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {item.value}
            </div>
            <p className="text-xs text-gray-600">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
