import React from "react";
import styles from './ContactInformation.module.scss';

const ContactInformation = () => {
    return (
        <div className={styles.contact}>
            <div className={styles.linkBlock}>
                {/* Demo: a fictional phone (555-01xx) and e-mail (reserved .example domain) – not the company's real contacts. */}
                <a href="tel:+18005550142" className={styles.phone}>+1 (800) 555-0142</a>
                <a href="mailto:info@nexxess.example" className={styles.email}>info@nexxess.example</a>
                <a href="https://maps.app.goo.gl/cHvoVc2m9Vo2cHLi9" className={styles.address}>4001 Airport Fwy, Bedford, TX76021</a>
            </div>
        </div>
    )
}

export default ContactInformation;