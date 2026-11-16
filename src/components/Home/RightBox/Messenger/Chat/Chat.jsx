import React, { useCallback } from "react";
import styles from "../Messenger.module.scss";
import messageIcon from "../../../../../assets/icons/massageIcon.svg";
import userIcon from "../../../../../assets/icons/user.svg";

const Chat = ({ item }) => {
    const {
        avatar,
        first_name = "Unknown",
        last_name = "Unknown",
        work_position,
    } = item?.consultant_info || {};

    const triggerChatClick = useCallback((e) => {
        e.preventDefault();
        document.querySelector(".b24-widget-button-openline_livechat")?.click();
    }, []);

    return (
        <div className={styles.chat}>
            <div id="chatCustom" className={styles.chat__user}>
                {avatar ? (
                    <img className={styles.avatar} src={avatar} alt="User Avatar" />
                ) : (
                    <div className={styles.chat__userIcon}>
                        <img src={userIcon} alt="Default User" />
                    </div>
                )}
                <div className={styles.chat__userInfo}>
                    <p>{first_name} {last_name}</p>
                    {work_position && <span>{work_position}</span>}
                </div>
            </div>
            <button className={styles.chat__send} onClick={triggerChatClick}>
                <img src={messageIcon} alt="Send Message" />
            </button>
        </div>
    );
};

export default Chat;
