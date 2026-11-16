// News feed of the home page (the company's Bitrix24 live feed in the original): the same posts
// for every customer, newest first. `days_ago` – see dates.js; `author` – a consultant id or null
// for a post of the company itself.
import { demoAsset, demoFile } from './assets';
import { avatarFor } from './avatars';
import { consultants } from './consultants';
import { dateFromOffset } from './dates';

const posts = [
    {
        days_ago: 1, author: 11,
        description:
            '<b>Client webinar: keeping a trust in good standing</b><br><br>' +
            `<img src="${demoAsset('feed/webinar.svg')}" alt="Webinar"><br><br>` +
            'Setting a trust up is only the beginning. In this session we walk through the yearly housekeeping: ' +
            'what to review, which records to keep and how to add assets later.<br><br>' +
            'The agenda is attached. Send your questions to your consultant in advance and we will cover them live.',
        files: ['webinar-agenda.pdf'],
    },
    {
        days_ago: 4, author: null,
        description:
            'The portal now shows the progress of every trust right under the menu. ' +
            'Open <b>Trust Process</b> to see each stage with its checklist and the comments of your consultant.',
        files: [],
    },
    {
        days_ago: 9, author: 13,
        description:
            '<b>Getting ready for a new trust</b><br><br>The first stage goes faster when the documents are at hand:' +
            '<ul><li>a photo ID of every trustee;</li><li>a recent proof of address;</li>' +
            '<li>the list of assets you plan to place into the trust;</li><li>the details of the beneficiaries.</li></ul>' +
            'The full checklist is attached.',
        files: ['trust-document-checklist.pdf'],
    },
    {
        days_ago: 15, author: null,
        description:
            'Our office hours around the public holidays are attached. ' +
            'Messages sent through the portal during the break are answered on the next working day.',
        files: ['holiday-office-hours.pdf'],
    },
    {
        days_ago: 22, author: 15,
        description:
            '<b>A question we hear often: can I add assets later?</b><br><br>' +
            'Yes. A trust is not closed once it is signed – assets can be added afterwards, and your consultant ' +
            'prepares the paperwork for each addition. You will find more answers in the <b>FAQ</b> section.',
        files: [],
    },
    {
        days_ago: 30, author: 12,
        description:
            'Every invoice can now be opened as a PDF right from the <b>Invoices</b> page.',
        files: [],
    },
    {
        days_ago: 41, author: null,
        description:
            '<b>Welcome to the Nexxess client portal</b><br><br>' +
            'Everything about your trust is now in one place: the process, your purchases, invoices and files. ' +
            'A short guide to the portal is attached, together with the document checklist for new clients.',
        files: ['client-portal-guide.pdf', 'trust-document-checklist.pdf'],
    },
];

// Short on purpose: the date shares a line with the author's position.
const FORMAT = { month: '2-digit', day: '2-digit', year: 'numeric' };

/** The feed as the backend returned it. */
export const feed = () =>
    posts.map(({ days_ago, author, description, files }) => {
        const person = consultants.find((item) => item.id === author);
        return {
            author_photo: person ? avatarFor(person.first_name, person.last_name) : avatarFor('Nexxess', ''),
            author_full_name: person ? `${person.first_name} ${person.last_name}` : 'Nexxess',
            author_type: person ? person.work_position : 'Company news',
            published_date: new Date(dateFromOffset(days_ago).slice(0, 10) + 'T12:00:00').toLocaleDateString('en-US', FORMAT),
            description,
            files: files.map(demoFile),
        };
    });
