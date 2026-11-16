import React, {useState} from "react";
import Preloader from "../../Common/Preloader/Preloader";
import PasswordReset from "./PasswordReset/PasswordReset";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";


const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleteForm, setIsCompleteForm] = useState(false);
    const [demoResetToken, setDemoResetToken] = useState(null);

    return (
        <>
            {isCompleteForm
                ? <PasswordReset demoResetToken={demoResetToken} />
                : <ForgotPasswordForm setIsLoading={setIsLoading} setIsCompleteForm={setIsCompleteForm}
                                      setDemoResetToken={setDemoResetToken}/>
            }
            {isLoading && (
                <Preloader />
            )}
        </>

    )
}

export default ForgotPassword;