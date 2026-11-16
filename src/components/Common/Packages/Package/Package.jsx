import React, {useEffect, useRef, useState, useMemo} from "react";
import styles from "./Package.module.scss";
import {buyPackage} from "../../../../api/pagesApi";
import {getAccessToken} from "../../../../api/localStorage";
import closeIcon from "../../../../assets/icons/closeDark.svg";
import Preloader from "../../Preloader/Preloader";

const Package = ({item, isPurchases}) => {
    const [isShow, setIsShow] = useState(false);
    const [height, setHeight] = useState(0);
    const [serverError, setServerError] = useState(null);
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const descWrapperRef = useRef(null);

    const {name = '', price = 0, image = '', description = ''} = item || {};

    const packageClass = useMemo(() => {
        const firstWord = name.toLowerCase().split(" ")[0];
        if (firstWord === 'nexxess©') {
            return styles.goldPackage;
        }
        return styles[`${firstWord}Package`] || '';
    }, [name]);

    useEffect(() => {
        if (descWrapperRef.current) {
            setHeight(descWrapperRef.current.scrollHeight);
        }
    }, []);

    const onBuyPackage = async (serviceId) => {
        try {
            setIsLoading(true);
            const token = await getAccessToken();
            const response = await buyPackage(token, serviceId);

            if (response?.errors && response?.errors[0]?.detail) {
                setServerError(response?.errors[0]?.detail);
                setIsShowPopup(true);
                setIsLoading(false);
            }
            if (response?.transaction_url) {
                window.location = response.transaction_url;
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error buying package:", error);
        }
    };

    const toggleDescription = () => setIsShow(!isShow);

    const closePopup = () => {
        setIsShowPopup(false);
    }

    return (
        <div className={`${styles.package} ${packageClass}`}>
            <div className={styles.package__wrap}>
                <h4 className={styles.package__title}>{name}</h4>

                <div className={styles.package__imgCover}>
                    <img className={styles.package__mainImg} src={image} alt={name}/>
                    <div className={styles.priceWrap}>
                        <span className={styles.price}>${price}</span>
                    </div>
                </div>

                <div
                    className={styles.descWrapper}
                    ref={descWrapperRef}
                    style={{height: isShow ? `${height}px` : '200px'}}
                >
                    <ul className={isShow ? styles.descShow : styles.desc}>
                        {description.split('<br>').map((line, index) => (
                            <li key={index}>{line.replace(/[•]/g, '')}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.btnWrap}>
                    {!isPurchases && (
                        <button onClick={() => onBuyPackage(item.service_id)} className={styles.add}>
                            Buy
                        </button>
                    )}
                    <button className={styles.read} onClick={toggleDescription}>
                        {isShow ? 'Read Less' : 'Read More'}
                    </button>
                </div>
            </div>
            {isShowPopup && (
                <>
                    <span className={styles.shadowActive}/>
                    <div className={styles.popupActive} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.popupWrap}>
                            <button className={styles.closeBtn} onClick={closePopup}>
                                <img src={closeIcon} alt="close"/>
                            </button>
                            <h4 className={styles.popup__title}>
                                {serverError}
                            </h4>
                        </div>
                    </div>
                </>
            )}
            {isLoading && (
                <Preloader />
            )}
        </div>
    );
};

export default Package;
