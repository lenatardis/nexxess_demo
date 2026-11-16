import React from "react";
import styles from './GeneralStat.module.scss';
import StatBox from "./StatBox/StatBox";

const GeneralStat = ({statics}) => {
    const data = [
        { number: statics?.all_services_count ?? null },
        { number: statics?.purchased_services_count ?? null },
        { number: statics?.user_all_tickets_count ?? null },
        { number: statics?.user_all_invoices_count ?? null }
    ];
    return (
        <div className={styles.grid}>
            {data && data.length && (
                data.map((el, index) => <StatBox key={index} index={index} item={el}/>)
            )}
        </div>
    )
}

export default GeneralStat;