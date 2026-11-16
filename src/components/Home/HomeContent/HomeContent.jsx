import React, {useEffect, useState} from "react";
import styles from './HomeContent.module.scss';
import FeedItem from "./FeedItem/FeedItem";
import {getFeed} from "../../../api/pagesApi";
import {getAccessToken} from "../../../api/localStorage";
import Skeleton from "@mui/material/Skeleton";
import {Pagination} from "@mui/material";

const margin = '30px'
const skeletonCount = 2;

const HomeContent = () => {
    const [feed, setFeed] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const onGetFeed = (value = 1) => {
        getAccessToken().then((token) => {
            getFeed(token, value).then((response) => {
                if (response && response.results) {
                    setFeed(response.results);
                    setTotalPages(response?.total_pages);
                }
            }).finally(() => setIsLoading(false))
        })
    }

    useEffect(() => {
        onGetFeed();
    }, [])

    const handlePaginationChange = (event, value) => {
        if (page !== value) {
            setPage(value);
            window.scrollTo({top: 0, behavior: 'auto'});
            onGetFeed(value);
        }
    }

    return (
        <div className={styles.homeContent}>
            <h3>Feed</h3>
            {isLoading ? (
                <div>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width="100%"
                            height={300}
                            sx={{ marginBottom: margin, borderRadius: '33px' }}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    {feed && feed.length && (
                        feed.map((el, index) => <FeedItem key={index} item={el}/>)
                    )}
                </div>
            )}
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
    )
}

export default HomeContent;