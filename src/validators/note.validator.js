/**
 * Validates note creation and update inputs
 * @param {{ title?: string, description?: string }} data
 * @returns {Record<string, string>} Validation errors (empty if valid)
 */
export function validateNote(data = {}) {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = "Title is required";
  } else if (data.title.trim().length > 255) {
    errors.title = "Title must be at most 255 characters";
  } else if (data.title.trim().toLowerCase() === "admin") {
    errors.title = "Title cannot be 'admin'";
  }

  if (data.description && data.description.length > 2000) {
    errors.description = "Description must be at most 2000 characters";
  }

  return errors;
}
