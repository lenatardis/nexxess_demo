import React from "react";
import styles from './Packages.module.scss';
import Package from "./Package/Package";

// Demo fix: `isPurchases` from My Purchases hides "Buy" on services already bought (that page passes the
// flattened services, which carry no invoice_id)
const Packages = ({list, isPurchases = false}) => {
    return (
        <div className={styles.packages}>
            {list && list.length && (
                list.map((item, index) => (
                    <Package key={index} index={index} item={item.invoice_id ? item.purchased_services[0] : item} isPurchases={isPurchases || item.invoice_id}/>
                ))
            )}
        </div>
    )
}

export default Packages;