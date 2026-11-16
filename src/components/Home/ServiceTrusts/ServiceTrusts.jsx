import React, {useEffect, useState} from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import Packages from "../../Common/Packages/Packages";
import Notes from "../../Common/Notes/Notes";
import {getPackageCategories, getPackages} from "../../../api/pagesApi";
import {getAccessToken} from "../../../api/localStorage";
import styles from "../MyPurchases/MyPurchases.module.scss";
import Skeleton from "@mui/material/Skeleton";
import {Pagination} from "@mui/material";

const skeletonCount = 3;

const ServiceTrusts = () => {
    const [list, setList] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const onGetTrusts = (value = 1) => {
        getAccessToken().then((token) => {
            getPackageCategories(token).then((response) => {
                if (response?.results?.length) {
                    getPackages(token, response.results[1].category_b24_id, value).then((result) => {
                        if (result?.results?.length) {
                            setList(result.results);
                            setTotalPages(result?.total_pages);
                        }
                    }).finally(() => (setIsLoading(false)))
                } else {
                    setIsLoading(false)
                }
            })
        })
    }

    useEffect(() => {
      onGetTrusts();
    }, [])

    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            onGetTrusts(value)
        }
    }

    return (
        <div className={styles.serviceTrusts}>
            <Breadcrumbs secondPage={{utl: '/trusts', name: 'Trusts'}} />
            <h3 className={totalPages > 1 ? 'upperPaginationTitle' : ''}>Service Trusts</h3>
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
                <div className={styles.skeletonRow} style={{marginBottom: '30px'}}>
                    {Array.from({length: skeletonCount}).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width="100%"
                            height={670}
                            sx={{borderRadius: '33px'}}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    {list && list.length && (
                        <Packages list={list}/>
                    )}
                </div>
            )}
            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={400}
                    sx={{borderRadius: '33px'}}
                />
            ) : (
                <Notes/>
            )}
        </div>
    )
}

export default ServiceTrusts;