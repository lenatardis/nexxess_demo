// Invented consultants (no real people). The registration form lists them by name; the logged-in
// portal shows the customer's own consultant in the right box.
const people = [
    ['Grace', 'Whitfield', 'Senior Trust Consultant'],
    ['Marcus', 'Ellison', 'Trust Consultant'],
    ['Helen', 'Ashworth', 'Estate Planning Advisor'],
    ['Victor', 'Langley', 'Trust Consultant'],
    ['Naomi', 'Prescott', 'Senior Trust Consultant'],
    ['Julian', 'Mercer', 'Asset Protection Advisor'],
    ['Claire', 'Donovan', 'Trust Consultant'],
    ['Russell', 'Thackeray', 'Tax Strategy Advisor'],
    ['Evelyn', 'Marlowe', 'Trust Consultant'],
    ['Gordon', 'Hale', 'Estate Planning Advisor'],
    ['Priya', 'Raman', 'Trust Consultant'],
    ['Samuel', 'Okafor', 'Asset Protection Advisor'],
    ['Lydia', 'Fairbanks', 'Trust Consultant'],
    ['Thomas', 'Kessler', 'Senior Trust Consultant'],
    ['Amelia', 'Rhodes', 'Trust Consultant'],
    ['Dominic', 'Shaw', 'Tax Strategy Advisor'],
    ['Isabel', 'Navarro', 'Trust Consultant'],
    ['Peter', 'Lindqvist', 'Estate Planning Advisor'],
    ['Joanna', 'Brandt', 'Trust Consultant'],
    ['Leonard', 'Vance', 'Asset Protection Advisor'],
    ['Miriam', 'Castell', 'Trust Consultant'],
    ['Andrew', 'Holloway', 'Senior Trust Consultant'],
    ['Sofia', 'Marchetti', 'Trust Consultant'],
    ['Nathan', 'Byrne', 'Tax Strategy Advisor'],
];

export const consultants = people.map(([first_name, last_name, work_position], index) => ({
    id: 11 + index,
    first_name,
    last_name,
    work_position,
}));

export const DEFAULT_CONSULTANT_ID = consultants[0].id;
