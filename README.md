# Ethio360

## Overview
EthioHeritage360 is a digital platform dedicated to preserving and promoting Ethiopia's rich cultural heritage through innovative technology. The platform offers a virtual museum, interactive heritage maps, virtual and physical tour bookings, and an AI-powered assistant, accessible to visitors, tour organizers, museum admins, and super admins with role-based dashboards. This project combines modern web technologies to provide an immersive experience for exploring artifacts, heritage sites, and cultural events.

## Features
- **Virtual Museum**: Paginated, searchable artifact gallery with 3D/AR/VR experiences, detailed views, and filters (region, era, category, keyword) in multiple languages (English, Amharic, Afan Oromo).
- **Cultural Map**: Interactive map with heritage site pins, info popups, and dynamic data fetching.
- **Tours**: Listings for physical and virtual tours, managed by tour organizers with booking and livestream capabilities.
- **Authentication**: Single sign-in/sign-up page with options for Visitors or Tour Organizers, redirecting to respective dashboards.
- **Dashboards**:
  - **Visitor**: Explore feeds, view artifacts, book tours, and chat with the AI assistant.
  - **Tour Organizer**: Create tours, manage bookings, schedules, and livestream events.
  - **Museum Admin**: Manage museum profiles, upload/edit artifacts, and view analytics.
  - **Super Admin**: Oversee the ecosystem, approve accounts, and manage settings.
- **AI Assistant**: Floating chatbot for Q&A and recommendations, with optional history for logged-in users.
- **Multilingual Support**: English, Amharic, Afan Oromo, with optional Tigrinya.

## Tech Stack
- **Frontend**: React with Tailwind CSS for responsive, styled components.
- **Backend**: Node.js with Express for API services.
- **Database**: PostgreSQL for structured data storage.
- **Additional Tools**: Docker for containerization, Git for version control.

## Folder Structure
/ethioheritage360
├── /client           # React frontend with Tailwind CSS
├── /server           # Node.js/Express backend
├── /docs             # Project documentation
├── /tests            # Test suites
├── /scripts          # Build and deployment scripts
├── /.env             # Environment variables
├── /package.json     # Project dependencies
├── /README.md        # This file
└── /docker-compose.yml # Docker configuration
- Detailed structure is available in `/docs/user-flow.md`.

## Prerequisites
- Node.js (v18.x or later)
- PostgreSQL (v15.x or later)
- Docker (optional, for containerized setup)
- Git

## Installation

### 1. Clone the Repository

git clone https://github.com/your-username/ethioheritage360.git
cd ethioheritage360
### 2. Set Up Environment Variables

Create a .env file in the root directory.
Add the following variables (replace with your values):
textNODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/ethioheritage360
JWT_SECRET=your-secret-key
AI_API_KEY=your-ai-api-key


### 3. Install Dependencies

Frontend:
bashcd client
npm install

Backend:
bashcd ../server
npm install


### 4. Set Up Database

Create a PostgreSQL database named ethioheritage360.
Run the schema and seed scripts (to be added in /scripts/seed.js):
bashcd ../scripts
node seed.js


### 5. Start the Application

Start the backend:
bashcd ../server
npm start

Start the frontend:
bashcd ../client
npm start

Alternatively, use Docker:
bashdocker-compose up --build


### Development

Frontend: Edit components in /client/components, pages in /client/pages, and styles in /client/styles with Tailwind CSS.
Backend: Modify API routes in /server/routes, controllers in /server/controllers, and models in /server/models.
Testing: Run tests in /tests with your preferred framework (e.g., Jest).

### Contributing

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "description").
Push to the branch (git push origin feature-name).
Open a Pull Request.


Project Lead: 
Support: Visit the Help Center in the app or contact us at support@ethioheritage360.com.

