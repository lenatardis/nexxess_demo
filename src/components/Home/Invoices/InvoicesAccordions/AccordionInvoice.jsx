import React, {useState} from "react";
import styles from './InvoicesAccordions.module.scss';
import {getAccessToken} from "../../../../api/localStorage";
import {getInvoicesPdf} from "../../../../api/pagesApi";
import Preloader from "../../../Common/Preloader/Preloader";

const AccordionInvoice = ({item}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDate = (value) => {
        const date = new Date(value);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const onSelectInvoice = (invoice) => {
        setIsLoading(true)
        if (invoice?.invoice_id) {
            getAccessToken().then((token) => {
                getInvoicesPdf(token, invoice.invoice_id).then((result) => {
                    if (result?.file_public_url) {
                        window.open(result.file_public_url, '_blank', 'noopener,noreferrer');
                    }
                }).catch(error => {
                    console.error('Error fetching invoice PDF:', error);
                }).finally(() => setIsLoading(false));
            })
        }
    };

    return (
        <div className={styles.accordion} onClick={() => onSelectInvoice(item)}>
            <div className={styles.contentList}>
                <div>
                    <p>{item.bought_time}</p>
                </div>
                <div>
                    <p>{item.invoice_id}</p>
                </div>
                <div>
                    <p>{handleDate(item.begin_date)}</p>
                </div>
                <div>
                    <p>{handleDate(item.deadline)}</p>
                </div>
                <div>
                    <p>{item.price}</p>
                </div>
                <div>
                    <p className={styles.status}>
                        <span>{item.status}</span>
                    </p>
                </div>
            </div>
            {isLoading && (
                <Preloader />
            )}
        </div>
    )
}

export default AccordionInvoice;