# Tour Organizer Dashboard Components

This directory contains all the components for the Tour Organizer Dashboard, organized in a professional and scalable structure.

## Directory Structure

```
dashboard/
├── layout/                 # Layout components
│   ├── DashboardLayout.jsx # Main dashboard layout wrapper
│   ├── Sidebar.jsx        # Navigation sidebar
│   └── TopBar.jsx         # Top navigation bar
├── widgets/               # Dashboard widgets and cards
│   ├── DashboardMain.jsx  # Main dashboard content
│   ├── SummaryCards.jsx   # Statistics cards
│   ├── QuickActions.jsx   # Quick action buttons
│   ├── RecentActivities.jsx # Recent activities feed
│   └── CalendarView.jsx   # Calendar widget
├── modals/               # Modal components
│   ├── CreateTourModal.jsx # Create tour package modal
│   └── BookingRequestsModal.jsx # Booking requests modal
├── MainContent.jsx       # Content router component
├── index.js             # Export all components
└── README.md           # This file
```

## Component Categories

### Layout Components (`layout/`)
- **DashboardLayout**: Main layout wrapper that combines sidebar and content area
- **Sidebar**: Navigation sidebar with collapsible menu
- **TopBar**: Top navigation bar with search and user menu

### Widget Components (`widgets/`)
- **DashboardMain**: Main dashboard content with welcome section and grid layout
- **SummaryCards**: Statistics cards showing key metrics
- **QuickActions**: Quick action buttons for common tasks
- **RecentActivities**: Feed of recent activities and notifications
- **CalendarView**: Calendar widget showing upcoming tours

### Modal Components (`modals/`)
- **CreateTourModal**: Modal for creating new tour packages
- **BookingRequestsModal**: Modal for managing pending booking requests

### Router Component
- **MainContent**: Content router that renders different pages based on current state

## Features

### Responsive Design
- All components are fully responsive using Tailwind CSS
- Mobile-first approach with breakpoint-specific layouts
- Collapsible sidebar for smaller screens

### State Management
- Uses React Context (`DashboardContext`) for global state
- Local state for component-specific functionality
- Proper state updates and error handling

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

### UI/UX
- Modern, clean design with emerald color scheme
- Consistent spacing and typography
- Smooth transitions and hover effects
- Loading states and error handling
- Toast notifications for user feedback

## Usage

```jsx
import { DashboardLayout } from './components/dashboard';

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
}
```

## Dependencies

- **React**: Core framework
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **Shadcn UI**: UI components
- **Sonner**: Toast notifications

## Styling

All components use Tailwind CSS classes with a consistent design system:
- **Colors**: Emerald primary, stone grays, semantic colors
- **Spacing**: Consistent 4px grid system
- **Typography**: Inter font family with proper hierarchy
- **Shadows**: Subtle shadows for depth and elevation
- **Borders**: Consistent border radius and colors

## Performance

- Lazy loading for modal components
- Optimized re-renders with proper state management
- Efficient filtering and sorting algorithms
- Minimal bundle size with tree shaking

## Future Enhancements

- Add more widget types (charts, analytics)
- Implement real-time updates
- Add drag-and-drop functionality
- Enhanced mobile experience
- Dark mode support
