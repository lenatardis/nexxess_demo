import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {login, setUserIDLogin} from "../../../api/authApi";
import {setAuth, setEmail} from "../../../store/account-slice";
import {useAppDispatch} from "../../../hooks/redux";

const AuthFromLink = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            const queryParams = new URLSearchParams(location.search);
            const userFromUrl = queryParams.get('user');
            if (!userFromUrl) {
                console.log('no user id')
                return;
            }
            setUser(userFromUrl);
            setIsLoading(true);
            try {
                const response = await setUserIDLogin(parseInt(userFromUrl));
                if (response?.access_token && response?.refresh_token) {
                    dispatch(setAuth(true));
                    navigate("/");
                } else {
                    console.error("Invalid login response", response);
                    console.log(response.errors[0].detail);
                    alert(response.errors[0].detail);
                }
            } catch (error) {
                console.error("Login failed", error);
            } finally {
                setIsLoading(false);
            }

        }
        authenticateUser();
    }, [location.search]);

    return (
        <div>
            <p>Authorizing user{user ? ` ${user}` : ""}...</p>
            {isLoading && <p>Loading...</p>}
        </div>
    )
}

export default AuthFromLink;