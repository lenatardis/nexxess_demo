import styles from "./Invoices.module.scss";
import Skeleton from "@mui/material/Skeleton";


const SkeletonFilter = () => {
    return (
        <div className={styles.skeletonFilters}>
            <Skeleton
                className={styles.skeletonFilters__search}
                variant="rounded"
                width="100%"
                height={window.innerWidth >= 768 ? 62 : 40}
                sx={{borderRadius: '33px' }}
            />
            <div className={styles.skeletonFilters__filters}>
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={window.innerWidth >= 768 ? 62 : 40}
                    sx={{borderRadius: '33px'}}
                />
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={window.innerWidth >= 768 ? 62 : 40}
                    sx={{borderRadius: '33px'}}
                />
            </div>
        </div>
    )
}

export default SkeletonFilter;