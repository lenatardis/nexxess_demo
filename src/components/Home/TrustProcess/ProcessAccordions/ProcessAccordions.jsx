import React from "react";
import styles from './ProcessAccordions.module.scss';
import TrustAccordion from "./TrustAccordion";

const trustList = [
    {
        task_title: 'Trust Book Creation',
        task_created_date: '11.06.2024',
        task_completed: true,
        author: 'Tiana Lubin',
        role: 'Project Manager',
        secondDate: 'July 26, 2024, 05:50 PM',
        checklist: [
            {
                check_list_title: 'Tracking # Assigned',
                check_completed: true,
            },
            {
                check_list_title: 'Trust Book Created',
                check_completed: true,
            },
            {
                check_list_title: 'Trust Book Printed',
                check_completed: true,
            },
        ]
    },
    {
        task_title: 'Trust Book Creation',
        task_created_date: '11.06.2024',
        task_completed: false,
        checklist: [
            {
                check_list_title: 'Tracking # Assigned',
                check_completed: true,
            },
            {
                check_list_title: 'Trust Book Created',
                check_completed: false,
            },
            {
                check_list_title: 'Trust Book Printed',
                check_completed: false,
            },
        ]
    }
]

const ProcessAccordions = ({pipelines}) => {
    return (
        <div className={styles.processAccordions}>
            {pipelines && pipelines.length && (
                pipelines.map((item, index) => (
                    <TrustAccordion key={index} item={item} />
                ))
            )}
        </div>
    )
}

export default ProcessAccordions;