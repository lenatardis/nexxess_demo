import React from "react";
import styles from './PasswordReset.module.scss';
import {useNavigate} from "react-router";

const PasswordReset = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.reset}>
            <p className={styles.reset__title}>Password reset</p>
            <p className={styles.reset__text}>
                We have sent you an e-mail. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes
            </p>
            <div className={styles.actions}>
                <button className={`darkBlueBtn backBtn`} type={'button'} onClick={() => navigate('/')}>
                    <span>Back to log in</span>
                </button>
            </div>
        </div>
    )
}

export default PasswordReset;