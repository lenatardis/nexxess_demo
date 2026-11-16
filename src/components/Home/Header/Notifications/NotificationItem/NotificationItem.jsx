import React, {useState} from "react";
import styles from './Notification.item.module.scss';
import dateIcon from "../../../../../assets/icons/dateIcon.svg";

const NotificationItem = ({item}) => {
    let {title = '', notification = '', created_date=''} = item || {};
    return (
        <li className={styles.notification}>
            <h4 className={styles.notification__title}>{title}</h4>
            <p className={styles.notification__text}>{notification}</p>
            <p className={styles.dateWrap}>
                <img src={dateIcon} alt=""/>
                <span>{created_date.slice(0,10)}</span>
            </p>

        </li>
    )
}

export default NotificationItem;