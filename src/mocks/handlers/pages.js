// Page endpoints used by src/api/pagesApi.js.
import { http, HttpResponse } from 'msw';
import { findInvoice, invoicesOf, openInvoice, PAID, payInvoice, toInvoice } from '../data/invoices';
import { notify } from '../data/notifications';
import { CATEGORIES, findService, servicesOfCategory } from '../data/services';
import { COURSES } from '../data/courses';
import { buildInvoicePdf } from '../invoicePdf';
import { faq } from '../data/faq';
import { feed } from '../data/feed';
import { companyFiles, filesOf } from '../data/files';
import { pipelinesOf } from '../data/trusts';
import { API, errorResponse, notFound, paginate, readJson, withAuth } from './utils';

const FEED_PAGE_SIZE = 3;

const getFeed = http.get(
    `${API}/bitrix/feed/`,
    withAuth(({ request }) => {
        const page = new URL(request.url).searchParams.get('page');
        return HttpResponse.json(paginate(feed(), page, FEED_PAGE_SIZE));
    }),
);

// The page asks page_size=1: one trust per page, the pagination switches between the trusts.
const getTrustPipeline = http.get(
    `${API}/bitrix/trust_pipeline/`,
    withAuth(({ request, user }) => {
        const params = new URL(request.url).searchParams;
        return HttpResponse.json(paginate(pipelinesOf(user), params.get('page'), params.get('page_size')));
    }),
);

// --- Catalogue and purchases ---

// As many cards per page as the pages show skeletons.
const SERVICES_PAGE_SIZE = 6;
const PURCHASES_PAGE_SIZE = 3;

// [0] – packages, [1] – trusts: the two catalogue pages take their category from this order.
const getCategories = http.get(
    `${API}/services/categories/`,
    withAuth(() => HttpResponse.json({ count: CATEGORIES.length, total_pages: 1, results: CATEGORIES })),
);

const getServices = http.get(
    `${API}/services/`,
    withAuth(({ request }) => {
        const params = new URL(request.url).searchParams;
        return HttpResponse.json(
            paginate(servicesOfCategory(params.get('bitrix_category')), params.get('page'), SERVICES_PAGE_SIZE),
        );
    }),
);

// Paid invoices, newest first. The first page also feeds "Your Services" of the right box.
const getPurchased = http.get(
    `${API}/services/purchased/`,
    withAuth(({ request, user }) => {
        const purchases = invoicesOf(user)
            .filter((invoice) => invoice.status === PAID)
            .map(({ invoice_id, bought_time, service }) => ({ invoice_id, bought_time, purchased_services: [service] }));
        return HttpResponse.json(paginate(purchases, new URL(request.url).searchParams.get('page'), PURCHASES_PAGE_SIZE));
    }),
);

// --- Buying (the original sent the customer to a payment provider) ---

// The payment page of the demo lives inside the app; the frontend goes there with window.location.
const paymentUrl = (invoiceId) => `${window.location.origin}${process.env.PUBLIC_URL}/demoPayment?invoice=${invoiceId}`;

const buyService = http.post(
    `${API}/invoices/`,
    withAuth(async ({ request, user }) => {
        const { service_id } = await readJson(request);
        if (!findService(service_id)) {
            return errorResponse(400, 'does_not_exist', 'Service not found.', 'service_id');
        }
        const invoice = openInvoice(user, service_id);
        return HttpResponse.json(
            { invoice_id: invoice.invoice_id, transaction_url: paymentUrl(invoice.invoice_id) },
            { status: 201 },
        );
    }),
);

// Demo only (src/api/pagesApi.js → getDemoPayment, payDemoInvoice): what the payment page shows, and "Pay".
const getPayment = http.get(
    `${API}/invoices/:id/payment/`,
    withAuth(({ params, user }) => {
        const invoice = findInvoice(user, params.id);
        return invoice ? HttpResponse.json(toInvoice(invoice)) : notFound('Invoice not found.');
    }),
);

const payPayment = http.post(
    `${API}/invoices/:id/payment/`,
    withAuth(({ params, user }) => {
        const invoice = findInvoice(user, params.id);
        if (!invoice) return notFound('Invoice not found.');
        if (invoice.status !== PAID) {
            payInvoice(invoice);
            notify(user, 'Payment received', `Thank you, your payment for ${findService(invoice.service_id).service.name} has been received.`);
        }
        return HttpResponse.json(toInvoice(invoice));
    }),
);

// --- Invoices ---

const unique = (values) => [...new Set(values)];

// The table: search by invoice id or service name, "designation" – the service the invoice is for,
// status. The two selects of the page are filled from `filters`, which always cover all invoices
// of the customer (not only the filtered ones). Column sorting happens in the browser.
const getInvoices = http.get(
    `${API}/invoices/`,
    withAuth(({ request, user }) => {
        const params = new URL(request.url).searchParams;
        const search = (params.get('search') || '').trim().toLowerCase();
        const designation = params.get('designation') || '';
        const status = params.get('status') || '';
        const all = invoicesOf(user);

        const found = all.filter(
            (invoice) =>
                (!search || String(invoice.invoice_id).includes(search) || invoice.service.name.toLowerCase().includes(search)) &&
                (!designation || String(invoice.service.service_id) === designation) &&
                (!status || invoice.status === status),
        );

        return HttpResponse.json({
            ...paginate(
                found.map(({ service, ...invoice }) => ({ ...invoice, designation: service.name })),
                params.get('page'),
                params.get('page_size'),
            ),
            filters: {
                designation: unique(all.map((invoice) => invoice.service.service_id)).map((id) => ({
                    name: findService(id).service.name,
                    value: String(id),
                })),
                status: unique(all.map((invoice) => invoice.status)).map((name) => ({ name, value: name })),
            },
        });
    }),
);

// The original answered with a public link to a ready file; here the PDF is built on the spot.
const getInvoicePdf = http.get(
    `${API}/invoices/:id/pdf/`,
    withAuth(({ params, user }) => {
        const invoice = findInvoice(user, params.id);
        if (!invoice) return notFound('Invoice not found.');
        return HttpResponse.json({ file_public_url: URL.createObjectURL(buildInvoicePdf(toInvoice(invoice), user)) });
    }),
);

// --- Files, FAQ, Education ---

const FILES_PAGE_SIZE = 6;
const FAQ_PAGE_SIZE = 5;

// Also asked by the shell and My Purchases without a page ("?page=undefined") – the first page then.
const getFiles = http.get(
    `${API}/sharefiles/`,
    withAuth(({ request, user }) =>
        HttpResponse.json(paginate(filesOf(user), new URL(request.url).searchParams.get('page'), FILES_PAGE_SIZE)),
    ),
);

const getCompanyFiles = http.get(
    `${API}/sharefiles/company/`,
    withAuth(() => {
        const results = companyFiles();
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

const getFaq = http.get(
    `${API}/services/faq/`,
    withAuth(({ request }) =>
        HttpResponse.json(paginate(faq, new URL(request.url).searchParams.get('page'), FAQ_PAGE_SIZE)),
    ),
);

// The Education page is hardcoded in the frontend and only logs this answer.
const getCourses = http.get(
    `${API}/education/courses/`,
    withAuth(() => HttpResponse.json({ count: COURSES.length, total_pages: 1, results: COURSES })),
);

export const pagesHandlers = [
    getFeed, getTrustPipeline, getCategories, getServices, getPurchased,
    getInvoices, getInvoicePdf, buyService, getPayment, payPayment,
    getCompanyFiles, getFiles, getFaq, getCourses,
];
