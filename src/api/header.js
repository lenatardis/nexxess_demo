import { devUrl } from "../settings/data";
import { refreshAccessToken } from "./authApi";


const handleUnauthorized = async (retryFunction, ...args) => {
    try {
        const newToken = await refreshAccessToken();
        if (newToken?.access) {
            return retryFunction(newToken.access, ...args);
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
    }
    return null;
};


const handleResponse = async (response, retryFunction, ...args) => {
    if (response.status === 401 || response.statusText === "Unauthorized") {
        return await handleUnauthorized(retryFunction, ...args);
    }

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};


export const getNotifications = async (token) => {
    try {
        const response = await fetch(`${devUrl}users/notifications/ `, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getNotifications);
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};

export const getCountNotifications = async (token) => {
    try {
        const response = await fetch(`${devUrl}users/notifications/new-quantity/ `, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getCountNotifications);
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};

export const setReadNotifications = async (token) => {
    try {
        const response = await fetch(`${devUrl}users/notifications/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_opened: true
            }),
        });

        return await handleResponse(response, setReadNotifications);
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};

export const getSearchResult = async (token, query) => {
    try {
        const response = await fetch(`${devUrl}search/?query=${query} `, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getSearchResult);
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};
