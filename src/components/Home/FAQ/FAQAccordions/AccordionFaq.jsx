import React, {useState} from "react";
import DOMPurify from 'dompurify';
import styles from './FAQAccordions.module.scss';
import arrow from '../../../../assets/icons/accordionArrow.svg';

const AccordionFaq = ({item}) => {
    const [isShow, setIsShow] = useState(false);
    let {question = '', answer = ''} = item || {};
    return (
        <div className={styles.accordion}>
            <div className={styles.accordion__header} onClick={() => setIsShow(!isShow)}>
                <p>{question}</p>
                <img className={isShow ? styles.arrowActive : styles.arrow} src={arrow} alt=""/>
            </div>
            <div className={isShow ? styles.accordion__content : styles.accordion__contentHide}>
                <p dangerouslySetInnerHTML={{__html:  DOMPurify.sanitize(answer)}}></p>
            </div>
        </div>
    )
}

export default AccordionFaq;