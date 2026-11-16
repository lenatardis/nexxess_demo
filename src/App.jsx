import './Base.scss';
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {getIsAuth} from "./store/selectors";
import Auth from "./components/Auth/Auth";
import styles from './App.module.scss';
import Home from "./components/Home/Home";
import {setAuth, setUserInfo} from "./store/account-slice";
import {fetchUserData} from "./api/authService";
import Preloader from "./components/Common/Preloader/Preloader";

const App = () => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(getIsAuth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData().then((response) => {
            if (response) {
                dispatch(setUserInfo(response));
                dispatch(setAuth(true))
            } else {
                dispatch(setAuth(false))
            }
        }).finally(() => setIsLoading(false))
    }, [isAuth]);

    return (
        <div className={styles.wrapper}>
            {isAuth ? <Home /> : <Auth />}
            {isLoading && (
                <Preloader auth />
            )}
        </div>
    );
}

export default App;
