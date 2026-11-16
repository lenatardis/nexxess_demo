import React, {useEffect, useRef} from "react";
import styles from './SearchSort.module.scss';
import CustomSelect from "../CustomSelect/CustomSelect";
import searchIcon from '../../../assets/icons/searchDark.svg';


const SearchSort = ({searchValue, setSearchValue, sortValue, filterValue, setSortValue, setFilterValue, filtersList,
                        sortsList, fetchInvoices, setPage}) => {
    const timeout = useRef(null);

    useEffect(() => {
        if (searchValue.length > 0) {
            clearTimeout(timeout.current);
            // if (filterLabels !== null) {
            //     setFilterLabels(null);
            // }
            timeout.current = setTimeout(() => {
                fetchInvoices(1);
            }, 500);
            return () => {
                clearTimeout(timeout.current);
            };
        } else if (searchValue === '') {
            // setFilterLabels(null);
            setPage(1);
            fetchInvoices(1);
        }
    }, [searchValue]);

    return (
        <div className={styles.searchSort}>
            <div className={styles.search}>
                <img src={searchIcon} alt=""/>
                <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                <span>Search</span>
            </div>
            <div className={styles.sortFilter}>
                <CustomSelect value={sortValue} setValue={setSortValue} selectList={sortsList} />
                <CustomSelect value={filterValue} setValue={setFilterValue} selectList={filtersList} />
            </div>
        </div>
    )
}

export default SearchSort;