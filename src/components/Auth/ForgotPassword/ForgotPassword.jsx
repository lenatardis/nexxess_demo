import React, {useState} from "react";
import Preloader from "../../Common/Preloader/Preloader";
import PasswordReset from "./PasswordReset/PasswordReset";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";


const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleteForm, setIsCompleteForm] = useState(false);

    return (
        <>
            {isCompleteForm
                ? <PasswordReset />
                : <ForgotPasswordForm setIsLoading={setIsLoading} setIsCompleteForm={setIsCompleteForm}/>
            }
            {isLoading && (
                <Preloader />
            )}
        </>

    )
}

export default ForgotPassword;