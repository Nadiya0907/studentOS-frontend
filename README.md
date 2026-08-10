# StudentOS Frontend — SIH 2026

Enhanced React + Vite frontend aligned to the provided StudentOS Frontend and Backend roadmaps.

## Stack
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion (available for further motion work)
- Lucide React
- Recharts
- React Hook Form
- React Hot Toast

## Start
```bash
npm install
npm run dev
```

The default `.env.example` uses `VITE_USE_MOCK_API=true`, so the complete UI can be demonstrated before the backend is live.

Copy `.env.example` to `.env`.

When the FastAPI backend is ready:
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://YOUR-BACKEND/api
```

## Pages included
### Public
- Landing
- About
- Features
- Contact
- Login
- Signup
- Forgot password
- Email verification

### Student
- Dashboard
- Learning Portal
- Placement Portal
- AI Assistant
- Resume Builder
- Community
- Profile
- Settings
- Notifications

### Admin
- Dashboard
- Users
- Reports
- Analytics
- Feedback

## Backend API contract covered
Authentication: `/signup`, `/login`, `/logout`, `/forgot-password`, `/verify-email`, `/profile`
Dashboard: `/dashboard`, `/attendance`, `/cgpa`, `/goals`, `/streak`
Learning: `/notes`, `/subjects`, `/pyqs`, `/videos`
Files: `/upload/image`, `/upload/pdf`, `/upload/resume`, `/upload`
Placement: `/companies`, `/jobs`, `/internships`, `/resume`
Community: `/posts`, `/comments`, `/likes`
AI: `/ai/mentor`, `/ai/career`, `/ai/resume`, `/ai/english`, `/ai/project`
Notifications: `/notifications`
Email: `/send-email`, `/verify-email`
Admin: `/admin/users`, `/admin/reports`, `/admin/statistics`, `/admin/feedback`

## Frontend/backend workflow
1. Build UI with mock mode.
2. Backend teammate implements APIs and publishes the API base URL.
3. Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL`.
4. Test each page against Swagger/Postman responses.
5. Deploy frontend to Vercel after production API integration.

## Demo admin
Mock mode recognizes `admin@studentos.local` as an admin account for UI demonstration only. It is not a real credential and must not be used in production.

## Important
The backend roadmap specifies FastAPI, MongoDB Atlas, Firebase Authentication + JWT, Cloudinary, Gemini/Groq, Firebase Cloud Messaging, Brevo/SendGrid, Swagger, Postman, Pytest and Render/AWS deployment. Those backend services remain the backend teammate's responsibility; this repository provides the frontend integration surfaces for them.
