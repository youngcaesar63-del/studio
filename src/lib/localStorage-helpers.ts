
'use client';

// A naive cache to store the most recently fetched data.
const cache = new Map<string, any>();

export function getLocalStorage(key: string, defaultValue: any) {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    
    // Return from cache if available
    if (cache.has(key)) {
        return JSON.parse(JSON.stringify(cache.get(key))); // Return a deep copy to prevent mutation
    }

    try {
        const storedData = window.localStorage.getItem(key);
        const parsedData = storedData ? JSON.parse(storedData) : defaultValue;
        cache.set(key, parsedData); // Cache the data after fetching
        return JSON.parse(JSON.stringify(parsedData)); // Return a deep copy
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
}

export function updateLocalStorage(key: string, data: any) {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const deepCopiedData = JSON.parse(JSON.stringify(data));
        const serializedData = JSON.stringify(deepCopiedData);
        window.localStorage.setItem(key, serializedData);
        cache.set(key, deepCopiedData); // Update cache
        
        // Dispatch a custom event to notify all tabs/components of the change
        window.dispatchEvent(new CustomEvent('storage-update', {
            detail: { key } // Only notify about the key change
        }));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}
