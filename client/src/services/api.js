const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, ""); // Remove trailing slash if present

export default API_BASE_URL; 