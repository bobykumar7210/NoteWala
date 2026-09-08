<div align="center">

# 📝 NoteWala

**A modern, lightning-fast, and elegant personal notes management web application.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![React Compiler](https://img.shields.io/badge/React_Compiler-Enabled-00D8FF?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/learn/react-compiler)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Project Architecture](#-project-architecture) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [API Reference](#-api-integration-reference)

</div>

---

## 🌟 Overview

**NoteWala** is a responsive, feature-rich notes management frontend built with **React 19**, **Vite**, and **React Router v7**. Designed for productivity and simplicity, it provides clean note capturing, dynamic searching, lifecycle management (Active, Archived, Trash), deep-linkable modal views, and JWT-authenticated session handling.

The app uses a modular **Custom Hook + Service Layer** pattern with a custom **CSS design system** featuring modern glassmorphism, responsive navigation, and micro-interactions.

---

## ✨ Key Features

- **🔐 Authentication & Access Control**
  - Robust user registration & login flows with field validations.
  - JWT Bearer Token storage with persistent sessions (`localStorage`).
  - Protected & Public route guards preventing unauthorized access.
  - Secure profile retrieval and one-click logout.

- **📝 Note Lifecycle Management**
  - **Create & Edit**: Quick-capture inline form with expand-on-focus and deep modal editing.
  - **Archive**: Move notes out of the active feed into a dedicated Archive vault.
  - **Soft Delete & Trash**: Safeguard notes by moving them to Trash before permanent deletion.
  - **Restore**: Easily restore archived or deleted notes back to the active workspace.
  - **Confirmation Dialogs**: Protection against accidental deletions.

- **🔍 Live Search & Filter**
  - Server-side search integrated with debounce for snappy filtering across titles and descriptions.
  - Dedicated views for **Active Notes**, **Archive (`/archive`)**, and **Trash (`/trash`)**.

- **🔗 Deep-Linkable URL Synchronization**
  - Direct URL routes for note previews and editing modals (e.g., `/note/:id`, `/archive/note/:id`, `/trash/note/:id`).
  - Seamless browser history navigation (Back/Forward buttons seamlessly open and close modals).

- **🎨 Modern Design & Glassmorphic UI**
  - Bespoke CSS token architecture (`theme.css`, `Home.css`) with smooth transitions.
  - Responsive collapsible sidebar and mobile-friendly top navbar.
  - Clean card layouts with masonry-style flexibility and truncation handling.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **UI Framework** | [React 19](https://react.dev/) | Latest React with Concurrent features & React Compiler |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Ultra-fast development server and optimized rollup bundling |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing with nested layouts and route guards |
| **Optimization** | [Babel React Compiler](https://react.dev/learn/react-compiler) | Automatic memoization of components and hooks |
| **Styling** | Vanilla CSS (Tokens & Variables) | High-performance CSS design system with custom variables |
| **Linting & Code Quality** | [ESLint 10](https://eslint.org/) | Modern flat configuration with React Refresh & React Hooks rules |

---

## 📂 Project Architecture

The codebase follows separation of concerns, separating business logic into custom hooks, API calls into service modules, and visual presentation into pure UI components:

```text
NoteWala/
├── public/                     # Static assets (favicons, logos)
├── src/
│   ├── assets/                 # SVGs, icons, and static images
│   ├── components/
│   │   ├── layout/             # Application shell components
│   │   │   ├── Navbar.jsx      # Top navigation with search bar & user profile
│   │   │   ├── Sidebar.jsx     # Navigation sidebar (Notes, Archive, Trash)
│   │   │   └── index.js        # Layout exports
│   │   └── notes/              # Note feature components
│   │       ├── ConfirmDeleteModal.jsx # Deletion confirmation popup
│   │       ├── NoteForm.jsx    # Quick note creation card
│   │       ├── NoteItem.jsx    # Individual note card representation
│   │       ├── NoteList.jsx    # Responsive grid list of notes
│   │       ├── NoteModal.jsx   # Detailed note viewing / editing dialog
│   │       └── index.js        # Notes component exports
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication state provider
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useLogin.js         # Login form state & submission handler
│   │   ├── useRegister.js      # Registration form state & validation handler
│   │   ├── useNotes.js         # Note CRUD, search, and route sync controller
│   │   └── index.js            # Hooks entry point
│   ├── pages/                  # Page route views
│   │   ├── Home.jsx            # Main workspace (Active, Archive, Trash)
│   │   ├── Login.jsx           # User sign-in page
│   │   ├── Register.jsx        # User sign-up page
│   │   └── index.js            # Page exports
│   ├── routes/                 # Route guards & layout wrappers
│   │   ├── ProtectedRoute.jsx  # Authenticated route guard
│   │   ├── PublicRoute.jsx     # Guest-only route guard
│   │   └── index.js            # Routes exports
│   ├── services/               # HTTP client & API abstraction layer
│   │   ├── authService.js      # Auth API endpoints (login, register, profile)
│   │   └── noteService.js      # Notes API endpoints (CRUD, archive, restore)
│   ├── styles/                 # Styling architecture
│   │   ├── Home.css            # Workspace & component styling
│   │   ├── index.css           # Global typography & reset
│   │   └── theme.css           # CSS design variables & color tokens
│   ├── utils/
│   │   └── constants.js        # Route paths, API URLs, status enums & storage keys
│   ├── validators/             # Client-side validation utilities
│   │   ├── auth.validator.js   # Auth field validation rules
│   │   ├── note.validator.js   # Note input validation rules
│   │   └── index.js            # Validator exports
│   ├── App.jsx                 # Main application component & route tree
│   └── main.jsx                # React DOM entry point
├── .env.example                # Sample environment configuration
├── eslint.config.js            # ESLint flat configuration
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite & React Compiler configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher
- **Backend API**: A running instance of the [Notes API MVC Backend](https://github.com/mohit/notes-api-MVC) (default: `http://localhost:3000/api`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/NoteWala.git
   cd NoteWala
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Configure your frontend environment via the `.env` file in the root directory:

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `string` | `http://localhost:3000/api` | Base URL of the backend REST API |

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173` |
| `npm run build` | Compiles and builds the production bundle into the `dist/` directory |
| `npm run preview` | Locally previews the production build created by `npm run build` |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## 🌐 API Integration Reference

NoteWala connects to a RESTful backend using standard JSON and JWT Bearer tokens:

### 🔑 Authentication Endpoints (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register a new user (`username`, `email`, `password`) |
| `POST` | `/api/users/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/users/profile` | Protected | Fetch current logged-in user profile |

### 📋 Notes Endpoints (`/api/notes`)

All note endpoints require the `Authorization: Bearer <token>` header:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | `?status=active\|archived\|deleted&q=search` | List notes filtered by status and search query |
| `GET` | `/api/notes/:id` | — | Retrieve single note by ID |
| `POST` | `/api/notes` | `{ title, description }` | Create a new note |
| `PUT` | `/api/notes/:id` | `{ title, description }` | Update title and description of a note |
| `PATCH` | `/api/notes/:id/archive`| — | Move an active note to the archive |
| `PATCH` | `/api/notes/:id/restore`| — | Restore an archived or deleted note to active |
| `DELETE` | `/api/notes/:id` | — | Soft delete note (moves to trash) or permanent delete |

---

## 🧭 Application Routes

| Path | Access | Description |
| :--- | :--- | :--- |
| `/login` | Public | Sign-in page (redirects to `/` if authenticated) |
| `/register` | Public | Account registration page (redirects to `/` if authenticated) |
| `/` | Protected | Main notes dashboard (Active notes feed) |
| `/note/:id` | Protected | Opens specific note in modal view from active feed |
| `/archive` | Protected | Archived notes view |
| `/archive/note/:id`| Protected | Opens specific archived note in modal |
| `/trash` | Protected | Soft-deleted notes view (Trash) |
| `/trash/note/:id` | Protected | Opens specific trashed note in modal |

---

## 🎨 Design System & Styling

The UI is built with a custom CSS design system located in `src/styles/`:

- **CSS Variables & Tokens (`theme.css`)**: Centralized design tokens for colors, surfaces, borders, shadows, and typography.
- **Glassmorphic Elements**: Subtle backdrop blurs, translucent cards, and border highlights.
- **Responsive Layout**: Fluid flex/grid structures that adapt from wide desktop monitors down to mobile screens.
- **Focus & Transitions**: Micro-interactions on buttons, card hover lift effects, and animated modal backdrops.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
