import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import styles from './DemoPayment.module.scss';
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import DemoHint from "../../Common/DemoHint/DemoHint";
import Preloader from "../../Common/Preloader/Preloader";
import {getAccessToken} from "../../../api/localStorage";
import {getDemoPayment, payDemoInvoice} from "../../../api/pagesApi";

// Demo only: stands in for the payment provider the original portal sent the customer to
// (`transaction_url`). "Pay" marks the invoice as paid, "Cancel" leaves it unpaid. Like a real
// provider, it returns to the portal with a full page load.
const DemoPayment = () => {
    const [searchParams] = useSearchParams();
    const invoiceId = searchParams.get('invoice');
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        getAccessToken()
            .then((token) => getDemoPayment(token, invoiceId))
            .then((response) => {
                if (response?.invoice_id) setInvoice(response);
            })
            .finally(() => setIsLoading(false));
    }, [invoiceId]);

    const backTo = (path) => {
        window.location = `${process.env.PUBLIC_URL}${path}`;
    };

    const onPay = () => {
        setIsPaying(true);
        getAccessToken()
            .then((token) => payDemoInvoice(token, invoiceId))
            .then((response) => {
                if (response?.invoice_id) backTo('/myPurchases');
                else setIsPaying(false);
            })
            .catch(() => setIsPaying(false));
    };

    const isPaid = invoice?.status === 'Paid';

    return (
        <div className={styles.demoPayment}>
            <Breadcrumbs secondPage={{url: '/demoPayment', name: 'Payment'}}/>
            <h3>Payment</h3>
            <div className={styles.hint}>
                <DemoHint>
                    <p>The original portal opened a payment provider at this step. This page stands in for it:
                        no card is needed and no real payment is made.</p>
                </DemoHint>
            </div>
            {isLoading ? (
                <Skeleton variant="rounded" width="100%" height={260} sx={{borderRadius: '22px'}}/>
            ) : invoice ? (
                <div className={styles.box}>
                    <h4>{invoice.service?.name}</h4>
                    <dl className={styles.details}>
                        <div>
                            <dt>Invoice ID</dt>
                            <dd>{invoice.invoice_id}</dd>
                        </div>
                        <div>
                            <dt>Status</dt>
                            <dd>{invoice.status}</dd>
                        </div>
                        <div>
                            <dt>Total</dt>
                            <dd className={styles.total}>${invoice.price}</dd>
                        </div>
                    </dl>
                    {isPaid ? (
                        <div className={styles.actions}>
                            <button className={'darkBlueBtn'} type={'button'} onClick={() => backTo('/myPurchases')}>
                                <span>My Purchases</span>
                            </button>
                        </div>
                    ) : (
                        <div className={styles.actions}>
                            <button className={'darkBlueBtn'} type={'button'} onClick={() => backTo('/invoices')}>
                                <span>Cancel</span>
                            </button>
                            <button className={'darkYellowBtn'} type={'button'} onClick={onPay}>
                                <span>Pay ${invoice.price}</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.box}>
                    <h4>Invoice not found</h4>
                    <div className={styles.actions}>
                        <button className={'darkBlueBtn'} type={'button'} onClick={() => backTo('/packages')}>
                            <span>Back to packages</span>
                        </button>
                    </div>
                </div>
            )}
            {isPaying && <Preloader/>}
        </div>
    )
}

export default DemoPayment;
