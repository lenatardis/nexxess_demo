import React from "react";
import styles from './AuthChanger.module.scss';


const AuthChanger = ({isLogin, setIsLogin}) => {
    return (
        <div className={styles.authChanger}>
            <div className={styles.activeTab}>
                <p>{isLogin ? 'Client Log In' : 'Client Registration'}</p>
            </div>
            <div className={styles.tab}>
                <button onClick={() => setIsLogin(!isLogin)}>
                    <p>{isLogin ? 'Client Registration' : 'Client Log In'}</p>
                </button>
            </div>
        </div>
    )
}

export default AuthChanger;