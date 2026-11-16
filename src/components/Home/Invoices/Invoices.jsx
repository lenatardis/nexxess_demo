import React, {useEffect, useState, useCallback} from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import SearchSort from "../../Common/SearchSort/SearchSort";
import InvoicesHeader from "./InvoicesHeader/InvoicesHeader";
import InvoicesAccordions from "./InvoicesAccordions/InvoicesAccordions";
import {getInvoices} from "../../../api/pagesApi";
import {getAccessToken} from "../../../api/localStorage";
import Skeleton from "@mui/material/Skeleton";
import SkeletonFilter from "./SkeletonFilters";
import NoItems from "../../Common/NoItems/NoItems";
import {Pagination} from "@mui/material";

const skeletonCount = 3;
const skeletonStyle = {marginBottom: '10px', borderRadius: '33px'};

const Invoices = () => {
    const [searchValue, setSearchValue] = useState('');
    const [sortValue, setSortValue] = useState({name: 'All', value: ''});
    const [filterValue, setFilterValue] = useState({name: 'All', value: ''});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortsList, setSortsList] = useState([{name: 'All', value: ''}])
    const [filtersList, setFiltersList] = useState([{name: 'All', value: ''}])


    const fetchInvoices = async (selectedPage = 1) => {
        try {
            const token = await getAccessToken();
            const response = await getInvoices(token, searchValue, selectedPage, sortValue.value, filterValue.value);
            if (response?.results) {
                setList(response.results);
                setTotalPages(response.total_pages);
                setSortsList([{name: 'All', value: ''}, ...response.filters.designation]);
                setFiltersList([{name: 'All', value: ''}, ...response.filters.status]);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchInvoices();
    }, [sortValue, filterValue]);

    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            fetchInvoices(value)
        }
    };


    return (
        <div>
            <Breadcrumbs secondPage={{url: '/invoices', name: 'Invoices'}}/>
            <h3>Invoices</h3>

            {isLoading ? (
                <SkeletonFilter/>
            ) : (
                <SearchSort
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    sortValue={sortValue}
                    setSortValue={setSortValue}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    sortsList={sortsList}
                    filtersList={filtersList}
                    fetchInvoices={fetchInvoices}
                    setPage={setPage}
                />
            )}

            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={window.innerWidth >= 768 ? 62 : 40}
                    sx={{margin: '20px 0 10px', borderRadius: '33px 33px 0 0'}}
                />
            ) : (
                <InvoicesHeader list={list} setList={setList}/>
            )}

            {isLoading ? (
                Array.from({length: skeletonCount}).map((_, index) => (
                    <Skeleton key={index} variant="rounded" width="100%" height={window.innerWidth >= 768 ? 62 : 40}
                              sx={skeletonStyle}/>
                ))
            ) : (
                list && <InvoicesAccordions list={list}/>
            )}

            {!isLoading && list && list.length === 0 && <NoItems/>}

            {totalPages > 1 && (
                <Pagination
                    className={'mainPagination'}
                    count={totalPages}
                    page={page}
                    siblingCount={1}
                    boundaryCount={1}
                    onChange={handlePaginationChange}
                />
            )}
        </div>
    );
};

export default Invoices;
