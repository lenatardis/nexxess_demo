import React, {useEffect, useState} from "react";
import styles from './Authorization.module.scss';
import LoginForm from "./LoginForm/LoginForm";
import SignInForm from "./SignInForm/SignInForm";
import AuthChanger from "./AuthChanger/AuthChanger";
import DemoHint from "../../Common/DemoHint/DemoHint";
import {demoAccounts} from "../../../settings/data";


const Authorization = () => {
    const [isLogin, setIsLogin] = useState(true);
    // Demo: the demo account picked in the hint; a new object each click, so picking the same one refills the form
    const [demoPick, setDemoPick] = useState(null);
    useEffect(() => setDemoPick(null), [isLogin]);

    return (
        <div className={styles.authorization}>
            {isLogin && (
                <DemoHint>
                    <p>This is a portfolio demo with fictional data. Pick a demo client to fill the form:</p>
                    {demoAccounts.map((account) => (
                        <button key={account.email} type="button" onClick={() => setDemoPick({email: account.email})}>
                            {account.name} <span>– {account.note}</span>
                        </button>
                    ))}
                </DemoHint>
            )}
            <AuthChanger isLogin={isLogin} setIsLogin={setIsLogin}/>
            {isLogin
                ? <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} demoPick={demoPick}/>
                : <SignInForm isLogin={isLogin} setIsLogin={setIsLogin}/>
            }
        </div>
    )
}

export default Authorization;
