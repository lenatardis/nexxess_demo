import React from "react";
import styles from './ServiceStatBox.module.scss';
import ArrowIcon from '../../../../../assets/icons/stat_arr2.svg';

const ServiceStatBox = ({item}) => {
    let {name, hours} = item || {};
    return (
        <div className={styles.stat}>
            <p className={styles.stat__title}>{name}</p>
            <div className={styles.stat__row}>
                <p className={styles.stat__number}>
                    {hours}
                </p>
                <div className={styles.stat__imgWrap}>
                    <img src={ArrowIcon} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default ServiceStatBox;