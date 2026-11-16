// "My Dashboard" counters of the right box. Fixed per stage for now; they will be counted from the
// catalogue, purchases and invoices once those are mocked.
const byStage = {
    new: { purchased_services_count: 1, user_all_invoices_count: 1 },
    progress: { purchased_services_count: 2, user_all_invoices_count: 3 },
    finished: { purchased_services_count: 4, user_all_invoices_count: 4 },
};

export const statisticsOf = (user) => ({
    all_services_count: 9,
    user_all_tickets_count: 0,
    ...(byStage[user.stage] || byStage.new),
});
