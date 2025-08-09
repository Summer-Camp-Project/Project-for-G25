// import { Routes, Route, Navigate } from 'react-router-dom';
// import { DashboardProvider } from './context/DashboardContext';
// import { DashboardLayout } from './components/dashboard';
// import { CreateTourModal, BookingRequestsModal } from './components/dashboard';

// function AppRoutes() {
//   return (
//     <DashboardProvider>
//       <Routes>
//         {/* Tour Organizer Dashboard Route */}
//         <Route path="/tour-organizer/*" element={
//           <div className="h-screen">
//             <DashboardLayout />
//             <CreateTourModal />
//             <BookingRequestsModal />
//           </div>
//         } />
        
//         {/* Default redirect to tour organizer dashboard */}
//         <Route path="/" element={<Navigate to="/tour-organizer" replace />} />
        
//         {/* Catch all other routes and redirect to dashboard */}
//         <Route path="*" element={<Navigate to="/tour-organizer" replace />} />
//       </Routes>
//     </DashboardProvider>
//   );
// }

// export default AppRoutes;

