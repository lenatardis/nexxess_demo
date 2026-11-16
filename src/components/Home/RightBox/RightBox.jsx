import React, { useEffect, useState, useCallback, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "./RightBox.module.scss";
import Messenger from "./Messenger/Messenger";
import GeneralStat from "./GeneralStat/GeneralStat";
import ServiceStat from "./ServiceStat/ServiceStat";
import closeIcon from "../../../assets/icons/closeWhite.svg";
import { getAccessToken } from "../../../api/localStorage";
import { getConsultants, getRightBarStatics } from "../../../api/rightBarApi";
import { useAppSelector } from "../../../hooks/redux";
import { getProfile, getStateServices } from "../../../store/selectors";
import TrustCreatione from "./TrustCreatione/TrustCreatione";
import useWindowSize from "../../../hooks/useWindowSize";

const skeletonCount = 3;

const RightBox = ({ isActive, setMenuActives }) => {
    const profile = useAppSelector(getProfile);
    const services = useAppSelector(getStateServices);
    const [consultants, setConsultants] = useState(null);
    const [statics, setStatics] = useState(null);
    const hasFetched = useRef(false);
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const fetchData = useCallback(async () => {
        if (!profile || hasFetched.current) return;
        hasFetched.current = true;

        try {
            const token = await getAccessToken();
            const [consultantResponse, staticsResponse] = await Promise.all([
                getConsultants(token),
                getRightBarStatics(token),
            ]);

            setConsultants(prev => consultantResponse?.results || prev || []);
            setStatics(prev => staticsResponse || prev);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [profile]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={isMobile && isActive ? `${styles.rightBoxActive} menuActive` : styles.rightBox}>
            {consultants?.length > 0 ? <Messenger consultants={consultants} /> : (
                <div className={styles.consultants__skeletonList}>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" width="100%" height={80} sx={{ borderRadius: "22px" }} />
                    ))}
                </div>
            )}

            <div className={styles.titleBox}>
                <h4 className={styles.dashboardTitle}>My Dashboard</h4>
                {isMobile && (
                    <div className={styles.close}>
                        <button onClick={() => setMenuActives({ navigation: false, communication: false })}>
                            <img src={closeIcon} alt="Close" />
                        </button>
                    </div>
                )}
            </div>

            <GeneralStat statics={statics} />

            {services && (services.length > 0) && <h4>Your Services</h4>}
            {services ? (
                <ServiceStat services={services} />
            ) : (
                <div className={styles.services__skeletonList}>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" width="100%" height={70} sx={{ borderRadius: "12px" }} />
                    ))}
                </div>
            )}

           {/* <TrustCreatione />*/}
        </div>
    );
};

export default RightBox;
