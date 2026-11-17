import React from "react";
import styles from './ContactInformation.module.scss';

const ContactInformation = () => {
    return (
        <div className={styles.contact}>
            <div className={styles.linkBlock}>
                {/* Demo: a fictional phone and e-mail – not the company's real contacts. 555-0100…0199 is reserved for
                    fiction only in geographic area codes (a toll-free 800-555 number can be real), .example is a
                    reserved domain. */}
                <a href="tel:+12025550142" className={styles.phone}>+1 (202) 555-0142</a>
                <a href="mailto:info@nexxess.example" className={styles.email}>info@nexxess.example</a>
                <a href="https://maps.app.goo.gl/cHvoVc2m9Vo2cHLi9" className={styles.address}>4001 Airport Fwy, Bedford, TX76021</a>
            </div>
        </div>
    )
}

export default ContactInformation;