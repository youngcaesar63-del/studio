
'use client';

export function getLocalStorage(key: string, defaultValue: any) {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const storedData = window.localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : defaultValue;
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
        const serializedData = JSON.stringify(data);
        window.localStorage.setItem(key, serializedData);
        // Dispatch a custom event to notify all tabs/components of the change
        window.dispatchEvent(new CustomEvent('storage-update', {
            detail: { key, newValue: serializedData }
        }));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}
