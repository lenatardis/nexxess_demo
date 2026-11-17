import React, { useState, useEffect, useCallback } from "react";
import { Grow, ClickAwayListener, Paper, Box } from "@mui/material";
import styles from "../Header.module.scss";
import notificationIcon from "../../../../assets/icons/notification.svg";
import notificationIconMob from "../../../../assets/icons/notificationMob.svg";
import closeIcon from "../../../../assets/icons/closeDark.svg";
import { getAccessToken } from "../../../../api/localStorage";
import { getNotifications, setReadNotifications } from "../../../../api/header";
import NotificationItem from "./NotificationItem/NotificationItem";
import { useSelector } from "react-redux";
import { getNewNotifications } from "../../../../store/selectors";
import { setNewNotifications } from "../../../../store/account-slice";
import { useAppDispatch } from "../../../../hooks/redux";
import useWindowSize from "../../../../hooks/useWindowSize";
import {isPhoneLayout} from "../../../../settings/layout";

const Notifications = () => {
    const dispatch = useAppDispatch();
    const { width } = useWindowSize();
    const newNotificationsCount = useSelector(getNewNotifications);
    const [showPopup, setShowPopup] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = await getAccessToken();
            const response = await getNotifications(token);
            if (response?.results) {
                setNotifications(response.results);
                const result = await setReadNotifications(token);
                if (result?.is_opened) {
                    dispatch(setNewNotifications(0));
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (showPopup) fetchNotifications();
    }, [showPopup, fetchNotifications]);

    const togglePopup = () => setShowPopup((prev) => !prev);

    return (
        <ClickAwayListener onClickAway={() => setShowPopup(false)}>
            <div className={`${styles.header__menuItem} ${styles.itemBtn} ${styles.notificationBtn}`} title="Notifications">
                <button className={styles.notificationBtn} onClick={togglePopup}>
                    <img src={!isPhoneLayout(width) ? notificationIcon : notificationIconMob} alt="notifications" />
                    {!!newNotificationsCount && (
                        <div className={styles.notificationCount}>
                            <span>{newNotificationsCount}</span>
                        </div>
                    )}
                </button>

                <Grow in={showPopup} timeout={300}>
                    <Box sx={{ position: "absolute", top: "50px", right: 0, zIndex: 10, width: 300 }}>
                        <Paper className={styles.notificationPopup} elevation={4}>
                            <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>
                                <img src={closeIcon} alt="close" />
                            </button>
                            <ul className={styles.notificationPopup__content}>
                                {notifications.length > 0 ? (
                                    notifications.map((item, index) => <NotificationItem item={item} key={index} />)
                                ) : (
                                    <li className={styles.noNotifications}>No new notifications</li>
                                )}
                            </ul>
                        </Paper>
                    </Box>
                </Grow>
            </div>
        </ClickAwayListener>
    );
};

export default Notifications;
