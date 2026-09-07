# Backend (BE) Reference Rule - Notes API MVC

Whenever the user mentions **"BE"**, **"backend"**, **"note mvc"**, **"notes api"**, **"note mvc project"**, or requests to check / implement any API (e.g., "check note create api", "implement login", "check archive note API"), follow these mandatory guidelines:

---

## 1. Backend Codebase Location
The backend repository is located outside this React project directory at:
```
/home/mohit/Pictures/study/node-project/notes-api-MVC
```

---

## 2. Mandatory Workflow for API & Backend Tasks
1. **Always Inspect the Backend Code First**:
   - Before writing or modifying any frontend API service, state store, hook, or component that interacts with the backend, immediately inspect and read the relevant backend code directly from `/home/mohit/Pictures/study/node-project/notes-api-MVC` (using `run_command` with `cat`, `grep`, or viewing commands).
2. **Never Guess API Contracts**:
   - Verify exact HTTP methods, endpoints, request headers, payload fields, query parameters, validation rules, status codes, and response JSON formats directly from the backend source code.
3. **Check Validation & Schema Constraints**:
   - Check the corresponding express-validator file (`validators/`) and Mongoose model (`models/`) to ensure the frontend form validation and payload match backend requirements precisely.

---

## 3. Backend Architecture Map

| Layer | Path in `/home/mohit/Pictures/study/node-project/notes-api-MVC` | Purpose / Details |
| :--- | :--- | :--- |
| **Server Entry** | `app.js` | Express app configuration, CORS origins (`http://localhost:5173`), rate limiters, route mounting (`/api`), global error handler. |
| **Routes** | `routes/indexRoute.js`<br>`routes/noteRoutes.js`<br>`routes/userRoute.js` | API endpoints prefix `/api`.<br>- `/api/notes`: CRUD, archive, restore, search, pagination.<br>- `/api/users`: Register, login, profile, avatar upload, admin routes. |
| **Controllers** | `controllers/noteController.js`<br>`controllers/userController.js` | Request handling, response status codes & structures. |
| **Validators** | `validators/note.validator.js`<br>`validators/user.validator.js` | Express-validator schemas (payload size limits, regex, required fields). |
| **Models / Schemas** | `models/Note.js`<br>`models/User.js` | Mongoose schemas, field types, enum values, timestamps. |
| **Middlewares** | `middlewares/authMiddleware.js`<br>`middlewares/roleMiddleware.js`<br>`middlewares/uploadMiddleware.js`<br>`middlewares/rateLimiter.js`<br>`middlewares/errorHandler.js` | JWT Bearer token authentication, role validation, file uploads, error formats. |
| **Services & Repositories** | `services/`<br>`repositories/` | Business logic & DB queries. |
| **Constants** | `utils/constants.js` | Status enums (e.g., `NOTE_STATUS.ACTIVE`, `ARCHIVED`, `DELETED`), user roles (`ADMIN`, `USER`). |

---

## 4. Key Endpoints Quick Reference

### Auth & Users (`/api/users`)
- `POST /api/users/register`: Public. Body: `{ username, email, password }`
- `POST /api/users/login`: Public. Body: `{ email, password }` (Rate limited)
- `GET /api/users/profile`: Protected (JWT Bearer). Returns authenticated user profile.
- `POST /api/users/profile/image`: Protected (JWT Bearer). Multipart form-data for profile picture upload.

### Notes (`/api/notes`) - All Protected (JWT Bearer Token in `Authorization: Bearer <token>`)
- `POST /api/notes`: Create note. Body: `{ title: string (required, max 255), description?: string (max 2000) }`
- `GET /api/notes`: Query params: `page` (int >= 1), `limit` (int 1-100), `q` (string search), `status` (`active` | `archived` | `deleted`)
- `GET /api/notes/:id`: Get single note by Mongo ID.
- `PUT /api/notes/:id`: Update note. Body: `{ title, description? }`
- `PATCH /api/notes/:id/archive`: Archive note.
- `PATCH /api/notes/:id/restore`: Restore archived or deleted note.
- `DELETE /api/notes/:id`: Soft delete note.
