import {devUrl} from "../settings/data";
import {logout, setNewAccessToken, setTokens} from "./localStorage";

const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            ...options,
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return await response.json();
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return null;
    }
};

export const getGoogleProfile = async (token) => {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo`;
    return await fetchWithErrorHandling(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshNexxessToken");
    if (!refreshToken) return null;

    const response = await fetchWithErrorHandling(`${devUrl}users/token/refresh/`, {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response?.access) {
        await setNewAccessToken(response.access);
        return response;
    } else {
        await logout();
        console.log("User logged out due to token refresh failure.");
        return null;
    }
};

export const login = async (email, password) => {
    return await fetchWithErrorHandling(`${devUrl}users/verification/send_code/`, {
        method: "POST",
        body: JSON.stringify({email, password}),
    });
};

export const loginVerification = async (code, email) => {
    const response = await fetchWithErrorHandling(`${devUrl}users/verification/`, {
        method: "POST",
        body: JSON.stringify({ code, email }),
    });

    if (response?.access_token && response?.refresh_token) {
        setTokens(response.access_token, response.refresh_token);
    }
    return response;
};

export const setGoogleLogin = async (email, first_name, last_name, full_name) => {
    const response = await fetchWithErrorHandling(`${devUrl}users/google/auth/`, {
        method: "POST",
        body: JSON.stringify({ email, first_name, last_name, full_name }),
    });

    if (response?.access_token && response?.refresh_token) {
        setTokens(response.access_token, response.refresh_token);
    }
    return response;
};

export const signUp = async (phone, phone_two, phone_three, email, email_two, email_three, first_name, last_name,
                             country, city, password, b24_consultant_id) => {
    const requestBody = {
        phone,
        phone_two,
        phone_three,
        email,
        email_two,
        email_three,
        first_name,
        last_name,
        country,
        city,
        password,
        ...(b24_consultant_id && { b24_consultant_id }),
    };

    const response = await fetchWithErrorHandling(`${devUrl}users/user/`, {
        method: "POST",
        body: JSON.stringify(requestBody),
    });

    if (response?.access_token && response?.refresh_token) {
        setTokens(response.access_token, response.refresh_token);
    }
    return response;
};


export const sendForgotEmail = async (email) => {
    return await fetchWithErrorHandling(`${devUrl}users/reset_password/send_link/`, {
        method: "POST",
        body: JSON.stringify({email}),
    });
};

export const setResetPassword = async (token, new_password, confirm_password) => {
    const response = await fetchWithErrorHandling(`${devUrl}users/reset_password/`, {
        method: "POST",
        body: JSON.stringify({ token, new_password, confirm_password }),
    });
    return response;
};

export const getConsultantsList = async (size) => {
    try {
        const response = await fetch(`${devUrl}bitrix/consultants/?published_consultant=YES&page_size=${size}&published_consultants_list=YES`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        return response.json();
    } catch (error) {
        console.error("Error fetching consultants:", error);
    }
};

export const setUserIDLogin = async (user_id) => {
    const response = await fetchWithErrorHandling(`${devUrl}users/user/auth/`, {
        method: "POST",
        body: JSON.stringify({user_id}),
    });

    if (response?.access_token && response?.refresh_token) {
        setTokens(response.access_token, response.refresh_token);
    }
    return response;
};