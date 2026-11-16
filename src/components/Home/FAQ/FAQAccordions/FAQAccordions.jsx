import React from "react";
import styles from './FAQAccordions.module.scss';
import AccordionFaq from "./AccordionFaq";

const FAQAccordions = ({list}) => {

    return (
        <div className={styles.faqAccordions}>
            {list && list.length && (
                list.map((item, index) => (
                    <AccordionFaq key={index} item={item} />
                ))
            )}
        </div>
    )
}

export default FAQAccordions;