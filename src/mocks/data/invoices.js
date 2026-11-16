// Invoices of a customer: buying a service creates an unpaid invoice, paying it makes it a
// purchase. Seed records carry `days_ago` (see dates.js), invoices created in the demo a real
// `begin_date`. Price and hours always come from the catalogue.
import { dateFromOffset } from './dates';
import { perUser } from './perUser';
import { findService } from './services';

export const PAID = 'Paid';
export const UNPAID = 'Unpaid';

// An invoice is due two weeks after it is issued.
const DUE_DAYS = 14;
// Noon UTC: the invoices table formats the date in the visitor's time zone – the day must not shift.
const NOON = '12:00:00';

const seedByStage = {
    new: [{ invoice_id: 10431, service_id: 201, days_ago: 3, status: PAID }],
    progress: [
        { invoice_id: 10388, service_id: 201, days_ago: 45, status: PAID },
        { invoice_id: 10397, service_id: 102, days_ago: 31, status: PAID },
        { invoice_id: 10419, service_id: 202, days_ago: 17, status: PAID },
        { invoice_id: 10436, service_id: 103, days_ago: 2, status: UNPAID },
    ],
    finished: [
        { invoice_id: 10172, service_id: 201, days_ago: 120, status: PAID },
        { invoice_id: 10175, service_id: 101, days_ago: 118, status: PAID },
        { invoice_id: 10266, service_id: 102, days_ago: 75, status: PAID },
        { invoice_id: 10341, service_id: 103, days_ago: 40, status: PAID },
    ],
};

export const invoices = perUser('invoices', seedByStage);

const pad = (value) => String(value).padStart(2, '0');
const addDays = (isoDate, days) => {
    const date = new Date(`${isoDate.slice(0, 10)}T12:00:00`);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${NOON}Z`;
};

/** An invoice as the backend returned it, plus the service it is for. */
export const toInvoice = (record) => {
    const { service, hours } = findService(record.service_id);
    const begin_date = record.begin_date || dateFromOffset(record.days_ago, NOON);
    return {
        invoice_id: record.invoice_id,
        bought_time: hours,
        begin_date,
        deadline: addDays(begin_date, DUE_DAYS),
        price: service.price,
        status: record.status,
        service,
    };
};

/** Newest first. */
export const invoicesOf = (user) => [...invoices.of(user)].sort((a, b) => b.invoice_id - a.invoice_id).map(toInvoice);

export const findInvoice = (user, invoiceId) =>
    invoices.of(user).find((record) => record.invoice_id === Number(invoiceId)) || null;

/** Buying: one unpaid invoice per service – buying the same service again returns to it. */
export const openInvoice = (user, serviceId) => {
    const list = invoices.of(user);
    let record = list.find((item) => item.service_id === Number(serviceId) && item.status === UNPAID);
    if (!record) {
        const lastId = list.reduce((max, item) => Math.max(max, item.invoice_id), 10500);
        record = { invoice_id: lastId + 1, service_id: Number(serviceId), begin_date: dateFromOffset(0, NOON), status: UNPAID };
        list.push(record);
        invoices.save();
    }
    return record;
};

export const payInvoice = (record) => {
    record.status = PAID;
    invoices.save();
};
