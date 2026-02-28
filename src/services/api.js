const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

// ─── PACKAGES ────────────────────────────────────────────────────────────────

export const fetchPackages = () =>
    fetch(`${BASE_URL}/api/packages`).then(r => r.json());

export const createPackage = (data) =>
    fetch(`${BASE_URL}/api/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const updatePackage = (id, data) =>
    fetch(`${BASE_URL}/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const deletePackage = (id) =>
    fetch(`${BASE_URL}/api/packages/${id}`, { method: 'DELETE' }).then(r => r.json());

// ─── VEHICLES ────────────────────────────────────────────────────────────────

export const fetchVehicles = () =>
    fetch(`${BASE_URL}/api/vehicles`).then(r => r.json());

export const createVehicle = (data) =>
    fetch(`${BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const updateVehicle = (id, data) =>
    fetch(`${BASE_URL}/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const deleteVehicle = (id) =>
    fetch(`${BASE_URL}/api/vehicles/${id}`, { method: 'DELETE' }).then(r => r.json());

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const fetchBookings = () =>
    fetch(`${BASE_URL}/api/bookings`).then(r => r.json());

export const updateBookingStatus = (id, status) =>
    fetch(`${BASE_URL}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    }).then(r => r.json());

export const deleteBooking = (id) =>
    fetch(`${BASE_URL}/api/bookings/${id}`, { method: 'DELETE' }).then(r => r.json());

export const submitBooking = (data) =>
    fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json());
