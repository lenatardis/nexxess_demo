import React from "react";
import styles from './Packages.module.scss';
import Package from "./Package/Package";

const Packages = ({list}) => {
    return (
        <div className={styles.packages}>
            {list && list.length && (
                list.map((item, index) => (
                    <Package key={index} index={index} item={item.invoice_id ? item.purchased_services[0] : item} isPurchases={item.invoice_id}/>
                ))
            )}
        </div>
    )
}

export default Packages;