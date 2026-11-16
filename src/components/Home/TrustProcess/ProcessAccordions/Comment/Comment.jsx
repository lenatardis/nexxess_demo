import React from "react";
import DOMPurify from 'dompurify';
import styles from './Comment.module.scss';

const Comment = ({item}) => {

    let {
        comment_text = 'Unknown text',
        comment_create_date = 'Unknown date',
        comment_author_name = 'Unknown author',
        comment_files = []
    } = item || {};

    return (
        <div className={styles.comment}>
            <div className={styles.comment__message}>
                <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment_text)}}></p>
                {comment_files && <div className={styles.fileBlock}>
                    {comment_files && comment_files.length > 0 && comment_files.map((file, index) => <div key={index}><a
                        href={file?.file}
                        target="_blank"
                        download={file?.file_name}>
                        {file?.file_name}
                    </a></div>)}
                </div>}
            </div>
            <div className={styles.comment__data}>
                <p>{comment_create_date}</p>
                <p><span>{comment_author_name}</span></p>
            </div>
        </div>
    )
}

export default Comment;