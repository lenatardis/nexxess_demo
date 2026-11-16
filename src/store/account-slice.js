import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    profile: null,
    newNotifications: 0,
    email: '',
};

export const accountSlice = createSlice({
    name: 'accountPage',
    initialState,
    reducers: {
        setAuth(state, {payload}) {
            state.isAuth = payload;
        },
        setUserInfo(state, {payload}) {
            state.profile = payload;
        },
        setNewNotifications(state, {payload}) {
            state.newNotifications = payload;
        },
        setEmail(state, {payload}) {
            state.email = payload;
        },
    }
})

export default accountSlice.reducer;

export const {
    setAuth,
    setUserInfo,
    setNewNotifications,
    setEmail
} = accountSlice.actions;