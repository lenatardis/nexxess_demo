import React from "react";
import DOMPurify from 'dompurify';
import styles from './FeedItem.module.scss';

const FeedItem = ({item}) => {
    let {
        author_photo,
        author_full_name = 'Unknown',
        author_type = 'Unknown',
        published_date = 'Unknown date',
        description,
        files = []
    } = item || {};
    return (
        <div className={styles.feed}>
            <div className={styles.feed__wrap}>
                <div className={styles.titleWrap}>
                    <div className={styles.imgWrap}>
                        <img className={styles.avatar} src={author_photo} alt=""/>
                    </div>
                    <div className={styles.infoWrap}>
                        <p className={styles.name}>{author_full_name}</p>
                        <div className={styles.row}>
                            <p className={styles.position}>{author_type}</p>
                            <p className={styles.date}>{published_date}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.desc}>
                    {description ? (
                        <p dangerouslySetInnerHTML={{ __html:  DOMPurify.sanitize(description) }}></p>
                    ) : (
                        <p>No description available</p>
                    )}
                </div>
                <div className={styles.detailWrap}>
                    <div className={styles.fileBlock}>
                        {files && files.length > 0 && files.map((file, index) => <a key={index} href={file.file} download={file.file_name} target="_blank">
                            {file.file_name}
                        </a>)}
                    </div>
                </div>


            </div>
        </div>
    )
}

export default FeedItem;