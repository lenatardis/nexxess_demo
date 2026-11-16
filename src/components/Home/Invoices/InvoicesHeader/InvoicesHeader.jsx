import React, {useState} from "react";
import styles from './InvoicesHeader.module.scss';
import sortIcon from '../../../../assets/icons/sort.svg';

const InvoicesHeader = ({list, setList}) => {
    const [state, setState] = useState({
        receipt: false, id: true, createDate: false, dueDate: false, total: false, status: false
    })

    const onSortById = (value) => {
        switch(value) {
            case 'receipt':
                state.receipt
                    ? setList([...list].sort((a, b) => b.bought_time - a.bought_time))
                    : setList([...list].sort((a, b) => a.bought_time - b.bought_time))
                setState((prevState) => ({...prevState, receipt: !prevState.receipt}));
                break;
            case 'id':
                state.id
                    ? setList([...list].sort((a, b) => b.invoice_id - a.invoice_id))
                    : setList([...list].sort((a, b) => a.invoice_id - b.invoice_id))
                setState((prevState) => ({...prevState, id: !prevState.id}));
                break;
            case 'createDate':
                state.createDate
                    ? setList([...list].sort((a, b) => new Date(a.begin_date) - new Date(b.begin_date)))
                    : setList([...list].sort((a, b) => new Date(b.begin_date) - new Date(a.begin_date)))
                setState((prevState) => ({...prevState, createDate: !prevState.createDate}));
                break;
            case 'dueDate':
                state.dueDate
                    ? setList([...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)))
                    : setList([...list].sort((a, b) => new Date(b.deadline) - new Date(a.deadline)))
                setState((prevState) => ({...prevState, dueDate: !prevState.dueDate}));
                break;
            case 'total':
                state.total
                    ? setList([...list].sort((a, b) => b.price - a.price))
                    : setList([...list].sort((a, b) => a.price - b.price))
                setState((prevState) => ({...prevState, total: !prevState.total}));
                break;
            case 'status':
                state.status
                    ? setList([...list].sort((a, b) => b.status.localeCompare(a.status)))
                    : setList([...list].sort((a, b) => a.status.localeCompare(b.status)))
                setState((prevState) => ({...prevState, status: !prevState.status}));
                break;
            default:
                break;
        }
    }
    return (
        <div className={list && list.length === 0 ? styles.trustProcessHeaderHide : styles.trustProcessHeader}>
            <button onClick={() => onSortById('receipt')}>
                <span>Receipt</span>
            </button>
            <button onClick={() => onSortById('id')}>
                <span>Invoice ID</span>
                {window.innerWidth >= 768 && (
                    <img src={sortIcon} alt=""/>
                )}
            </button>
            <button onClick={() => onSortById('createDate')}>
                <span>Invoice Date</span>
                {window.innerWidth >= 768 && (
                    <img src={sortIcon} alt=""/>
                )}
            </button>
            <button onClick={() => onSortById('dueDate')}>
                <span>Due Date</span>
                {window.innerWidth >= 768 && (
                    <img src={sortIcon} alt=""/>
                )}
            </button>
            <button onClick={() => onSortById('total')}>
                <span>Total</span>
                {window.innerWidth >= 768 && (
                    <img src={sortIcon} alt=""/>
                )}
            </button>
            <button onClick={() => onSortById('status')}>
                <span>Status</span>
                {window.innerWidth >= 768 && (
                    <img src={sortIcon} alt=""/>
                )}
            </button>
        </div>
    )
}

export default InvoicesHeader;