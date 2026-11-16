import React from "react";
import styles from './InvoicesAccordions.module.scss';
import AccordionInvoice from "./AccordionInvoice";


const InvoicesAccordions = ({list}) => {
    return (
        <div className={styles.processAccordions}>
            {list && list.length ? (
                list.map((item, index) => (
                    <AccordionInvoice key={index} item={item} />
                ))
            ) : null}
        </div>
    )
}

export default InvoicesAccordions;