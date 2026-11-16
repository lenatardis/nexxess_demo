import React from "react";
import styles from "./Learns.module.scss";
import arrow from '../../../../assets/icons/arrowYelow.svg';


const Learn = ({item, index,  img1, img2, img3}) => {

    const handleIndex = (value) => {
        if (value % 3 === 0) {
            return img1;
        } else if (index % 3 === 1) {
            return img2;
        } else if (index % 3 === 2) {
            return img3;
        }
    }
    return (
        <div className={styles.learn}>
            <div className={styles.learn__info}>
                <div>
                    <img src={handleIndex(index)} alt=""/>
                </div>
                <div className={styles.learn__infoText}>
                    <p>{item.title}</p>
                    <span>{item.text}</span>
                </div>
            </div>
            <div>
                <img src={arrow} alt=""/>
            </div>
        </div>
    )
}

export default Learn;