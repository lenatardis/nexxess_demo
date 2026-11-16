import { getAccessToken } from "./localStorage";
import { getUserInfo } from "./profileApi";

export const fetchUserData = async () => {
    try {
        const token = await getAccessToken();
        if (!token) return false;

        const result = await getUserInfo(token);
        return result?.id ? result : false;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return false;
    }
};