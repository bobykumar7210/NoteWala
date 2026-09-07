export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ARCHIVE: "/archive",
  TRASH: "/trash",
  NOTE: (id = ":id") => `/note/${id}`,
  ARCHIVE_NOTE: (id = ":id") => `/archive/note/${id}`,
  TRASH_NOTE: (id = ":id") => `/trash/note/${id}`,
};

export const NOTE_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};
