import React, {useEffect, useState} from "react";
import styles from './TrustCreatione.module.scss';
import {getAccessToken} from "../../../../api/localStorage";
import {getDiagram} from "../../../../api/rightBarApi";
import Skeleton from "@mui/material/Skeleton";

const TrustCreatione = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAccessToken().then((token) => {
            getDiagram(token).then((response) => {
                if (response?.results) setData(response.results)
            }).finally(() => setIsLoading(false))
        })
    }, [])


    return (
        <>
            {isLoading && !data
                ? (<Skeleton
                    variant="rounded"
                    width="100%"
                    height={56}
                    sx={{borderRadius: '12px'}}
                />)
                : (
                    data?.map((item, index) => (
                        <div key={index} className={styles.trustCreatione}>
                            <p className={styles.trustCreatione__title}>{item?.deal_name} #{item?.deal_id}</p>
                            <div className={styles.trustCreatione__process}>
                                {!!item?.not_completed && <p className={styles.red} style={{ width: `${item?.not_completed}%` }}>
                                   {/* <span>{item?.not_completed}%</span>*/}
                                </p>}
                                {!!item?.complete && <p className={styles.green} style={{ width: `${item?.complete}%` }}>
                                    <span>{item?.complete}%</span>
                                </p>}
                            </div>
                        </div>
                    ))
                )}
        </>
    );
}

export default TrustCreatione;