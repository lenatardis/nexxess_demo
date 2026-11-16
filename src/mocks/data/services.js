// The catalogue: service packages and trusts (invented names, prices and terms). The card color
// comes from the first word of the name (Bronze / Silver / Gold / Platinum / Blue; "Nexxess©" is
// gold); the description is split on <br> into bullet lines. `hours` – consultation hours of the
// service, sent as `bought_time` with a purchase and an invoice.
import { demoAsset } from './assets';

export const CATEGORIES = [
    { category_b24_id: 3, name: 'Packages' },
    { category_b24_id: 5, name: 'Trusts' },
];
const [PACKAGES, TRUSTS] = CATEGORIES.map((category) => category.category_b24_id);

const lines = (...items) => items.join('<br>');

const catalogue = [
    {
        service_id: 101, category: PACKAGES, name: 'Bronze Package', price: 1500, hours: 5, image: 'bronze.svg',
        description: lines(
            '5 hours of consultation', '12-month term', 'One trust covered', 'Answers by e-mail within three business days',
            'Yearly review of the trust records', 'Access to the client portal',
        ),
    },
    {
        service_id: 102, category: PACKAGES, name: 'Silver Package', price: 3000, hours: 12, image: 'silver.svg',
        description: lines(
            '12 hours of consultation', '12-month term', 'One trust covered', 'Answers by e-mail within two business days',
            'Yearly review of the trust records', 'Help with trustee meeting minutes', 'Access to the client portal',
        ),
    },
    {
        service_id: 103, category: PACKAGES, name: 'Gold Package', price: 5500, hours: 25, image: 'gold.svg',
        description: lines(
            '25 hours of consultation', '18-month term', 'Hours can be used for two trusts', 'Answers within one business day',
            'Half-yearly review of the trust records', 'Help with trustee meeting minutes', 'Trust Audit Defense (TAD)*',
            'Access to the client portal',
        ),
    },
    {
        service_id: 104, category: PACKAGES, name: 'Platinum Package', price: 9000, hours: 45, image: 'platinum.svg',
        description: lines(
            '45 hours of consultation', '24-month term', 'Hours can be used for two trusts', 'Answers within one business day',
            'Quarterly review of the trust records', 'Help with trustee meeting minutes', 'Trust Audit Defense (TAD)*',
            'Survivorship Service**', 'Access to the client portal',
        ),
    },
    {
        service_id: 105, category: PACKAGES, name: 'Blue Diamond Package', price: 15000, hours: 80, image: 'blue.svg',
        description: lines(
            '80 hours of consultation', '36-month term', 'Hours can be used for two or more trusts', 'Same-day answers',
            'Quarterly review of the trust records', 'A dedicated senior consultant', 'Trust Audit Defense (TAD)*',
            'Survivorship Service**', 'Access to the client portal',
        ),
    },
    {
        service_id: 106, category: PACKAGES, name: 'Blue Diamond Plus Package', price: 22000, hours: 120, image: 'blue.svg',
        description: lines(
            '120 hours of consultation', '36-month term', 'Hours can be used for two or more trusts', 'Same-day answers',
            'Monthly review of the trust records', 'A dedicated senior consultant', 'On-site trustee meeting once a year',
            'Trust Audit Defense (TAD)*', 'Survivorship Service**', 'Access to the client portal',
        ),
    },
    {
        service_id: 201, category: TRUSTS, name: 'Nexxess© Family Trust', price: 4500, hours: 2, image: 'trust.svg',
        description: lines(
            'A trust for the assets of a family', 'Consultation and intake', 'Drafting of the trust agreement',
            'Signing and notarization', 'Printed trust book', 'Help with the transfer of assets',
            '2 hours of consultation after completion',
        ),
    },
    {
        service_id: 202, category: TRUSTS, name: 'Nexxess© Business Trust', price: 6500, hours: 3, image: 'trust.svg',
        description: lines(
            'A trust for the assets of a business', 'Consultation and intake', 'Drafting of the trust agreement',
            'Signing and notarization', 'Printed trust book', 'Help with the transfer of business assets',
            '3 hours of consultation after completion',
        ),
    },
    {
        service_id: 203, category: TRUSTS, name: 'Nexxess© Asset Protection Trust', price: 8500, hours: 4, image: 'trust.svg',
        description: lines(
            'A trust built around the protection of assets', 'Consultation and intake', 'Drafting of the trust agreement',
            'Signing and notarization', 'Printed trust book', 'Help with the transfer of assets',
            '4 hours of consultation after completion',
        ),
    },
];

/** A service as the backend returned it. */
const toService = ({ category, hours, image, ...service }) => ({ ...service, image: demoAsset(`services/${image}`) });

export const servicesCount = catalogue.length;

export const servicesOfCategory = (categoryId) =>
    catalogue.filter((service) => !categoryId || service.category === Number(categoryId)).map(toService);

/** `{service, hours}` for a service id, or null. */
export const findService = (serviceId) => {
    const found = catalogue.find((service) => service.service_id === Number(serviceId));
    return found ? { service: toService(found), hours: found.hours } : null;
};
