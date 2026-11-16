// Header notifications. Seed records carry `days_ago` (see dates.js); records added while the demo
// is used carry a real `created_date`.
import { dateFromOffset } from './dates';
import { nextId } from '../db';
import { perUser } from './perUser';

const seedByStage = {
    new: [
        { id: 2, days_ago: 0, is_opened: false, title: 'Consultant assigned', notification: 'Your consultant has been assigned and will contact you to plan the first steps of your trust.' },
        { id: 1, days_ago: 1, is_opened: false, title: 'Welcome to Nexxess', notification: 'Your client portal is ready. Here you can follow your trust, purchases, invoices and files.' },
    ],
    progress: [
        { id: 6, days_ago: 0, is_opened: false, title: 'New comment', notification: 'Your consultant left a comment in the trust process. Please review it.' },
        { id: 5, days_ago: 2, is_opened: false, title: 'New invoice', notification: 'A new invoice has been issued and is waiting for payment.' },
        { id: 4, days_ago: 6, is_opened: false, title: 'New file', notification: 'A new document has been shared with you in My Files.' },
        { id: 3, days_ago: 14, is_opened: true, title: 'Stage completed', notification: 'A stage of your trust process has been completed.' },
        { id: 2, days_ago: 31, is_opened: true, title: 'Payment received', notification: 'Thank you, your payment has been received.' },
        { id: 1, days_ago: 45, is_opened: true, title: 'Welcome to Nexxess', notification: 'Your client portal is ready. Here you can follow your trust, purchases, invoices and files.' },
    ],
    finished: [
        { id: 4, days_ago: 3, is_opened: false, title: 'Trust completed', notification: 'Congratulations! All stages of your trust process are completed.' },
        { id: 3, days_ago: 9, is_opened: true, title: 'New file', notification: 'The final set of your trust documents has been shared with you in My Files.' },
        { id: 2, days_ago: 40, is_opened: true, title: 'Payment received', notification: 'Thank you, your payment has been received.' },
        { id: 1, days_ago: 120, is_opened: true, title: 'Welcome to Nexxess', notification: 'Your client portal is ready. Here you can follow your trust, purchases, invoices and files.' },
    ],
};

export const notifications = perUser('notifications', seedByStage);

/** A notification as the backend returned it. */
export const toNotification = ({ days_ago, ...record }) => ({
    ...record,
    created_date: record.created_date || dateFromOffset(days_ago),
});

/** Adds an unread notification for something that happened while the demo is used. */
export const notify = (user, title, notification) => {
    const list = notifications.of(user);
    list.unshift({ id: nextId(list), is_opened: false, title, notification, created_date: dateFromOffset(0) });
    notifications.save();
};
