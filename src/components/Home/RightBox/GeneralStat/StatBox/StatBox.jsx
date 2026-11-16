import React from "react";
import styles from "./StatBox.module.scss";
import StatIcon from "../../../../../assets/icons/stat_arr.svg";
import {useNavigate} from "react-router";

const titleTextMap = [
    { title: "Services", text: "available" },
    { title: "My Purchases", text: "new reply" },
    { title: "Request Help", text: "Just Click" },
    { title: "Invoices", text: "new invoices" },
];

const StatBox = ({ index = 0, item = {} }) => {
    const { number } = item;
    const { title, text } = titleTextMap[index] || { title: "Unknown", text: "Unknown" };

    let navigate = useNavigate();

    const triggerChatClick = (e) => {
        e.preventDefault();
        const chatButton = document.querySelector(".b24-widget-button-openline_livechat");
        if (chatButton) chatButton.click();
    };


    const isServices = index === 0;
    const isPurchases = index === 1;
    const isRequestHelp = index === 2;
    const isInvoices = index === 3;

    const handlePurchases = () => {
        navigate('/myPurchases')
    }

    const handleInvoices = () => {
        navigate('/invoices')
    }

    return (
        <div
            className={`${styles.stat} ${isRequestHelp ? styles.stat__comingSoonBox : ""} ${isServices ? styles.notLink : ""}`}
            onClick={isRequestHelp ? triggerChatClick : isPurchases?handlePurchases : (isInvoices ? handleInvoices : null)}
        >
            <div>
                <p className={styles.stat__title}>{title}</p>
                <p className={styles.stat__row}>
                    {!isRequestHelp && (number || number === 0) && <span className={styles.stat__number}>{number}</span>}
                    <span className={`${styles.stat__text} ${isRequestHelp ? styles.stat__comingSoonText : ""}`}>
            {text}
          </span>
                </p>
            </div>
            {!isServices && <div className={styles.stat__imgWrap}>
                <img src={StatIcon} alt="Stat Icon" />
            </div>}
        </div>
    );
};

export default StatBox;
