import { devUrl } from "../settings/data";
import { refreshAccessToken } from "./authApi";


const handleUnauthorized = async (retryFunction) => {
    try {
        const newToken = await refreshAccessToken();
        if (newToken?.access) {
            return retryFunction(newToken.access);
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
    }
    return null;
};


const handleResponse = async (response, retryFunction) => {

    if (response.status === 401 || response.statusText === "Unauthorized") {
        return await handleUnauthorized(retryFunction);
    }
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};


export const getUserInfo = async (token) => {
    try {
        const response = await fetch(`${devUrl}users/user/profile/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return await handleResponse(response, getUserInfo);
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
};


export const editUserInfo = async (token, userInfo) => {
    try {
        const formData = new FormData();

        Object.entries(userInfo).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        const response = await fetch(`${devUrl}users/user/update/`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });

        if (response.status === 400) {
            return response.json()
        } else return await handleResponse(response, (newToken) => editUserInfo(newToken, userInfo));
    } catch (error) {
        console.error("Error updating user info:", error);
    }
};
