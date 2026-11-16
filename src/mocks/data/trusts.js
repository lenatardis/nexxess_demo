// The customer's trusts (Bitrix24 deals in the original) and their pipeline: the Trust Process
// page (one trust per page) and the progress bars of the left box are built from the same data.
import { demoFile } from './assets';
import { consultants, DEFAULT_CONSULTANT_ID } from './consultants';
import { dateFromOffset } from './dates';

// Every trust goes through the same stages. A comment marked `closing` is written when the stage
// is completed, the others while it is running.
const STAGES = [
    {
        title: 'Consultation & Intake',
        checklist: ['Intake form received', 'Goals of the trust discussed', 'Engagement letter signed'],
        comments: [
            { text: 'Thank you for the call today. I have recorded your goals and the people involved; the engagement letter is on its way to you.' },
            { closing: true, text: 'The engagement letter is signed. We can start collecting the documents.' },
        ],
    },
    {
        title: 'Document Collection',
        checklist: ['Photo ID of every trustee', 'Proof of address', 'List of assets', 'Beneficiary details'],
        comments: [
            { text: 'Please prepare the documents from the attached checklist. Scans are fine at this stage.', files: ['trust-document-checklist.pdf'] },
            { closing: true, text: 'All documents are received and verified. <b>Thank you!</b>' },
        ],
    },
    {
        title: 'Trust Agreement Drafting',
        checklist: ['Trust structure agreed', 'Draft prepared', 'Internal legal review'],
        comments: [
            { text: 'We are drafting the trust agreement based on the structure we agreed on. I will let you know as soon as the draft passes our internal review.' },
            { closing: true, text: 'The draft has passed the internal review and is ready for you.' },
        ],
    },
    {
        title: 'Client Review',
        checklist: ['Draft sent to the client', 'Comments received', 'Final version approved'],
        comments: [
            { text: 'The draft is in your files. Take your time to read it and send me your comments:<br>– names and addresses;<br>– the list of assets;<br>– the distribution terms.' },
            { closing: true, text: 'Your changes are in. The final version is approved.' },
        ],
    },
    {
        title: 'Signing & Notarization',
        checklist: ['Signing appointment scheduled', 'Documents signed', 'Notarization completed'],
        comments: [
            { text: 'The signing appointment is scheduled. Please bring the original photo ID of every trustee.' },
            { closing: true, text: 'Everything is signed and notarized.' },
        ],
    },
    {
        title: 'Trust Book Creation',
        checklist: ['Tracking # Assigned', 'Trust Book Created', 'Trust Book Printed'],
        comments: [
            { text: 'The tracking number is assigned and your trust book is being put together.' },
            { closing: true, text: 'The trust book is printed.' },
        ],
    },
    {
        title: 'Asset Transfer',
        checklist: ['Transfer documents prepared', 'Assets retitled to the trust', 'Confirmations received'],
        comments: [
            { text: 'I have prepared the transfer documents for the assets on your list. We will go through them one by one.' },
            { closing: true, text: 'All confirmations are received – the assets are held by the trust.' },
        ],
    },
    {
        title: 'Delivery & Completion',
        checklist: ['Trust book delivered', 'Final consultation held'],
        comments: [
            { text: 'Your trust book has been shipped. A short guide to the portal is attached – your documents stay available in My Files.', files: ['client-portal-guide.pdf'] },
            { closing: true, text: 'Congratulations, your trust is complete! I stay your contact for any question that comes up later.' },
        ],
    },
];

// `started` – days ago each stage that has begun was started, in the order of the stages: a stage
// is completed when the next one has begun (or `finished` is set), the last begun one is running.
// `checked` – ticked checklist items of the running stage.
const seedByStage = {
    new: [{ deal_id: 2291, deal_name: 'Family Trust', started: [3, 1], checked: 1 }],
    progress: [
        { deal_id: 2187, deal_name: 'Family Trust', started: [44, 40, 33, 24, 12, 5], checked: 1 },
        { deal_id: 2254, deal_name: 'Business Trust', started: [16, 11, 2], checked: 1 },
    ],
    finished: [{ deal_id: 1964, deal_name: 'Family Trust', started: [118, 112, 101, 88, 71, 60, 47, 21], finished: 9 }],
};

const dealsOf = (user) => seedByStage[user.stage] || [];

const completedCount = (deal) => (deal.finished !== undefined ? deal.started.length : deal.started.length - 1);

const pad = (value) => String(value).padStart(2, '0');
const isoDay = (daysAgo) => dateFromOffset(Math.max(0, daysAgo)).slice(0, 10);

// Formats of the original's own sample data: "11.06.2024" for a stage, "July 26, 2024, 05:50 PM" for a comment.
const stageDate = (daysAgo) => {
    const [year, month, day] = isoDay(daysAgo).split('-');
    return `${month}.${day}.${year}`;
};
const commentDate = (daysAgo, hour, minute) => {
    const day = new Date(`${isoDay(daysAgo)}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `${day}, ${pad(hour > 12 ? hour - 12 : hour)}:${pad(minute)} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const toPipeline = (deal, user) => {
    const consultant =
        consultants.find((item) => item.id === user.consultant_id) ||
        consultants.find((item) => item.id === DEFAULT_CONSULTANT_ID);
    const author = `${consultant.first_name} ${consultant.last_name}`;
    const done = completedCount(deal);

    return STAGES.map((stage, index) => {
        const begun = index < deal.started.length;
        const completed = index < done;
        const startedAgo = deal.started[index];
        const endedAgo = deal.started[index + 1] ?? deal.finished;
        return {
            deal_status: stage.title,
            task_completed: completed,
            task_running: begun && !completed,
            task_created_date: begun ? stageDate(startedAgo) : null,
            checklist: stage.checklist.map((title, item) => ({
                check_list_title: title,
                check_completed: completed || (begun && item < (deal.checked || 0)),
            })),
            comments: !begun
                ? []
                : stage.comments
                      .filter((comment) => completed || !comment.closing)
                      .map((comment, order) => ({
                          comment_text: comment.text,
                          comment_create_date: comment.closing
                              ? commentDate(endedAgo, 16, 40 - index * 3)
                              : commentDate(startedAgo, 10 + (index % 3), 15 + order * 20 + index),
                          comment_author_name: author,
                          comment_files: (comment.files || []).map(demoFile),
                      })),
        };
    });
};

/** Trusts with their pipeline, as `bitrix/trust_pipeline/` returned them (one per page). */
export const pipelinesOf = (user) =>
    dealsOf(user).map((deal) => ({
        deal_id: deal.deal_id,
        deal_name: deal.deal_name,
        trust_pipeline: toPipeline(deal, user),
    }));

/** Progress of every trust in percent of completed stages, for the bars of the left box. */
export const diagramsOf = (user) =>
    dealsOf(user).map((deal) => {
        const complete = Math.round((completedCount(deal) / STAGES.length) * 100);
        return { deal_id: deal.deal_id, deal_name: deal.deal_name, complete, not_completed: 100 - complete };
    });
