import React from "react";
import styles from './SkeletonEducation.module.scss'
import Skeleton from "@mui/material/Skeleton";

const skeletonCount = 3;
const skeletonStyle = {marginBottom: '10px', borderRadius: '33px', minWidth: '170px'};

const SkeletonEducation = () => {
    return (
        <div className={styles.skeletonEducation}>
            <Skeleton variant="rounded" width="400px" height='40px'
                      sx={{marginBottom: '30px', borderRadius: '10px'}}/>
            {Array.from({length: skeletonCount}).map((_, index) => (
                <div className={styles.block} key={index}>
                    <Skeleton variant="rounded" width="170px" height='114px' sx={skeletonStyle}/>
                    <div className={styles.block__text}>
                        <Skeleton variant="rounded" width="150px" height='30px'
                                  sx={{marginBottom: '8px', borderRadius: '10px'}}/>
                        <Skeleton variant="rounded" width="80%" height='40px'
                                  sx={{borderRadius: '10px'}}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonEducation;