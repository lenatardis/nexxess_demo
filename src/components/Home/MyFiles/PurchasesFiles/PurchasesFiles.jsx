import React, {useEffect} from "react";
import styles from "../../MyPurchases/MyPurchases.module.scss";
import FileIcon from "../../../../assets/icons/file.svg";
import {getFileExtensionFromMimeType} from "../../../../settings/fileFormats";


const PurchasesFiles = ({files, isRow = false}) => {

    function getFileNameWithoutExtension(filename) {
        return filename.substring(0, filename.lastIndexOf(".")) || filename;
    }

    const getFileTypeClass = (type) => {
        if (['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'].includes(type)) {
            return styles.xls;
        } else if (['docx', 'doc'].includes(type)) {
            return styles.doc;
        } else if (['png', 'jpeg', 'jpg', 'svg', 'webp', 'gif', 'bmp'].includes(type)) {
            return styles.image;
        } else if (['mp4', 'webm', 'mov', 'mkv'].includes(type)) {
            return styles.video;
        } else if (['zip', 'rar', 'tar', 'gz'].includes(type)) {
            return styles.archive;
        }
        return '';
    };

    return (<div className={isRow ? styles.fileBoxRow : styles.fileBox}>
        {files && files?.length > 0 ? files.map((file, index) => {
            const type = getFileExtensionFromMimeType(file.file_type);
            const isDownloadable = type === "xls" || type === "xlsx" || type === "docx";
            const fileTypeClass = getFileTypeClass(type);
            return (<a href={file.file} className={isRow ? styles.linkRow : styles.link}
                       download={isDownloadable ? file.file_name : undefined}
                       target={!isDownloadable ? "_blank" : undefined}
                       rel={!isDownloadable ? "noopener noreferrer" : undefined}
                       key={index}>
                            <span className={`${styles.shapeWrap} ${fileTypeClass}`}>
                                <span className={styles.shape}><img src={FileIcon} alt=""/></span>
                                <span className={styles.type}><span>{type}</span></span>
                            </span>
                <span className={styles.title}>{getFileNameWithoutExtension(file.file_name)}</span></a>)
        }) : <div className={styles.notFiles}>
            <p>The documents will be posted here</p>
            <p>(Nothing available yet)</p>
        </div>}
    </div>)
}

export default PurchasesFiles;