import React from "react";
import styles from './Breadcrumbs.module.scss';
import {Link} from 'react-router-dom';


const Breadcrumbs = ({secondPage = null, thirdPage = null, fourthPage = null}) => {
    return (
        <div className={styles.breadcrumbs}>
            <Link to={'/'}>Feed</Link>
            <span>/</span>
            {secondPage && (
                thirdPage
                    ? <Link to={secondPage?.url}>{secondPage?.name}</Link>
                    : <span>{secondPage?.name}</span>

            )}
            {thirdPage && (
                <span>/</span>
            )}
            {thirdPage && (
                fourthPage
                ? <Link to={thirdPage?.url}>{thirdPage?.name}</Link>
                : <span>{thirdPage?.name}</span>
            )}
        </div>
    )
}

export default Breadcrumbs;