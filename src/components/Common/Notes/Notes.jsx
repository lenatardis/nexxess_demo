import React from "react";
import styles from './Notes.module.scss';
import HandIcon from "../../../assets/icons/hand.svg";


const Notes = () => {
    let rawText = `
        · Trust replacement Book Fee - $400 per book.
        · Tax return service charge starts at $2000 per trust at Nexxess third party recommended group.
        · Bookkeeping can be arranged with a Nexxess third party recommended group.
        · Packages may be purchased or upgraded at any time.
        · Hours within a package can be used for two or more purchased Nexxess© Trusts. (Gold/Platinum/Blue Diamond/BDPlus Package is required for two trusts)
        · Additional consultation hours may be purchased at Nexxess© standard hourly rate or client’s previous package hourly rate.
        ° Additional or certain entities may require extra expense determined by Nexxess© International.
        * Trust Audit Defense (TAD) is limited to 25 hours of legal services for clients using third party Nexxess© Trust Tax Service groups if Nexxess© Trust is challenged.
        ** Survivorship Service helps newly appointed successor trustees and/or trust administrators receive up to (6) six hours of consultation after the death of a Trustee and/or Trust Administrator if package term or hours have expired.
    `;

    const notes = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => line.replace(/^·\s+/, ""));
    return (
        <div className={styles.notes}>
            <div className={styles.notes__title}>
                <div className={styles.hand}>
                    <img src={HandIcon} alt=""/>
                </div>
                <h4>Additional purchases and notes</h4>
            </div>
            <div className={styles.notes__wrap}>
                {notes.map((note, index) => (
                    <p key={index}>{note}</p>
                ))}
            </div>
        </div>
    )
}

export default Notes;