# Frontend README

Frontend for Resumate. It handles login, registration, report generation, route protection, and report viewing.

## What it does

- User sign up and login
- Protect auth-only pages
- Upload a PDF resume
- Submit job description and self-description
- Generate and view interview analysis
- Download a tailored resume PDF

## Stack

- React
- Vite
- React Router
- Axios

## Main structure

```text
frontend/
├── src/
│   ├── app.routes.jsx
│   ├── services/api.js
│   └── features/
│       ├── auth/
│       └── interviewReport/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
└── README.md
```

## Routes

```text
/login
/register
/
/report/:reportId
```

## Auth flow

- User logs in or registers
- Access token is stored in localStorage
- API client adds the token to requests
- If the token expires, it refreshes automatically
- Protected pages redirect unauthenticated users to login

## Report flow

1. User uploads a PDF resume.
2. User enters the job description and self-description.
3. Frontend sends the form to the backend.
4. Report is displayed with tabs for overview, technical, behavioural, skill gaps, and preparation plan.
5. User can download a tailored resume PDF.

## Environment

```env
VITE_API_URL=http://localhost:3000
```

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Production notes

- Set `VITE_API_URL` to the deployed backend URL
- Keep the frontend behind HTTPS
- Use secure deployment settings in Vercel
- Handle auth refresh errors gracefully

## Helpful files

- [src/app.routes.jsx](src/app.routes.jsx)
- [src/services/api.js](src/services/api.js)
- [src/features/auth/hooks/useAuth.js](src/features/auth/hooks/useAuth.js)
- [src/features/interviewReport/hooks/useReport.js](src/features/interviewReport/hooks/useReport.js)
