// Seed data stores day offsets instead of dates, so the demo never looks stale: every date is
// computed from the day the demo is opened.
const pad = (value) => String(value).padStart(2, '0');

/** ISO-like date-time `daysAgo` days before today (negative – in the future), at the given time. */
export const dateFromOffset = (daysAgo, time = '10:00:00') => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}Z`;
};
