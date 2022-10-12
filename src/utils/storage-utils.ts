export function encodeLocalStorage(key: string, value: any) {
    const encoded = window.btoa(encodeURIComponent(JSON.stringify(value)));
    localStorage.setItem(key, encoded);
}

export function decodeLocalStorage(key: string) {
    try {
        const encoded = localStorage.getItem(key);
        if(!encoded?.length) {
            return encoded;
        }
        return JSON.parse(decodeURIComponent(window.atob(encoded)));
    }
    catch {
        // Invalid storage value. Not interested in logging, just return null
        return null;
    }
}