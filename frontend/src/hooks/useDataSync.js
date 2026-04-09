import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

// Create a single shared socket connection for the entire application
// We initiate it outside the hook so it doesn't reconnect constantly per-component
const socket = io(API_URL, {
    transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    autoConnect: true,
});

/**
 * useDataSync — auto-refreshes data by listening to real-time WebSockets.
 *
 * @param {Function} fetchFn        - async function to call to refresh data
 * @param {'vehicles'|'packages'|'bookings'} entity  - entity name to listen for
 * @param {number} fallbackPollInt  - optional fallback polling interval (default 5 minutes)
 */
export function useDataSync(fetchFn, entity, fallbackPollInt = 300_000) {
    const fetchRef = useRef(fetchFn);
    fetchRef.current = fetchFn;

    const refresh = useCallback(() => {
        fetchRef.current();
    }, []);

    useEffect(() => {
        // Fallback polling (much slower now since WebSockets handle real-time)
        const timer = setInterval(refresh, fallbackPollInt);

        // Listen for websocket events from the backend
        const handleDataUpdated = (payload) => {
            if (!entity || payload?.entity === entity) {
                refresh();
            }
        };

        socket.on('data_updated', handleDataUpdated);

        return () => {
            clearInterval(timer);
            socket.off('data_updated', handleDataUpdated);
        };
    }, [refresh, entity, fallbackPollInt]);
}
