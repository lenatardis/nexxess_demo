import React from "react";
import styles from './AnotherProjects.module.scss';

const AnotherProjects = () => {
    return (
        <div className={styles.another}>
            <p>Other Projects</p>
            <div className={styles.soon}>
                <span>Coming soon</span>
            </div>
        </div>
    )
}

export default AnotherProjects;