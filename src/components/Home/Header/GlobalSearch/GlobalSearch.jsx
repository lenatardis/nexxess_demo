import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import styles from "../Header.module.scss";
import searchIcon from "../../../../assets/icons/search.svg";
import searchIconMob from "../../../../assets/icons/searchMob.svg";
import { getAccessToken } from "../../../../api/localStorage";
import { getSearchResult } from "../../../../api/header";
import GlobalSearchResult from "./GlobalSearchResult";
import {isPhoneLayout} from "../../../../settings/layout";

const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    return useCallback((...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
};

const GlobalSearch = () => {
    const [searchValue, setSearchValue] = useState("");
    const [list, setList] = useState([]);

    const fetchInvoices = useCallback(async (value) => {
        try {
            const token = await getAccessToken();
            const response = await getSearchResult(token, value);
            setList(response?.results || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }, []);

    const debouncedFetch = useDebounce(fetchInvoices, 500);

    useEffect(() => {
        if (searchValue.trim()) {
            debouncedFetch(searchValue);
        } else {
            setList([]);
        }
    }, [searchValue, debouncedFetch]);

    const handleClear = useCallback(() => {
        setSearchValue("");
        setList([]);
    }, []);

    const iconSrc = useMemo(() => (!isPhoneLayout() ? searchIcon : searchIconMob), []);

    return (
        <div
            className={`${styles.header__menuItem} ${styles.search}`}
            style={searchValue ? { width: "348px", maxWidth: '60vw' } : null}
        >
            <img src={iconSrc} alt="search" />
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            {list.length > 0 && <GlobalSearchResult list={list} handleClear={handleClear}/>}
            {list.length > 0 && <button className={styles.closer} onClick={handleClear} />}
        </div>
    );
};

export default GlobalSearch;
