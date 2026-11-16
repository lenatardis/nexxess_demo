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


export const getConsultants = async (token) => {
    try {
        const response = await fetch(`${devUrl}bitrix/consultants/default/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getConsultants);
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};

export const getRightBarStatics = async (token, b24_consultant_id) => {
    try {
        const response = await fetch(`${devUrl}users/user/statistics/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getRightBarStatics, b24_consultant_id);
    } catch (error) {
        console.error("Error fetching statistics:", error);
    }
};


export const getDiagram = async (token) => {
    try {
        const response = await fetch(`${devUrl}bitrix/trust_pipeline/diagrams/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return await handleResponse(response, getDiagram);
    } catch (error) {
        console.error("Error fetching statistics:", error);
    }
};