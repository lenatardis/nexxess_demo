import React from "react";
import styles from './LeftBox.module.scss';
import Navigation from "../Navigation/Navigation";
import AnotherProjects from "./AnotherProjects/AnotherProjects";
import ContactInformation from "./ContactInformation/ContactInformation";
import TrustCreatione from "../RightBox/TrustCreatione/TrustCreatione";

const LeftBox = ({isActive, setMenuActives}) => {
    return (
        <div className={window.innerWidth < 768 && isActive ? `${styles.leftBoxActive} menuActive` : styles.leftBox}>
            <Navigation setMenuActives={setMenuActives}/>
            <AnotherProjects/>
          {/*  <ContactInformation/>*/}
            <TrustCreatione />
        </div>
    )
}

export default LeftBox;