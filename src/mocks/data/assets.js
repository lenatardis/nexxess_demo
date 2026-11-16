// Demo assets live in public/demo/ and are addressed relative to the app's base path.
export const demoAsset = (path) => `${process.env.PUBLIC_URL}/demo/${path}`;

// "trust-document-checklist.pdf" → "Trust Document Checklist.pdf": the name the customer sees and downloads.
const displayName = (fileName) =>
    fileName.replace(/(^|-)([a-z])/g, (match, dash, letter) => `${dash ? ' ' : ''}${letter.toUpperCase()}`);

/** An attached file as the backend returned it: {file, file_name}. */
export const demoFile = (fileName) => ({ file: demoAsset(`files/${fileName}`), file_name: displayName(fileName) });
