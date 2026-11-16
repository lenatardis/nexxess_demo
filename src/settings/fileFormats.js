const mimeTypeToExtension = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
    "application/vnd.ms-excel.biff": "xlsb",
    "text/csv": "csv",
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-matroska": "mkv",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "text/plain": "txt",
    "audio/ogg": "ogg",
    "application/vnd.oasis.opendocument.text": "odt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/x-shockwave-flash": "swf",
    "application/x-tar": "tar",
    "application/gzip": "gz"
};

export const getFileExtensionFromMimeType = (mimeType) => {
    return mimeTypeToExtension[mimeType] || "unknown";
};


