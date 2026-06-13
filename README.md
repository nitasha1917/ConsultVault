# ConsultVault — Consultation Recording Manager

A full-stack web application for managing consultation audio recordings, built as part of a technical assessment. It allows users to upload, browse, search, play, and delete consultation recordings along with associated metadata and notes.

---

## 1. Project Overview

ConsultVault is an MVP for managing consultation recordings. Users can:

- Upload audio recordings (MP3, WAV, M4A) along with a title, client name, and notes
- View all recordings on a dashboard with key details (title, client, upload date, file size)
- Search recordings by title or client name
- View full details of a recording, including an audio player and notes
- Delete recordings (removes both database entry and stored file)

The project demonstrates clean separation of concerns between frontend and backend, RESTful API design, and a responsive, professional UI.

---

## 2. Features

### Dashboard
- Lists all consultation recordings
- Displays title, client name, upload date, and file size
- Live (debounced) search by title or client name
- Empty/loading/error states handled gracefully

### Upload Recording
- Upload audio file (MP3, WAV, M4A — max 50MB)
- Enter consultation title, client name, and notes
- Client-side validation for required fields and file type/size
- Redirects to the recording's detail page on success

### Recording Details
- Built-in HTML5 audio player
- Displays full metadata (upload date, file size, file name)
- Displays consultation notes
- Delete recording directly from this page

### Search
- Server-side search via query parameter, matching against title and client name

### Delete
- Removes both the database record and the associated audio file from disk
- Confirmation prompt before deletion

### Responsive UI
- Built with Tailwind CSS
- Mobile-friendly layout (grid collapses to single column, navbar adapts)

---

## 3. Architecture

```
[ React (Vite) Frontend ]  <--- Axios/HTTP --->  [ Express Backend ]  <--->  [ SQLite DB ]
                                                          |
                                                   [ Local file storage
                                                     (backend/uploads/) ]
```

- **Frontend**: React SPA (Vite) — pages, reusable components, and a centralized Axios service layer
- **Backend**: Node.js + Express REST API — organized into routes, controllers, middleware, and a database layer
- **Database**: SQLite — single-file, zero-config relational database
- **File Storage**: Audio files stored on local disk via Multer; only metadata is stored in SQLite

---

## 4. Folder Structure

```
ConsultVault/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── recordings.routes.js
│   ├── controllers/
│   │   └── recordings.controller.js
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadRecording.jsx
│   │   │   └── RecordingDetails.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── RecordingCard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 5. Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs on **http://localhost:5000** by default.
This will also create the SQLite database file and `uploads/` directory if they don't exist.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** and proxies `/api` and `/uploads` requests to the backend on port 5000.

### Usage
1. Start the backend first.
2. Start the frontend.
3. Open `http://localhost:5173` in your browser.
4. Upload a recording, search, view details, and delete as needed.

---

## 6. API Endpoints

| Method | Endpoint              | Description                                  |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/api/recordings`     | Get all recordings (optional `?search=` query for title/client name) |
| GET    | `/api/recordings/:id` | Get a single recording by ID                  |
| POST   | `/api/recordings`     | Upload a new recording (multipart/form-data)  |
| DELETE | `/api/recordings/:id` | Delete a recording and its associated file    |

### POST `/api/recordings` — Request Body (multipart/form-data)

| Field      | Type   | Required | Description                  |
|------------|--------|----------|------------------------------|
| title      | string | Yes      | Consultation title           |
| clientName | string | Yes      | Client name                  |
| notes      | string | No       | Additional notes             |
| audio      | file   | Yes      | Audio file (.mp3, .wav, .m4a)|

### Database Schema — `Recordings`

| Column     | Type     | Notes                          |
|------------|----------|--------------------------------|
| id         | INTEGER  | PRIMARY KEY AUTOINCREMENT      |
| title      | TEXT     | NOT NULL                       |
| clientName | TEXT     | NOT NULL                       |
| notes      | TEXT     |                                |
| fileName   | TEXT     | NOT NULL                       |
| filePath   | TEXT     | NOT NULL                       |
| fileSize   | INTEGER  |                                |
| createdAt  | DATETIME | DEFAULT CURRENT_TIMESTAMP      |

---

## 7. Future Improvements

- Authentication and role-based access control
- Cloud storage (e.g., AWS S3) for audio files instead of local disk
- Pagination and sorting on the dashboard
- Edit functionality for recording metadata
- Audio waveform visualization
- Tagging/categorization of recordings
- Automated unit and integration tests
- Dockerized setup for consistent local/dev environments

---

## 8. AI Usage Disclosure

This section outlines how AI assistance was used during the development of this project, in line with transparency expectations for this technical assessment.

### How AI Was Used

**Brainstorming Architecture**
AI was used to discuss and validate the overall project structure — separating frontend and backend concerns, organizing the backend into routes/controllers/database/middleware layers, and planning the database schema for the `Recordings` table.

**Generating Boilerplate Code**
AI helped generate initial boilerplate for:
- React component scaffolding (Navbar, SearchBar, RecordingCard)
- Page-level components (Dashboard, Upload, Recording Details)
- Express route and controller skeletons
- Axios service layer setup
- Configuration files (Vite, Tailwind, PostCSS)

**Documentation Assistance**
AI assisted in drafting this README, including setup instructions, API documentation, and architecture notes, which were then reviewed and edited.

**Debugging Support**
AI was consulted to troubleshoot setup issues encountered during development, such as Vite import resolution errors and directory/path issues during local setup.

### Developer Responsibility

All final implementation decisions, testing, integration, and validation were performed by the developer. This includes:
- Verifying generated code against project requirements
- Running and testing the application locally (frontend and backend)
- Fixing environment-specific issues
- Reviewing and adjusting component logic, styling, and API contracts
- Ensuring the database schema and API endpoints function correctly end-to-end

AI was used as a productivity and learning aid, not as a substitute for understanding or verifying the codebase.

---

## 9. Project Notes — Architecture, Design Decisions & Tradeoffs

### Design Decisions

- **SQLite over a full RDBMS**: No external DB server needed, fast to set up, sufficient for the assessment's scope and data volume.
- **Multer for uploads**: Simple, well-documented middleware for handling multipart/form-data file uploads in Express.
- **Service layer (Axios) on frontend**: All API calls are centralized in `src/services/api.js`, decoupling components from request/response details and making future changes (e.g., auth headers, base URL) trivial.
- **Tailwind CSS**: Enables fast, consistent, utility-based styling without writing large custom CSS files — appropriate for a time-boxed MVP.
- **Debounced search**: Search input is debounced (300ms) before triggering an API call, reducing unnecessary requests while typing.
- **Controlled forms with client-side validation**: Upload form validates required fields, file type, and file size before submission, improving UX and reducing invalid requests to the backend.

### Assumptions

- Single-user/internal-tool context — no authentication or authorization is implemented.
- Audio files are reasonably small (capped at 50MB client-side) and stored locally; no cloud storage (e.g., S3) is used.
- Search is performed server-side via a `search` query parameter matching title or client name.
- The backend serves uploaded files statically from `/uploads/<fileName>`.
- API responses may be shaped as `{ data: ... }` or raw objects/arrays; the frontend handles both defensively.

### Tradeoffs

| Decision | Tradeoff |
|---|---|
| SQLite + local file storage | Simple and fast to build, but not suitable for multi-instance/production deployments (no shared storage, limited concurrent writes). |
| No authentication | Faster to implement and demo, but not production-ready — anyone with access can view/upload/delete recordings. |
| Client-side validation only (plus basic server checks) | Improves UX quickly, but full robustness would require more thorough server-side validation and sanitization. |
| Tailwind utility classes | Faster styling, but can make components visually dense/harder to read compared to a dedicated CSS/component library. |
| No pagination | Simpler list rendering, but won't scale well if the number of recordings grows large. |

### Future Enhancements

- Authentication & authorization (e.g., JWT-based login) to restrict access per user/role
- Cloud storage integration (e.g., AWS S3) for audio files instead of local disk
- Pagination and sorting on the dashboard for handling large numbers of recordings
- Edit functionality for recording metadata (title, client name, notes) after upload
- Audio waveform visualization and playback enhancements (speed control, skip markers)
- Tagging/categorization of recordings (e.g., by consultation type or status)
- Server-side input sanitization and rate limiting for production hardening
- Automated tests (unit tests for controllers, integration tests for API endpoints, component tests for React UI)
- Dockerization for easier setup and deployment consistency
