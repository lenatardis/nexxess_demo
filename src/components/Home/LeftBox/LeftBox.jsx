import React from "react";
import styles from './LeftBox.module.scss';
import Navigation from "../Navigation/Navigation";
import AnotherProjects from "./AnotherProjects/AnotherProjects";
import ContactInformation from "./ContactInformation/ContactInformation";
import TrustCreatione from "../RightBox/TrustCreatione/TrustCreatione";
import {isPhoneLayout} from "../../../settings/layout";

const LeftBox = ({isActive, setMenuActives}) => {
    return (
        <div className={isPhoneLayout() && isActive ? `${styles.leftBoxActive} menuActive` : styles.leftBox}>
            <Navigation setMenuActives={setMenuActives}/>
            <AnotherProjects/>
          {/*  <ContactInformation/>*/}
            <TrustCreatione />
        </div>
    )
}

export default LeftBox;