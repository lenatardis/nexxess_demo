import {devUrl} from "../settings/data";
import {refreshAccessToken} from "./authApi";

// Helper function to handle fetch requests with automatic token refresh
const handleFetchRequest = async (url, options, retryFunction, ...args) => {
    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (response.status === 401 || response.statusText === "Unauthorized") {
            const newTokenData = await refreshAccessToken();
            if (newTokenData?.access) {
                return retryFunction(newTokenData.access, ...args);
            }
            throw new Error("Failed to refresh token");
        }

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            return responseData;
          /*  throw new Error(`HTTP error! Status: ${response.status}`);*/
        }

        return responseData;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
    }
};


const getRequest = (url, token, retryFunction, ...args) => {
    return handleFetchRequest(
        url,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
        retryFunction,
        ...args
    );
};


const postRequest = (url, token, body, retryFunction, ...args) => {
    return handleFetchRequest(
        url,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
        retryFunction,
        ...args
    );
};

// API Functions
export const getFeed = (token, page) => getRequest(`${devUrl}bitrix/feed/?page=${page}`, token, getFeed, page);

export const getTrustPipeline = (token, page, size = 1) =>
    getRequest(`${devUrl}bitrix/trust_pipeline/?page=${page}&page_size=${size}`, token, getTrustPipeline, page, size);

export const getInvoices = (token, search, page, designation = '', status = '', size = 5) =>
    getRequest(
        `${devUrl}invoices/?page=${page}&search=${search}&designation=${designation}&status=${status}&page_size=${size}`,
        token,
        getInvoices,
        search,
        page,
        designation,
        status,
        size
    );

export const getInvoicesPdf = (token, invoiceId) =>
    getRequest(`${devUrl}invoices/${invoiceId}/pdf/`, token, getInvoicesPdf, invoiceId);

export const getPackageCategories = (token) =>
    getRequest(`${devUrl}services/categories/`, token, getPackageCategories);

export const getFAQ = (token, page) =>
    getRequest(`${devUrl}services/faq/?page=${page}`, token, getFAQ, page);

export const getEducations = (token) =>
    getRequest(`${devUrl}education/courses/`, token, getEducations);

export const getEducationCourse = (token) =>
    getRequest(`${devUrl}education/lessons/statistic/?course_id=363`, token, getEducationCourse);

export const getPackages = (token, categoryId, page) =>
    getRequest(`${devUrl}services/?bitrix_category=${categoryId}&page=${page}`, token, getPackages, categoryId, page);

export const buyPackage = (token, serviceId) =>
    postRequest(`${devUrl}invoices/`, token, {service_id: serviceId}, buyPackage, serviceId);

export const getPurchases = (token, page) => getRequest(`${devUrl}services/purchased/?page=${page}`, token, getPurchases, page);

export const getPurchasesFiles = (token, page) => getRequest(`${devUrl}sharefiles/?page=${page}`, token, getPurchasesFiles, page);

export const getNexxessFiles = (token) => getRequest(`${devUrl}sharefiles/company/`, token, getNexxessFiles);

// Demo only: the payment page inside the app (stands in for the payment provider of the original).
export const getDemoPayment = (token, invoiceId) =>
    getRequest(`${devUrl}invoices/${invoiceId}/payment/`, token, getDemoPayment, invoiceId);

export const payDemoInvoice = (token, invoiceId) =>
    postRequest(`${devUrl}invoices/${invoiceId}/payment/`, token, {}, payDemoInvoice, invoiceId);
