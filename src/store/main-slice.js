import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    purchases: null,
    services: null,
};

export const mainSlice = createSlice({
    name: 'mainPage',
    initialState,

    reducers: {
        setPurchases(state, {payload}) {
            const  extractPurchasedServices = (data) => {
                return data.map(invoice => {
                    const serviceNames = invoice.purchased_services.map(service => service.name).join(", ");
                    return {
                        name: serviceNames,
                        hours: invoice.bought_time
                    };
                });
            }

            const collectAllPurchasedServices = (invoices) => {
                return invoices.flatMap(invoice => invoice.purchased_services);
            }

            state.services = extractPurchasedServices(payload);
            state.purchases = collectAllPurchasedServices(payload);
        },
    },
})

export default mainSlice.reducer;

export const {
    setPurchases,
} = mainSlice.actions;