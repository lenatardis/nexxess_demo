// My Files: documents shared with a customer (by stage) and the company's general documents.
// The sample files live in public/demo/files/; the icon and the open / download behavior of the
// page come from `file_type` (src/settings/fileFormats.js).
import { demoFile } from './assets';

const TYPES = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
};

/** A shared file as the backend returned it: {file, file_name, file_type}. */
const toFile = (fileName) => ({ ...demoFile(fileName), file_type: TYPES[fileName.split('.').pop()] });

// Newest first: what the consultant has shared up to the customer's stage of the trust.
const intake = ['id-scan.jpg', 'trust-document-checklist.pdf', 'engagement-letter.pdf'];
const midProcess = [
    'trust-book-cover.png', 'signing-appointment.pdf', 'asset-list.xlsx', 'trust-agreement-draft.docx', ...intake,
];
const byStage = {
    new: ['trust-document-checklist.pdf', 'engagement-letter.pdf'],
    progress: midProcess,
    finished: ['certificate-of-trust.pdf', 'trust-summary.pdf', 'client-portal-guide.pdf', ...midProcess],
};

export const filesOf = (user) => (byStage[user.stage] || []).map(toFile);

export const companyFiles = () =>
    [
        'client-portal-guide.pdf', 'trust-document-checklist.pdf', 'meeting-minutes-template.docx',
        'asset-inventory-template.xlsx', 'holiday-office-hours.pdf',
    ].map(toFile);
