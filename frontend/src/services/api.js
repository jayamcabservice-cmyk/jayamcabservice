const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper for multipart form data
const getMultipartHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Don't set Content-Type - browser will set it with boundary
  };
};

// ─── GLOBAL CACHE ───────────────────────────────────────────────────────────
// Holds in-memory data to prevent flashing when switching Tabs
export const apiCache = {
  packages: null,
  vehicles: null,
  bookings: null,
  dashboard: null
};

// ─── AUTHENTICATION ─────────────────────────────────────────────────────────

export const registerAdmin = (data) =>
  fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const loginAdmin = (data) =>
  fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const googleLogin = (idToken) =>
  fetch(`${BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  }).then(r => r.json());

export const getCurrentAdmin = () =>
  fetch(`${BASE_URL}/api/auth/me`, {
    headers: getAuthHeaders(),
  }).then(r => r.json());

export const logoutAdmin = () =>
  fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(r => r.json());

// ─── IMAGE UPLOAD ───────────────────────────────────────────────────────────

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: getMultipartHeaders(),
    body: formData,
  }).then(r => r.json());
};

// ─── PACKAGES ────────────────────────────────────────────────────────────────

export const fetchPackages = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/api/packages${queryParams ? `?${queryParams}` : ''}`)
    .then(r => r.json());
};

export const fetchPackageById = (id) =>
  fetch(`${BASE_URL}/api/packages/${id}`).then(r => r.json());

export const createPackage = (data) =>
  fetch(`${BASE_URL}/api/packages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updatePackage = (id, data) =>
  fetch(`${BASE_URL}/api/packages/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deletePackage = (id) =>
  fetch(`${BASE_URL}/api/packages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => r.json());

// ─── VEHICLES ────────────────────────────────────────────────────────────────

export const fetchVehicles = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/api/vehicles${queryParams ? `?${queryParams}` : ''}`)
    .then(r => r.json());
};

export const fetchVehicleById = (id) =>
  fetch(`${BASE_URL}/api/vehicles/${id}`).then(r => r.json());

export const createVehicle = (data) =>
  fetch(`${BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateVehicle = (id, data) =>
  fetch(`${BASE_URL}/api/vehicles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteVehicle = (id) =>
  fetch(`${BASE_URL}/api/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => r.json());

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const fetchBookings = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/api/bookings${queryParams ? `?${queryParams}` : ''}`, {
    headers: getAuthHeaders(),
  }).then(r => r.json());
};

export const fetchBookingById = (id) =>
  fetch(`${BASE_URL}/api/bookings/${id}`, {
    headers: getAuthHeaders(),
  }).then(r => r.json());

export const updateBookingStatus = (id, status) =>
  fetch(`${BASE_URL}/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  }).then(r => r.json());

export const updateBooking = (id, data) =>
  fetch(`${BASE_URL}/api/bookings/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteBooking = (id) =>
  fetch(`${BASE_URL}/api/bookings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => r.json());

export const submitBooking = (data) =>
  fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

// ─── HISTORY ────────────────────────────────────────────────────────────────

export const fetchHistory = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/api/history${queryParams ? `?${queryParams}` : ''}`, {
    headers: getAuthHeaders(),
  }).then(r => r.json());
};

export const fetchItemHistory = (entityType, itemId) =>
  fetch(`${BASE_URL}/api/history/${entityType}/${itemId}`, {
    headers: getAuthHeaders(),
  }).then(r => r.json());
