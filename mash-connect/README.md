# Mash Connect

Mash Connect is a full-stack prototype for RFQ-based skilled trade services.
It includes a Flask backend, React frontend, image uploads, quote submissions,
client dashboards, artisan profiles, and scalable route/model structure.

## Project Structure

```text
mash-connect/
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API runs at:

```text
http://127.0.0.1:5000
```

Main endpoints:

- `GET /api/health`
- `POST /api/create-rfq`
- `GET /api/rfqs`
- `POST /api/submit-quote`
- `GET /api/quotes`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/artisans`
- `GET /api/artisans`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

To point the frontend at a different backend:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5000/api npm run dev
```

## Google Verification

Create a Google OAuth Web Client ID, then set the same client ID in both apps:

- Backend: `GOOGLE_CLIENT_ID`
- Frontend: `VITE_GOOGLE_CLIENT_ID`

The frontend sends the Google ID token to `/api/auth/google`, and the backend
verifies it before creating or logging in the user.

## Notes

- Uploaded images are stored in `backend/uploads`.
- SQLite is used by default for local development.
- `JWT_SECRET_KEY`, `DATABASE_URL`, and `FRONTEND_URL` can be set as environment variables.
- PostgreSQL, payments, AI diagnostics, WhatsApp, and maps are ready for future integration.
