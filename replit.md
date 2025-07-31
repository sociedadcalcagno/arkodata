# ArkoData - AI Assistant Platform

## Project Overview
ArkoData is a technology solutions company's website featuring an AI assistant called "ArkoAsistente". The platform allows visitors to interact with an AI chatbot, submit contact forms, and enables administrators to manage leads through a dashboard.

## Recent Changes
- **2024-12-19**: Successfully migrated from Bolt to Replit environment
- Implemented proper client/server separation with Express backend and React frontend
- Created data models for leads and chat sessions with PostgreSQL database
- Established API endpoints with Zod validation
- Migrated to TanStack Query for data fetching
- Implemented proper TypeScript types and error handling
- Added PostgreSQL database with Drizzle ORM for persistent data storage

## Project Architecture

### Backend (Express + TypeScript)
- **Database**: PostgreSQL with Drizzle ORM for persistent storage
- **Storage**: DatabaseStorage class implementing IStorage interface
- **API Routes**: RESTful endpoints for leads and chat sessions with validation
- **Schema**: Shared TypeScript types and Zod schemas for data validation

### Frontend (React + TypeScript)
- **Structure**: Page-based routing with wouter
- **State Management**: TanStack Query for server state, React hooks for local state
- **Components**: Modular components for AI chat, admin dashboard, forms
- **Styling**: Tailwind CSS with custom ArkoData branding

### Key Features
1. **ArkoAsistente AI Chat**: Interactive GPT-4 powered chatbot with automatic lead capture
2. **Contact Form**: Lead capture with API integration
3. **Admin Dashboard**: Lead management with authentication and chat session tracking
4. **Automatic Lead Detection**: Smart capture of contact info from chat conversations
5. **Responsive Design**: Mobile-first approach with modern UI

### Security Features
- Basic admin authentication with session management
- Input validation on both client and server
- Proper error handling and sanitization
- Client/server separation following security best practices

## File Structure
```
client/src/
├── components/         # Reusable React components
├── pages/             # Page components
├── lib/               # API utilities and query client
├── hooks/             # Custom React hooks
└── main.tsx          # App entry point

server/
├── routes.ts         # API endpoints
├── storage.ts        # Data storage interface
└── index.ts          # Express server setup

shared/
└── schema.ts         # Shared TypeScript types and Zod schemas
```

## User Preferences
- Language: Spanish interface for Chilean market
- Design: Modern, professional with cyan/blue color scheme
- Functionality: Focus on lead generation and business automation