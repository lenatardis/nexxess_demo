import {Route, Routes} from "react-router-dom";
import React from "react";
import Authorization from "./Authorization/Authorization";
import styles from "./Auth.module.scss";
import logo from "../../assets/icons/logo.svg";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ForgotChange from "./ForgotPassword/ForgotChange/ForgotChange";
import Verification from "./Authorization/LoginForm/Verification";
import AuthFromLink from "./AuthFromLink/AuthFromLink";


const Auth = () => {
    return (
        <div className={styles.auth}>
            <div className={styles.logo}>
                <img className={styles.logo__image} src={logo} alt="logo"/>
            </div>
            <Routes>
                <Route path={'/'} element={<Authorization />}/>
                <Route path={'/verification'} element={<Verification />}/>
                <Route path={'/forgotPassword'} element={<ForgotPassword />} />
                <Route path={'/changePassword'} element={<ForgotChange />} />
                <Route path={'/user_auth'} element={<AuthFromLink/>}/>
            </Routes>
        </div>

    )
}

export default Auth;