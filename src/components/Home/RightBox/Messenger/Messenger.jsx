import React from "react";
import styles from './Messenger.module.scss';
import Chat from "./Chat/Chat";

const Messenger = ({consultants}) => {
    return (
        <div className={styles.messenger}>
            {consultants.map((item, index) => <Chat item={item} key={index}/>)}
        </div>
    )
}

export default Messenger;