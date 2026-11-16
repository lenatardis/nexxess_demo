import React from "react";
import styles from './Learns.module.scss';
import Learn from "./Learn";
import img1 from '../../../../assets/img/educations1.jpg'
import img2 from '../../../../assets/img/educations2.jpg'
import img3 from '../../../../assets/img/educations3.jpg'

const Learns = ({list}) => {
    console.log(list);
    const learns = [
        {title: 'Trust Basics', text: 'Fundamental knowledge and operational methods for your Nexxess Trust'},
        {title: 'Course 2', text: 'Vivamus at augue eget arcu dictum varius duis at consectetur. Nunc pulvinar sapien et ligula. Egestas congue quisque egestas diam in arcu cursus euismod quis. Cursus metus aliquam eleifend mi in. Quam lacus suspendisse faucibus interdum posuere lorem. Vulputate odio ut enim blandit!'},
        {title: 'Course 3', text: 'Vivamus at augue eget arcu dictum varius duis at consectetur. Nunc pulvinar sapien et ligula. Egestas congue quisque egestas diam in arcu cursus euismod quis. Cursus metus aliquam eleifend mi in. Quam lacus suspendisse faucibus interdum posuere lorem. Vulputate odio ut enim blandit.'},
        {title: 'Course 4', text: 'Nunc pulvinar sapien et ligula. Egestas congue quisque egestas diam in arcu cursus euismod quis. Cursus metus aliquam eleifend mi in. Quam lacus suspendisse faucibus interdum posuere lorem. Vulputate odio ut enim blandit.'},
    ];

    return (
        <div className={styles.learns}>
            <div className={styles.learns__header}>
                <p className={styles.learns__title}>Fund Academy Modules</p>
                <div className={styles.learns__count}>
                    <span>{learns.length}</span>
                </div>
            </div>
            <div className={styles.learnsList}>
                {learns && learns.length && (
                    learns.map((item, index) => (
                        <Learn key={index} item={item} index={index} img1={img1} img2={img2} img3={img3} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Learns;