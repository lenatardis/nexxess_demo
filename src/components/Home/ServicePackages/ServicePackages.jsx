import React, {useEffect, useState} from "react";
import Packages from "../../Common/Packages/Packages";
import Notes from "../../Common/Notes/Notes";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import {getPackageCategories, getPackages} from "../../../api/pagesApi";
import {getAccessToken} from "../../../api/localStorage";
import styles from "../MyPurchases/MyPurchases.module.scss";
import Skeleton from "@mui/material/Skeleton";
import {Pagination} from "@mui/material";
import NoItems from "../../Common/NoItems/NoItems";

const skeletonCount = 6;


const ServicePackages = () => {
    const [list, setList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onGetPackages = (value = 1) => {
        getAccessToken().then((token) => {
            getPackageCategories(token).then((response) => {
                if (response?.results?.length) {
                    getPackages(token, response.results[0].category_b24_id, value).then((result) => {
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
        onGetPackages();
    }, [])

    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            onGetPackages(value)
        }
    }

    return (
        <div>
            <Breadcrumbs secondPage={{utl: '/packages', name: 'Packages'}}/>
            <h3 className={totalPages > 1 ? 'upperPaginationTitle' : ''}>Service Packages</h3>
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
                            height={600}
                            sx={{borderRadius: '33px'}}
                        />
                    ))}
                </div>
            ) : list && list.length > 0 ? (
                <div><Packages list={list}/></div>
            ) : (
                <div><NoItems/></div>
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

export default ServicePackages;