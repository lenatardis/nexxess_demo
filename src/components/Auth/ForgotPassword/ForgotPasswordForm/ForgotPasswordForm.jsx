import React from "react";
import styles from './ForgotPasswordForm.module.scss';
import InputBox from "../../../Common/InputBox/InputBox";
import {emailOptions} from "../../../../settings/validations";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import {sendForgotEmail} from "../../../../api/authApi";


const ForgotPasswordForm = ({setIsLoading, setIsCompleteForm, setDemoResetToken}) => {
    const navigate = useNavigate();

    const {
        register, handleSubmit, formState: {errors}, setError, clearErrors
    } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);
        sendForgotEmail(data?.email).then((result) => {
            if (result?.success) {
                // Demo: the mock answers with the reset token instead of e-mailing the link
                setDemoResetToken(result.demo_reset_token);
                setIsCompleteForm(true)
            }
            if (result?.errors) setError('All');

        }).finally(() => setIsLoading(false))

    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.forgotPassword}>
            <h3>Forgot password</h3>
            <p className={styles.desc}>Enter your email to receive a reset link</p>
            <InputBox errors={errors} name={'email'} type={'text'} placeholder={'Email'} label={'Email address'}
                      options={{
                          ...register("email", {
                              ...emailOptions,
                              onChange: () => clearErrors(),
                          })
                      }}/>
            <div className={styles.actions}>
                <button className={`darkBlueBtn backBtn`} type={'button'} onClick={() => navigate('/')}>
                    <span>Back to log in</span>
                </button>
                <button className={'darkYellowBtn'} type="submit">
                    <span>Apply</span>
                </button>
            </div>
        </form>
    )
}

export default ForgotPasswordForm;