// Invoice PDF, written by hand (one page, the standard Helvetica fonts, no library): the original
// backend returned a link to a ready file, the demo builds the file in the browser and returns a
// blob: link. Text is limited to the Windows-1252 characters of the standard fonts.

// PDF strings here are "binary strings": one char = one byte.
const CP1252 = { '–': '\x96', '—': '\x97', '’': '\x92', '‘': '\x91', '“': '\x93', '”': '\x94', '•': '\x95', '™': '\x99', '€': '\x80' };
const toBytes = (text) =>
    [...String(text ?? '')].map((char) => CP1252[char] || (char.charCodeAt(0) <= 0xff ? char : '?')).join('');
const literal = (text) => `(${toBytes(text).replace(/([\\()])/g, '\\$1')})`;

// Helvetica is not monospaced; an average glyph width is close enough to right-align short amounts.
const textWidth = (text, size) => String(text).length * size * 0.52;

const NAVY = '0.047 0.114 0.212';
const GOLD = '0.78 0.722 0.573';
const GREY = '0.42 0.443 0.498';
const DARK = '0.039 0.075 0.161';

const page = () => {
    const ops = [];
    const api = {
        rect: (x, y, width, height, color) => ops.push(`${color} rg ${x} ${y} ${width} ${height} re f`),
        line: (x1, y1, x2, y2, color = '0.89 0.9 0.91') => ops.push(`${color} RG 0.8 w ${x1} ${y1} m ${x2} ${y2} l S`),
        text: (value, x, y, { size = 11, bold = false, color = DARK, right = false } = {}) =>
            ops.push(
                `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color} rg ${right ? x - textWidth(value, size) : x} ${y} Td ${literal(value)} Tj ET`,
            ),
        content: () => ops.join('\n'),
    };
    return api;
};

const assemble = (content, title) => {
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = objects.map((object, index) => {
        const offset = pdf.length;
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
        return offset;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info << /Title ${literal(title)} >> >>\nstartxref\n${xref}\n%%EOF\n`;
    return Uint8Array.from(pdf, (char) => char.charCodeAt(0));
};

const money = (value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const day = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/**
 * @param invoice an invoice from data/invoices.js → toInvoice
 * @param user the customer it is issued to
 * @returns {Blob} application/pdf
 */
export const buildInvoicePdf = (invoice, user) => {
    const p = page();
    const paid = invoice.status === 'Paid';

    p.rect(0, 702, 612, 90, NAVY);
    p.text('NEXXESS', 56, 752, { size: 24, bold: true, color: '1 1 1' });
    p.text('Client portal – demo', 56, 732, { size: 10, color: GOLD });
    p.text('INVOICE', 556, 752, { size: 22, bold: true, color: '1 1 1', right: true });
    p.text(`# ${invoice.invoice_id}`, 556, 732, { size: 12, color: GOLD, right: true });

    p.text('BILLED TO', 56, 664, { size: 9, bold: true, color: GREY });
    p.text(`${user.first_name} ${user.last_name}`.trim() || user.email, 56, 646, { size: 13, bold: true });
    [user.email, user.phone, [user.street, user.city, user.country].filter(Boolean).join(', ')]
        .filter(Boolean)
        .forEach((line, index) => p.text(line, 56, 629 - index * 15, { size: 10, color: GREY }));

    [
        ['Invoice date', day(invoice.begin_date)],
        ['Due date', day(invoice.deadline)],
        ['Status', invoice.status],
    ].forEach(([label, value], index) => {
        p.text(label, 380, 664 - index * 18, { size: 10, color: GREY });
        p.text(value, 556, 664 - index * 18, { size: 10, bold: true, right: true });
    });

    p.rect(56, 540, 500, 26, '0.894 0.906 0.914');
    p.text('DESCRIPTION', 68, 549, { size: 9, bold: true, color: GREY });
    p.text('HOURS', 420, 549, { size: 9, bold: true, color: GREY, right: true });
    p.text('AMOUNT', 544, 549, { size: 9, bold: true, color: GREY, right: true });

    p.text(invoice.service.name, 68, 515, { size: 12, bold: true });
    p.text(String(invoice.bought_time), 420, 515, { size: 12, right: true });
    p.text(money(invoice.price), 544, 515, { size: 12, right: true });
    p.line(56, 498, 556, 498);

    p.text('Total', 380, 468, { size: 12, color: GREY });
    p.text(money(invoice.price), 544, 468, { size: 16, bold: true, right: true });

    p.rect(56, 452, 92, 30, paid ? '0.416 0.784 0.635' : GOLD);
    p.text(invoice.status.toUpperCase(), paid ? 84 : 76, 462, { size: 12, bold: true, color: '1 1 1' });

    p.line(56, 70, 556, 70);
    p.text('Sample document of a portfolio demo. It contains no real customer data and is not a request for payment.', 56, 52, {
        size: 8, color: GREY,
    });

    return new Blob([assemble(p.content(), `Invoice ${invoice.invoice_id}`)], { type: 'application/pdf' });
};
