import React from "react";
import styles from './MobSubHeader.module.scss';
import burger from '../../../assets/icons/burger.svg'
import communication from '../../../assets/icons/communications.svg'
import helloHand from '../../../assets/icons/helloHand.svg'

const MobSubHeader = ({setMenuActives}) => {
    return (
        <div className={styles.mobSubHeader}>
            <div className={styles.mobSubHeader__burgerMenu}>
                <button onClick={() => setMenuActives({navigation: true, communication: false})}>
                    <img src={burger} alt=""/>
                </button>
            </div>
            <div className={styles.welcome}>
                <div className={styles.welcome__img}>
                    <img src={helloHand} alt=""/>
                </div>
                <div className={styles.welcome__info}>
                    <p>December 15</p>
                    <span>Welcome Back, George</span>
                </div>
            </div>
            <div className={styles.mobSubHeader__communicationMenu}>
                <button onClick={() => setMenuActives({navigation: false, communication: true})}>
                    <img src={communication} alt=""/>
                </button>
            </div>
        </div>
    )
}

export default MobSubHeader;