import React from "react";
import styles from './Navigation.module.scss';
import {useLocation, useNavigate} from "react-router";
import close from '../../../assets/icons/closeWhite.svg';
import {isPhoneLayout} from "../../../settings/layout";

const Navigation = ({setMenuActives}) => {
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const navigations = [
        {name: 'Home', url: '/', isDisabled: false},
        {name: 'Trust Process', url: '/trustProcess', isDisabled: false},
        {name: 'My Purchases', url: '/myPurchases', isDisabled: false},
        {name: 'My Files', url: '/myFiles', isDisabled: false},
        {name: 'Packages', url: '/packages', isDisabled: false},
        {name: 'Trusts', url: '/trusts', isDisabled: false},
     /*   {name: 'New Tickets', url: '/newTickets', isDisabled: true},
        {name: 'My Requests', url: '/myRequests', isDisabled: true},
        {name: 'Create Request', url: '/createRequest', isDisabled: true},*/
        {name: 'Invoices', url: '/invoices', isDisabled: false},
        {name: 'Education', url: '/education', isDisabled: true},
        {name: 'FAQ', url: '/faq', isDisabled: false},
    ];

    const onClose = () => {
        setMenuActives({navigation: false, communication: false})
    }

    const onNavigate = (item) => {
        if (item && !item.disabled) {
            navigate(item.url);
            if (isPhoneLayout()) {
                onClose()
            }
        }
    }


    return (
        <div className={styles.navigationWrapper}>
            <ul className={styles.navigation}>
                {navigations && navigations.length && (
                    navigations.map((item, index) => (
                        <li onClick={() => onNavigate(item)} className={pathname === item.url ? styles.active : null} key={index}
                            style={item.isDisabled ? {opacity: '0.4', pointerEvents: 'none', cursor: 'default'} : null}>
                            <span>{item.name}</span>
                        </li>
                    ))
                )}
            </ul>
            {isPhoneLayout() && (
                <div className={styles.close}>
                    <button onClick={() => onClose()}>
                        <img src={close} alt=""/>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Navigation;