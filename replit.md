# All Stars Excellency Academy

## Overview

This is a full-stack web application for **All Stars Excellency Academy**, a tutoring and educational support center established in 2016. The platform serves as a marketing and enrollment website offering information about extra classes (Grades 8-12) and matric rewrite programs. Core features include subject listings, pricing information, class schedules, testimonials, and a contact form with WhatsApp integration for direct enrollment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

The frontend follows a page-based architecture with shared components. Pages are located in `client/src/pages/` and reusable components in `client/src/components/`. The UI uses a navy blue (#001F54), gold (#FFD700), and white color scheme defined via CSS custom properties.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas shared between client and server

The server serves both the API (`/api/*` routes) and static files in production. Development uses Vite's middleware for hot module replacement.

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Tables**: 
  - `contact_submissions` - stores contact form entries
  - `testimonials` - stores student testimonials with ratings

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schema and Zod validation schemas
- `routes.ts` - API route definitions with type-safe request/response schemas

### Build System
- Development: `tsx` for running TypeScript server, Vite for frontend HMR
- Production: esbuild bundles server to CommonJS, Vite builds frontend to `dist/public`

## External Dependencies

### Database
- PostgreSQL (connection via `DATABASE_URL` environment variable)
- Drizzle Kit for migrations (`npm run db:push`)

### Third-Party Services
- **WhatsApp Business**: Direct enrollment via WhatsApp links (pre-filled messages)
- **Firebase Hosting**: Configured for static deployment (`firebase.json`)
- **Unsplash**: External images for visual content

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `framer-motion` - Animations
- `embla-carousel-react` - Testimonial carousel
- Full shadcn/ui component set via Radix UI primitives