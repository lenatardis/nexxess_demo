import React from "react";
import styles from './InputBox.module.scss';

const InputBox = ({errors, name, label, type = 'text', placeholder = '', options, defaultValue = null}) => {

    return (
        <div className={styles.inputBox}>
            <label className={styles.inputBox__label} htmlFor={name}>{label}</label>
            <input className={`${styles.inputBox__input} ${(errors[name] || errors['All']) ? styles.inputBox__error : ''}`} type={type}
                   placeholder={placeholder} id={name} name={name} {...options} defaultValue={defaultValue}/>
            {errors && errors[name] && (
                <p className="errorMsg">{errors[name].message}</p>
            )}
        </div>
    )
}

export default InputBox;