import React from "react";
import styles from './PasswordReset.module.scss';
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import DemoHint from "../../../Common/DemoHint/DemoHint";

const PasswordReset = ({demoResetToken}) => {
    const navigate = useNavigate();

    return (
        <>
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
        {demoResetToken && (
            <div className={styles.demo}>
                <DemoHint>
                    <p>No e-mail is sent in the demo. This is the link the e-mail would contain:</p>
                    <Link to={`/changePassword?token=${demoResetToken}`}>Open the reset link</Link>
                </DemoHint>
            </div>
        )}
        </>
    )
}

export default PasswordReset;