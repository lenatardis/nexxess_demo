import React from "react";
import styles from './DemoHint.module.scss';

// Demo only: a small note for things the real portal sent by e-mail (login code, reset link)
// and for the demo accounts. Buttons and links inside it are styled as clickable chips.
const DemoHint = ({children}) => {
    return (
        <div className={styles.demoHint}>
            <span className={styles.demoHint__label}>Demo</span>
            <div className={styles.demoHint__content}>{children}</div>
        </div>
    )
}

export default DemoHint;
