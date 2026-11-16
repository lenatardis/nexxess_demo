import React from "react";
import styles from "../Header.module.scss";
import { useNavigate } from "react-router";

const routeMap = {
    Invoice: "/invoices",
    Service: "/packages",
    FAQ: "/faq",
    Course: "/education",
};

const GlobalSearchResult = ({ list, handleClear }) => {
    const navigate = useNavigate();

    const onSubmit = (type) => {
        if (!routeMap[type]) return;
        handleClear();
        navigate(routeMap[type]);
    };

    return (
        <div className={`${styles.searchResultWrapper} popup`}>
            <ul className={styles.searchResult}>
                {list.map(({ type, title, pk }, index) => (
                    <li
                        key={index}
                        onClick={pk ? () => onSubmit(type) : undefined}
                        className={pk ? styles.clickable : ""}
                    >
                        <span>{type}</span>
                        <p>{title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GlobalSearchResult;
