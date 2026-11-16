import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../../hooks/redux";
import { setAuth } from "../../../../store/account-slice";
import { logout } from "../../../../api/localStorage";
import styles from "../Header.module.scss";

import logoutIcon from "../../../../assets/icons/logout.svg";
import closeIcon from "../../../../assets/icons/closeDark.svg";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isShowPopup, setIsShowPopup] = useState(false);

    const togglePopup = useCallback((e) => {
        e.preventDefault();
        const closeButton = document.querySelector(".bx-livechat-control-btn.bx-livechat-control-btn-close");
        if (closeButton) closeButton.click();
        setIsShowPopup((prev) => !prev);
    }, []);

    const handleLogout = useCallback(async () => {
        const res = await logout();
        if (res === "ok") {
            dispatch(setAuth(false));
            navigate("/");
        }
    }, [dispatch, navigate]);

    return (
        <div className={`${styles.header__menuItem} ${styles.itemBtn} ${styles.logout}`} title="Log Out">
            <button onClick={togglePopup} className={styles.btnLogout}>
                <img src={logoutIcon} alt="logout" />
            </button>

            {isShowPopup && (
                <>
                    <span className={styles.shadowActive} />
                    <div className={styles.popupActive} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.popupWrap}>
                            <button className={styles.closeBtn} onClick={togglePopup}>
                                <img src={closeIcon} alt="close" />
                            </button>
                            <h3 className={styles.popup__title}>
                                Are you sure <br className={styles.mobLine} /> you want to log out?
                            </h3>
                            <div className={styles.btnRow}>
                                <button className={styles.cancelBtn} onClick={togglePopup}>
                                    <span>Cancel</span>
                                </button>
                                <button className={styles.popupLogoutBtn} onClick={handleLogout}>
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Logout;
