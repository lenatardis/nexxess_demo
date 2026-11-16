import React from "react";
import styles from "../Authorization.module.scss";
import googleIcon from "../../../../assets/icons/googleIcon.svg";
import {setGoogleLogin} from "../../../../api/authApi";
import {setAuth} from "../../../../store/account-slice";
import {useAppDispatch} from "../../../../hooks/redux";
import {useNavigate} from "react-router";
import {demoGoogleProfile} from "../../../../settings/data";


const GoogleAuth = ({setIsLoading}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Demo: no Google popup – the demo profile takes the place of Google's userinfo answer
    const onGoogleLogin = () => {
        setIsLoading(true);
        const result = demoGoogleProfile;
        setGoogleLogin(result.email, result.given_name, result.family_name, result.name).then(response => {
            if (response && response.access_token && response.refresh_token) {
                dispatch(setAuth(true));
                navigate('/');
            }
        }).finally(() => setTimeout(() => setIsLoading(false), 300))
    };

    return (
        <button className={styles.googleAuth} type='button' onClick={() => onGoogleLogin()}>
            <img className={styles.googleAuth__icon} src={googleIcon} alt=""/>
            <span>Continue with Google</span>
        </button>
    )
}

export default GoogleAuth;
