import React from "react";
import styles from './Footer.module.scss';
import FacebookIcon from '../../assets/icons/facebook.svg';
import XIcon from '../../assets/icons/x.svg';
import linkedInIcon from '../../assets/icons/linkedIn.svg';
import YouTubeIcon from "../../assets/icons/youtube.svg";
import InfoIcon from "../../assets/icons/info.svg";
import LinkIcon from "../../assets/icons/link.svg";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import ContactInformation from "../Home/LeftBox/ContactInformation/ContactInformation";
import {Link} from "react-router-dom";


const Footer = () => {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.footer}>
                <div className={styles.footer__copyrightBox}>
                    <p className={styles.footer__copyright}>Copyright 2000-2025, Nexxess International, <br/>
                        All Rights Reserved</p>
                    <p className={styles.footer__privacy}><Link to="/terms">TERMS</Link> AND <Link to="/privacy">PRIVACY</Link></p>
                </div>
                <div className={styles.footer__social}>
                    <a href="https://www.facebook.com/nexxessbusinessadvisors" target="_blank" className={styles.fb}></a>
                    <a href="https://x.com/nexxessintl" target="_blank" className={styles.x}></a>
                    <a href="https://www.linkedin.com/company/nexxess/" target="_blank" className={styles.linkedIn}></a>
                    <a href="https://www.youtube.com/@nexxess" target="_blank" className={styles.youtube}></a>
                </div>
               {/* <div className={styles.footer__refer}>
                    <div className={styles.footer__referInfo}>
                        <span>Refer</span>
                        <img src={InfoIcon} alt=""/>
                    </div>
                    <CopyToClipboard text="referral_link">
                        <button className={styles.footer__referLink}>
                            <img src={LinkIcon} alt=""/>
                            <span>Sharable link</span>
                        </button>
                    </CopyToClipboard>
                </div>*/}
                <ContactInformation/>
            </div>
        </div>
    )
}

export default Footer;