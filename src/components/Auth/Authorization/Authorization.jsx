import React, {useState} from "react";
import styles from './Authorization.module.scss';
import LoginForm from "./LoginForm/LoginForm";
import SignInForm from "./SignInForm/SignInForm";
import AuthChanger from "./AuthChanger/AuthChanger";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {googleAuthToken} from "../../../settings/data";


const Authorization = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.authorization}>
            <AuthChanger isLogin={isLogin} setIsLogin={setIsLogin}/>
            {isLogin
                ? <GoogleOAuthProvider clientId={googleAuthToken}>
                    <LoginForm isLogin={isLogin} setIsLogin={setIsLogin}/>
                </GoogleOAuthProvider>
                : <SignInForm isLogin={isLogin} setIsLogin={setIsLogin}/>
            }
        </div>
    )
}

export default Authorization;