// Demo assets live in public/demo/ and are addressed relative to the app's base path.
export const demoAsset = (path) => `${process.env.PUBLIC_URL}/demo/${path}`;

/** An attached file as the backend returned it: {file, file_name}. */
export const demoFile = (fileName) => ({ file: demoAsset(`files/${fileName}`), file_name: fileName });
