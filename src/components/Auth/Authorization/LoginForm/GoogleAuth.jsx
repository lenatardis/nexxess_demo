import React from "react";
import styles from "../Authorization.module.scss";
import googleIcon from "../../../../assets/icons/googleIcon.svg";
import {useGoogleLogin} from "@react-oauth/google";
import {getGoogleProfile, setGoogleLogin} from "../../../../api/authApi";
import {setAuth} from "../../../../store/account-slice";
import {useAppDispatch} from "../../../../hooks/redux";
import {useNavigate} from "react-router";


const GoogleAuth = ({setIsLoading}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const onGoogleLogin = useGoogleLogin({
        onSuccess: credentialResponse => {
            setIsLoading(true);
            if (credentialResponse && credentialResponse.access_token) {
                getGoogleProfile(credentialResponse.access_token).then((result => {
                    if (result && result.email) {
                        setGoogleLogin(result.email, result.given_name, result.family_name, result.name).then(response => {
                            if (response && response.access_token && response.refresh_token) {
                                dispatch(setAuth(true));
                                navigate('/');
                            }
                        })
                    }
                })).finally(() => setTimeout(() => setIsLoading(false), 300)
                )
            } else setIsLoading(false)
        },
    });

    return (
        <button className={styles.googleAuth} type='button' onClick={() => onGoogleLogin()}>
            <img className={styles.googleAuth__icon} src={googleIcon} alt=""/>
            <span>Continue with Google</span>
        </button>
    )
}

export default GoogleAuth;