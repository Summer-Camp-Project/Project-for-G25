import { DashboardProvider } from "./context/DashboardContext";
import { DashboardLayout } from "./components/dashboard/layout/DashboardLayout";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <DashboardProvider>
      <DashboardLayout />
      <Toaster position="top-right" />
    </DashboardProvider>
  );
}