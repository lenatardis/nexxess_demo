import React, {useEffect, useState} from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import styles from './TrustProcess.module.scss';
import ProcessAccordions from "./ProcessAccordions/ProcessAccordions";
import {getTrustPipeline} from "../../../api/pagesApi";
import {Pagination} from "@mui/material";
import {getAccessToken} from "../../../api/localStorage";
import Skeleton from '@mui/material/Skeleton';

const margin = '10px'
const skeletonCount = 7;

const TrustProcess = () => {
    const [pipelines, setPipelines] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const onGetTrustPipeline = (value = 1) => {
        getAccessToken().then((token) => {
            getTrustPipeline(token, value).then(res => {
                if (res?.results) {
                    setPipelines(res.results);
                    setTotalPages(res?.total_pages);
                }
            }).finally(() => setIsLoading(false))
        })
    }

    useEffect(() => {
        onGetTrustPipeline();
    }, []);
    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            onGetTrustPipeline(value)
        }
    }

    return (
        <div className={styles.trustProcess}>
            <Breadcrumbs secondPage={{ url: '/trustProcess', name: 'Trust Process' }} />

            <h3 className={totalPages > 1 ? 'upperPaginationTitle' : ''}>Trust Process</h3>

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
                <div>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width="100%"
                            height={60}
                            sx={{ marginBottom: margin, borderRadius: '33px' }}
                        />
                    ))}
                </div>
            ) : (
                pipelines && pipelines[0]?.trust_pipeline && pipelines[0]?.trust_pipeline.length && <ProcessAccordions pipelines={pipelines[0]?.trust_pipeline} />
            )}
        </div>
    )
}

export default TrustProcess;