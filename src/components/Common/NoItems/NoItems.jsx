import React from "react";
import styles from './NoItems.module.scss';
import image from '../../../assets/img/noitems.png';

const NoItems = () => {
    return (
        <div className={styles.noItems}>
          <h3>
              <span>Unfortunately, we can’t find any items. Please try again later</span>
          </h3>
            <div className={styles.imgCover}>
                <img src={image} alt=""/>
            </div>
        </div>
    )
}

export default NoItems;