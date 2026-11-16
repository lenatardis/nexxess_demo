import React, {useEffect, useState} from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import styles from './Education.module.scss';
import Learns from "./Learns/Learns";
import banner from '../../../assets/img/educationBaner.jpg';
import ed1 from '../../../assets/img/educations1.jpg';
import {getEducationCourse, getEducations} from "../../../api/pagesApi";
import {getAccessToken} from "../../../api/localStorage";
import SkeletonEducation from "./Learns/SkeletonEducation/SkeletonEducation";

const Education = () => {
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = await getAccessToken();
                const response = await getEducations(token);
                if (response?.results) {
                    if (response?.results) setList(response.results)
                }
            } catch (error) {
                console.error('Error fetching educations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [])

    return (
        <div className={styles.education}>
            <Breadcrumbs secondPage={{utl: '/education', name: 'Education'}} />
            <h3>Education</h3>
            <div className={styles.education__banner}>
                <img src={banner} alt=""/>
                <div className={styles.textBox}>
                    <p>Nexxess Trust Academy</p>
                </div>
            </div>
            <div className={styles.currentLearn}>
                <div className={styles.currentLearn__leftBox}>
                    <div className={styles.currentLearn__image}>
                        <img src={ed1} alt=""/>
                    </div>
                    <div className={styles.currentLearn__progress}>
                        <h5>Trust Academy</h5>
                        <p>My progress: <span>56%</span></p>
                        <p className={styles.currentLearn__progressLine}><span style={{width: '56%'}}/></p>
                    </div>
                </div>
                <div className={styles.currentLearn__rightBox}>
                    <p>Viewed lessons: <span>9</span>/ 16</p>
                    <p><span>56%</span> completed</p>
                    <p>Access to: <span>Unlimited</span></p>
                </div>
            </div>
            {isLoading ? (
                <SkeletonEducation />
            ) : (
                <Learns list={list} />
            )}
        </div>
    )
}

export default Education;