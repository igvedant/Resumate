# Resumate

AI-powered interview preparation app that helps job seekers assess a role, review gaps, and generate a tailored resume.

## Live demo

- Frontend: https://resumate-hazel-delta.vercel.app/

## What it does

- Upload a PDF resume
- Paste a job description and self-description
- Get a match score and interview-focused analysis
- Review technical and behavioural questions
- Identify key skill gaps
- Follow a preparation plan
- Download a job-targeted resume PDF

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT with refresh-token rotation
- AI: Google Gemini
- PDF generation: Puppeteer

## Project structure

```text
Resumate/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── report.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   ├── file.middleware.js
│       │   ├── rateLimit.middleware.js
│       │   └── validate.middleware.js
│       ├── models/
│       │   ├── blacklistedToken.model.js
│       │   ├── report.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── report.routes.js
│       ├── services/
│       │   └── ai.service.js
│       ├── utils/
│       │   ├── asyncHandler.js
│       │   └── token.util.js
│       └── validators/
│           ├── auth.validator.js
│           └── report.validator.js
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── app.routes.jsx
│       ├── services/
│       │   └── api.js
│       └── features/
│           ├── auth/
│           │   ├── auth.context.jsx
│           │   ├── auth.provider.jsx
│           │   ├── auth.css
│           │   ├── components/
│           │   │   └── Protected.jsx
│           │   ├── hooks/
│           │   │   └── useAuth.js
│           │   ├── pages/
│           │   │   ├── Login.jsx
│           │   │   └── Register.jsx
│           │   └── services/
│           │       └── auth.api.js
│           └── interviewReport/
│               ├── interviewReport.context.jsx
│               ├── interviewReport.provider.jsx
│               ├── interviewReport.css
│               ├── hooks/
│               │   └── useReport.js
│               ├── pages/
│               │   ├── Home.jsx
│               │   └── Report.jsx
│               └── services/
│                   └── interviewReport.api.js
├── README.md
├── backend/README.md
├── frontend/README.md
```

## Endpoint overview

| Layer    | Method | Endpoint                       | Purpose                                   | Used by                |
| -------- | ------ | ------------------------------ | ----------------------------------------- | ---------------------- |
| Frontend | GET    | `/login`                       | User login page                           | Browser route          |
| Frontend | GET    | `/register`                    | Registration page                         | Browser route          |
| Frontend | GET    | `/`                            | Authenticated home/dashboard page         | Browser route          |
| Frontend | GET    | `/report/:reportId`            | View a generated interview report         | Browser route          |
| Backend  | POST   | `/api/auth/register`           | Create a new user                         | Register form          |
| Backend  | POST   | `/api/auth/login`              | Login and return access token             | Login form             |
| Backend  | POST   | `/api/auth/refresh`            | Refresh expired access token using cookie | Axios interceptor      |
| Backend  | POST   | `/api/auth/logout`             | Invalidate refresh token and logout user  | Logout button          |
| Backend  | GET    | `/api/auth/get-me`             | Fetch current logged-in user              | App auth bootstrap     |
| Backend  | POST   | `/api/report/generate`         | Upload resume and generate analysis       | Home page report form  |
| Backend  | GET    | `/api/report/fetch/:id`        | Get a specific report by ID               | Report detail page     |
| Backend  | GET    | `/api/report/getAll`           | Get all reports for the logged-in user    | Dashboard summary      |
| Backend  | POST   | `/api/report/updateResume/:id` | Generate and download tailored resume PDF | Download resume action |

## Local setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

Required backend variables:

```env
NODE_ENV=development
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/resumate
ACCESS_TOKEN_SECRETKEY=your-access-secret
REFRESH_TOKEN_SECRETKEY=your-refresh-secret
GEMINI_API_KEY=your-gemini-key
```

Frontend variable:

```env
VITE_API_URL=http://localhost:3000
```

## Deployment

### Frontend

- Deploy on Vercel
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to the deployed backend URL

### Backend

- Deploy on Render, Railway, Fly.io, or any Node.js host
- Set the same environment variables as above for production
- Configure CORS to allow the production frontend domain

## Production setup

For production, use secure values and HTTPS:

```env
NODE_ENV=production
CLIENT_ORIGIN=https://resumate-hazel-delta.vercel.app
MONGODB_URI=your-production-mongodb-url
ACCESS_TOKEN_SECRETKEY=your-production-access-secret
REFRESH_TOKEN_SECRETKEY=your-production-refresh-secret
GEMINI_API_KEY=your-gemini-api-key
```

```env
VITE_API_URL=https://your-backend-domain.com
```

## Notes

- The app expects the backend to be running before using the frontend.
- Resume uploads are limited to PDF files.
- Report generation is protected by authentication and rate limiting.

## Related docs

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
