// Demo customers (invented people) and access to the `users` collection.
// `stage` decides which sample data a customer sees: 'new' – just started, 'progress' – trust in
// progress, 'finished' – trust completed. A customer registered in the demo gets 'progress'.
import { demoAccounts, demoPassword } from '../../settings/data';
import { getCollection, nextId, saveCollection } from '../db';
import { DEFAULT_CONSULTANT_ID } from './consultants';

const [olivia, daniel, margaret] = demoAccounts;

const blank = { phone_two: '', phone_three: '', email_two: '', email_three: '', street: '', photo: null };

const seedUsers = [
    {
        ...blank, id: 1, stage: 'new', consultant_id: 13, password: demoPassword,
        email: olivia.email, first_name: 'Olivia', last_name: 'Bennett',
        phone: '+12025550143', country: 'United States', city: 'Austin',
    },
    {
        ...blank, id: 2, stage: 'progress', consultant_id: DEFAULT_CONSULTANT_ID, password: demoPassword,
        email: daniel.email, first_name: 'Daniel', last_name: 'Harper',
        phone: '+12025550176', phone_two: '+12025550118', email_two: 'd.harper@harper-holdings.example',
        country: 'United States', city: 'Denver', street: '418 Larkspur Avenue',
    },
    {
        ...blank, id: 3, stage: 'finished', consultant_id: 15, password: demoPassword,
        email: margaret.email, first_name: 'Margaret', last_name: 'Collins',
        phone: '+12025550129', country: 'United States', city: 'Savannah', street: '27 Wexford Lane',
    },
];

const COLLECTION = 'users';
const users = () => getCollection(COLLECTION, seedUsers);

export const saveUsers = () => saveCollection(COLLECTION);

export const findUserById = (id) => users().find((user) => user.id === Number(id)) || null;

const sameEmail = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

export const findUserByEmail = (email) => (email ? users().find((user) => sameEmail(user.email, email)) || null : null);

/** Adds a customer registered (or signed in with Google for the first time) in the demo. */
export const createUser = (fields) => {
    const user = {
        ...blank,
        phone: '', country: '', city: '', first_name: '', last_name: '',
        ...fields,
        id: nextId(users()),
        stage: 'progress',
        consultant_id: fields.consultant_id || DEFAULT_CONSULTANT_ID,
    };
    users().push(user);
    saveUsers();
    return user;
};

/** The profile as the backend returned it (no password, no demo-only fields). */
export const toProfile = ({ password, stage, consultant_id, ...profile }) => profile;
