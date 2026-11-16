import React, {useEffect, useState} from "react";
import styles from "./FAQ.module.scss";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import FAQAccordions from "./FAQAccordions/FAQAccordions";
import {getAccessToken} from "../../../api/localStorage";
import {getFAQ} from "../../../api/pagesApi";
import Skeleton from "@mui/material/Skeleton";
import {Pagination} from "@mui/material";

const margin = '10px'
const skeletonCount = 3;

const FAQ = () => {
    const [list, setList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onGetFAQ = async (value = 1) => {
        try {
            setIsLoading(true);

            const token = await getAccessToken();
            const response = await getFAQ(token, value);

            if (response?.results) {
                setList(response.results);
                setTotalPages(response.total_pages);
            }
        } catch (error) {
            console.error("Failed to fetch FAQ:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
       onGetFAQ();
    }, [])


    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            onGetFAQ(value);
        }
    }


    return (
        <div className={styles.faq}>
            <Breadcrumbs secondPage={{utl: '/faq', name: 'FAQ'}}/>
            <h3 className={totalPages > 1 ? 'upperPaginationTitle' : ''}>FAQ</h3>
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
                {Array.from({length: skeletonCount}).map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        width="100%"
                        height={60}
                        sx={{marginBottom: margin, borderRadius: '33px'}}
                    />
                ))}
            </div>
            ) : (
            list?.length && <FAQAccordions list={list}/>
            )}

        </div>
    )
}

export default FAQ;