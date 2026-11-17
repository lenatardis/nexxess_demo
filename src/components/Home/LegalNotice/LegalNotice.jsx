import React from "react";
import {useNavigate} from "react-router";
import styles from './LegalNotice.module.scss';
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import DemoHint from "../../Common/DemoHint/DemoHint";
import backIcon from '../../../assets/icons/backIcon.svg';

// Demo only: the footer of the original linked to the terms and the privacy policy on the
// company's public website. Those documents are not part of the demo – this notice says so.
const LegalNotice = ({title}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.legalNotice}>
            <Breadcrumbs secondPage={{name: title}}/>
            <h3>{title}</h3>
            <div className={styles.hint}>
                <DemoHint>
                    <p>This document is not part of the demo. In the original portal this link opened
                        the {title.toLowerCase()} on the company's public website.</p>
                </DemoHint>
            </div>
            <button className={'darkBlueBtn'} type={'button'} onClick={() => navigate('/')}>
                <img src={backIcon} alt=""/>
                <span>Back to home</span>
            </button>
        </div>
    )
}

export default LegalNotice;
