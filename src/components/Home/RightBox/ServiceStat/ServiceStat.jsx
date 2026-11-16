import React from "react";
import styles from './ServiceStat.module.scss';
import ServiceStatBox from "./ServiceStatBox/ServiceStatBox";

const ServiceStat = ({services}) => {
    return (
        <div className={styles.grid}>
            {services && services.length ? (
                services.map((el, index) => <ServiceStatBox key={index} item={el}/>)
            ) : null}
        </div>
    )
}

export default ServiceStat;