import React from "react";
import styles from "./Preloader.module.scss";
import classNames from "classnames";

const Preloader = ({ auth = false }) => {
    return (
        <div className={classNames(styles.wrapper, { [styles.authBg]: auth })}>
            <div className={styles.preloaderWrapper}>
                <div className={styles.spinner}>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={styles.circle} />
                    ))}
                </div>
                <h2 className={styles.preloaderText}>NEXXEESS</h2>
            </div>
        </div>
    );
};

export default Preloader;
