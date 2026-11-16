import React from "react";
import styles from './ContactInformation.module.scss';

const ContactInformation = () => {
    return (
        <div className={styles.contact}>
            <div className={styles.linkBlock}>
                <a href="tel:+1 (800) 248-3128" className={styles.phone}>+1 (800) 248-3128</a>
                <a href="mailto:info@nexxess.com" className={styles.email}>info@nexxess.com</a>
                <a href="https://maps.app.goo.gl/cHvoVc2m9Vo2cHLi9" className={styles.address}>4001 Airport Fwy, Bedford, TX76021</a>
            </div>
        </div>
    )
}

export default ContactInformation;