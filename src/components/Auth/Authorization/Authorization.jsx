import React, {useState} from "react";
import styles from './Authorization.module.scss';
import LoginForm from "./LoginForm/LoginForm";
import SignInForm from "./SignInForm/SignInForm";
import AuthChanger from "./AuthChanger/AuthChanger";


const Authorization = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.authorization}>
            <AuthChanger isLogin={isLogin} setIsLogin={setIsLogin}/>
            {isLogin
                ? <LoginForm isLogin={isLogin} setIsLogin={setIsLogin}/>
                : <SignInForm isLogin={isLogin} setIsLogin={setIsLogin}/>
            }
        </div>
    )
}

export default Authorization;
