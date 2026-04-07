import { useEffect, useRef, useCallback } from 'react';

const CHANNEL_NAME = 'travel_data_sync';

/**
 * Broadcast a data-change event to all open tabs (including current tab).
 * @param {'vehicles'|'packages'} entity
 */
export function broadcastUpdate(entity) {
    try {
        const ch = new BroadcastChannel(CHANNEL_NAME);
        ch.postMessage({ entity, ts: Date.now() });
        ch.close();
    } catch {
        // BroadcastChannel not supported in very old browsers — silent fail
    }
}

/**
 * useDataSync — auto-refreshes data by polling AND listening to BroadcastChannel messages.
 *
 * @param {Function} fetchFn        - async function to call to refresh data
 * @param {'vehicles'|'packages'} entity  - entity name to listen for
 * @param {number} pollInterval     - polling interval in ms (default 30 000)
 */
export function useDataSync(fetchFn, entity, pollInterval = 30_000) {
    const fetchRef = useRef(fetchFn);
    fetchRef.current = fetchFn;

    const refresh = useCallback(() => {
        fetchRef.current();
    }, []);

    useEffect(() => {
        // Start polling
        const timer = setInterval(refresh, pollInterval);

        // Listen for cross-tab broadcast
        let ch;
        try {
            ch = new BroadcastChannel(CHANNEL_NAME);
            ch.onmessage = (e) => {
                if (!entity || e.data?.entity === entity) {
                    refresh();
                }
            };
        } catch {
            // Not supported — polling only
        }

        return () => {
            clearInterval(timer);
            ch?.close();
        };
    }, [refresh, entity, pollInterval]);
}
