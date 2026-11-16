import React, {useState} from "react";
import styles from './ProcessAccordions.module.scss';
import dateIcon from '../../../../assets/icons/dateIcon.svg';
import checkedTrue from '../../../../assets/icons/checkedTrue.svg';
import checkedFalse from '../../../../assets/icons/checkedFalse.svg';
import Comment from "./Comment/Comment";

const TrustAccordion = ({item}) => {
    const [isShow, setIsShow] = useState(false);

    const handleStatus = (value) => {
        if (value.completed) {
            return '#6AC8A2'
        }
        if (!value.completed && !value.running) {
            return '#C7B892'
        }
        if (!value.completed && value.running) {
            return '#6C87E8'
        }
    }

    return (
        <div className={styles.accordion}>
            <div className={styles.accordion__header} onClick={() => setIsShow(!isShow)}>
                <p className={styles.accordion__headerTitle}
                   style={{
                       color: handleStatus({
                           completed: item.task_completed,
                           running: item.task_running
                       })
                   }}>{item.deal_status}</p>
                {item.task_created_date && (
                    <p className={styles.accordion__headerDate}>
                        <img src={dateIcon} alt=""/>
                        <span>{item.task_created_date}</span>
                    </p>
                )}
            </div>
            <div className={isShow ? styles.accordion__content : styles.accordion__contentHide}>
                <div className={styles.tasks}>
                    {item.checklist && item.checklist.length && (
                        item.checklist.map((task, index) => (
                            <div className={task.check_completed ? styles.tasks__item : styles.tasks__itemFalse}
                                 key={index}>
                                <img src={task.check_completed ? checkedTrue : checkedFalse} alt=""/>
                                <p>{task.check_list_title}</p>
                            </div>
                        ))
                    )}
                </div>
                {item?.comments?.length ? (
                    <div className={styles.comments}>
                        <div className={styles.comments__header}>
                            <h4>Comments</h4>
                            <div className={styles.comments__content}>
                                {item.comments.map((comment, index) => (
                                    <Comment item={comment} key={index}/>
                                ))}
                            </div>
                            {/*<p>{item.author} <span>{item.role}</span></p>*/}
                        </div>
                    </div>
                ) : null}
                {item.secondDate && (
                    <p className={styles.secondDate}>{item.secondDate}</p>
                )}
            </div>
        </div>
    )
}

export default TrustAccordion;