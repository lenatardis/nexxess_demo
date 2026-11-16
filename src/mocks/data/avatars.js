// Avatars of the invented people: a round initials badge built as an inline SVG (no photos of
// real people, no image files).
const COLORS = ['#0C1D36', '#7A6A3F', '#2F4A6D', '#5B4A6E', '#2E5E55', '#6B3F45'];

export const avatarFor = (firstName, lastName) => {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    const seed = [...`${firstName}${lastName}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110">` +
        `<rect width="110" height="110" fill="${COLORS[seed % COLORS.length]}"/>` +
        `<text x="55" y="57" fill="#F4EBD3" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="600" ` +
        `text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
