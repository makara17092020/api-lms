# LMS (Learning Management System)

A comprehensive Learning Management System built with Next.js, featuring role-based access for teachers, students, and administrators. This application enables class management, question creation, task assignment, study planning, and AI-powered assistance.

## Features

### For Teachers
- Create and manage classes
- Add/remove students from classes
- Create and edit questions for assessments
- View student progress and statistics
- Generate study plans for students
- Access dashboard with class insights

### For Students
- Join classes using class codes
- Answer questions and view results
- Access personalized study plans
- Track progress and statistics
- Edit profile information

### For Administrators
- Manage users (teachers, students)
- View system-wide statistics
- Access admin dashboard

### Additional Features
- Multi-language support (English/Khmer)
- AI-powered assistance for study planning
- Responsive design
- Secure authentication with NextAuth.js
- Database management with Prisma
- Docker containerization

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini API
- **Internationalization**: next-intl
- **Deployment**: Docker, Docker Compose
- **Linting**: ESLint

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker and Docker Compose
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/makara17092020/api-lms.git>
cd api-lms
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Base URL for the application
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GEMINI_API_KEY`: Google Gemini API key

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Docker Setup

To run the application using Docker:

1. Build and start the containers:
```bash
docker-compose up --build
```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

## API Documentation

The application provides RESTful API endpoints under `/api/`:

- `/api/auth/*` - Authentication endpoints
- `/api/classes/*` - Class management
- `/api/students/*` - Student operations
- `/api/teachers/*` - Teacher operations
- `/api/admin/*` - Administrative functions
- `/api/ai/*` - AI-powered features
- `/api/questions/*` - Question management
- `/api/tasks/*` - Task management
- `/api/study-plan/*` - Study planning

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── messages/              # Internationalization messages
└── i18n/                  # i18n configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:studio` - Open Prisma Studio

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the repository.
