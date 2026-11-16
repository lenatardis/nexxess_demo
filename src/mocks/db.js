// Tiny "database" behind the mock backend (MSW handlers).
//
// Each collection starts from its seed data and is written to localStorage only after a handler
// changes it, so read-only collections are always served straight from the seed and changed ones
// survive page reloads. Everything stays in the visitor's own browser.
// The app's own token keys (accessNexxessToken, refreshNexxessToken) are not touched here.

// Bump when seed data or record shapes change: previously stored demo data is then discarded.
const DATA_VERSION = 1;
const PREFIX = 'nexxess-demo:';

// localStorage can be unavailable (blocked storage, some private modes): fall back to memory only.
const storage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('[demo db] Could not persist demo data:', error);
        }
    },
    removeAll(prefix) {
        try {
            Object.keys(localStorage)
                .filter((key) => key.startsWith(prefix))
                .forEach((key) => localStorage.removeItem(key));
        } catch {
            // nothing stored, nothing to remove
        }
    },
};

const readJson = (key) => {
    try {
        return JSON.parse(storage.get(key));
    } catch {
        return null;
    }
};

if (storage.get(`${PREFIX}version`) !== String(DATA_VERSION)) {
    storage.removeAll(PREFIX);
    storage.set(`${PREFIX}version`, String(DATA_VERSION));
}

const cache = {};

/** Returns the live collection: stored state if this browser has one, otherwise a fresh copy of the seed. */
export const getCollection = (name, seed) => {
    if (!(name in cache)) {
        cache[name] = readJson(PREFIX + name) ?? structuredClone(seed);
    }
    return cache[name];
};

/** Persists a collection after a handler has changed it. */
export const saveCollection = (name) => {
    if (name in cache) {
        storage.set(PREFIX + name, JSON.stringify(cache[name]));
    }
};

/** Next free numeric id in a collection of records. */
export const nextId = (items) => items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

/** Drops all changes made in this browser. */
export const resetDemoData = () => {
    storage.removeAll(PREFIX);
    storage.set(`${PREFIX}version`, String(DATA_VERSION));
    Object.keys(cache).forEach((name) => delete cache[name]);
};
