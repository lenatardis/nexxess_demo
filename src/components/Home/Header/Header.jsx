import React from "react";
import styles from './Header.module.scss';
import userIcon from '../../../assets/icons/user.svg';
import userIconMob from '../../../assets/icons/userMob.svg';
import {useNavigate} from "react-router";
import logo from '../../../assets/icons/logo.svg';
import Logout from "./Logout/Logout";
import Notifications from "./Notifications/Notifications";
import GlobalSearch from "./GlobalSearch/GlobalSearch";
import usePhoneLayout from "../../../hooks/usePhoneLayout";

const Header = () => {
    const navigate = useNavigate();
    const isPhone = usePhoneLayout();

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <button className={styles.logo} onClick={() => navigate('/')}>
                    <img className={styles.logo__image} src={logo} alt="logo"/>
                </button>
                <div className={styles.header__menu}>
                    <GlobalSearch />
                    <Notifications />
                    <div className={`${styles.header__menuItem} ${styles.itemBtn}`} title="Profile">
                        <button onClick={() => navigate('/personalInformation')}  className={styles.btnProfile}>
                            <img src={!isPhone ? userIcon : userIconMob} alt="user"/>
                        </button>
                    </div>
                    <Logout />
                </div>
            </div>
        </div>
    )
}

export default Header;