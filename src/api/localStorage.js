const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessNexxessToken',
    REFRESH_TOKEN: 'refreshNexxessToken',
};

const handleStorageError = (e, action) => {
    console.error(`Error during ${action}:`, e);
};


export const setNewAccessToken = async (token) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        return 'ok';
    } catch (e) {
        handleStorageError(e, 'setNewAccessToken');
    }
};


export const setTokens = (access, refresh) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    } catch (e) {
        handleStorageError(e, 'setTokens');
    }
};


export const logout = async () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        return 'ok';
    } catch (e) {
        handleStorageError(e, 'logout');
    }
};


export const getAccessToken = async () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (e) {
        handleStorageError(e, 'getAccessToken');
    }
};
