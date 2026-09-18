# Backend README

Backend for Resumate. It handles authentication, PDF upload parsing, report generation, and AI-driven resume tailoring.

## What it does

- Register and log in users
- Protect routes with JWT authentication
- Upload and validate PDF resumes
- Parse resume text and send it to Gemini
- Store AI-generated interview reports in MongoDB
- Generate a tailored resume PDF for a target role

## Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- Zod
- Gemini API
- Puppeteer
- Multer

## Main folders

```text
backend/
├── server.js
├── src/
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── .env.example
├── package.json
└── README.md
```

## API overview

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/get-me
```

### Reports

```text
POST /api/report/generate
GET /api/report/fetch/:id
GET /api/report/getAll
POST /api/report/updateResume/:id
```

## Report flow

1. User sends resume PDF, job description, and self-description.
2. Backend validates input and PDF type/size.
3. Resume is parsed to text.
4. Gemini returns a structured report with:
   - match score
   - technical questions
   - behavioural questions
   - skill gaps
   - preparation plan
   - job title
5. Report is saved to MongoDB and returned to the frontend.

## Environment

```env
NODE_ENV=development
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/resumate
ACCESS_TOKEN_SECRETKEY=your-access-secret
REFRESH_TOKEN_SECRETKEY=your-refresh-secret
GEMINI_API_KEY=your-gemini-key
```

## Run locally

```bash
cd backend
npm install
npm run dev
```

## Production notes

- Use production secrets and HTTPS
- Restrict CORS to the frontend domain
- Keep MongoDB behind a managed service
- Add monitoring and retries for Gemini and DB failures
- Consider background jobs for long AI tasks

## Testing

```bash
npm test
```
