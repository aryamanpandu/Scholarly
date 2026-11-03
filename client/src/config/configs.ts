// Empty string means same-origin requests (e.g. /api/login), which is what the Docker/nginx setup uses.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
