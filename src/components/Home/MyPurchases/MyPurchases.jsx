import React, {useEffect, useState} from "react";
import styles from './MyPurchases.module.scss';
import Packages from "../../Common/Packages/Packages";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import PurchasesFiles from "../MyFiles/PurchasesFiles/PurchasesFiles";
import {getAccessToken} from "../../../api/localStorage";
import {getPurchases, getPurchasesFiles} from "../../../api/pagesApi";
import Skeleton from "@mui/material/Skeleton";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {setPurchases} from "../../../store/main-slice";
import {getStatePurchases} from "../../../store/selectors";
import NoItems from "../../Common/NoItems/NoItems";
import {Pagination} from "@mui/material";

const skeletonCount = 3;

const MyPurchases = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(getStatePurchases)
    // const [files, setFiles] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (page = 1, includePurchasesFiles = true) => {
        try {
            const token = await getAccessToken();
            let purchasesResponse;

            if (includePurchasesFiles) {
                const [purchasesResult] = await Promise.all([
                    getPurchases(token, page),
                    getPurchasesFiles(token)
                ]);

                purchasesResponse = purchasesResult;


            } else {
                purchasesResponse = await getPurchases(token, page);
            }
            if (purchasesResponse?.results?.length) {
                dispatch(setPurchases(purchasesResponse.results));
                setTotalPages(purchasesResponse?.total_pages);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            fetchData(value, false);
        }
    };

    return (
        <div className={styles.myPurchases}>
            <Breadcrumbs secondPage={{utl: '/myPurchases', name: 'My Purchases'}}/>
            <h3>My Purchases</h3>

            {/*{isLoading ? (*/}
            {/*    <Skeleton*/}
            {/*        variant="rounded"*/}
            {/*        width="100%"*/}
            {/*        height={104}*/}
            {/*        sx={{borderRadius: '33px'}}*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <PurchasesFiles files={files}/>*/}
            {/*)}*/}

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

            {isLoading ? (
                <div className={styles.skeletonRow}>
                    {Array.from({length: skeletonCount}).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width="100%"
                            height={600}
                            sx={{borderRadius: '33px'}}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    {list && list.length ? (
                        <Packages list={list} isPurchases/>
                    ) : <NoItems/>}
                </div>
            )}
        </div>
    )
}

export default MyPurchases;