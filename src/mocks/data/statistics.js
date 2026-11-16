// "My Dashboard" counters of the right box, counted from the catalogue and the customer's invoices.
import { invoices, PAID } from './invoices';
import { servicesCount } from './services';

export const statisticsOf = (user) => {
    const list = invoices.of(user);
    return {
        all_services_count: servicesCount,
        purchased_services_count: list.filter((invoice) => invoice.status === PAID).length,
        user_all_tickets_count: 0,
        user_all_invoices_count: list.length,
    };
};
