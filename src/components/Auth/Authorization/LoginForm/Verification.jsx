import React, { useState } from "react";
import styles from '../Authorization.module.scss';
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getEmail } from "../../../../store/selectors";
import InputBox from "../../../Common/InputBox/InputBox";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {loginVerification} from "../../../../api/authApi";
import {setAuth} from "../../../../store/account-slice";
import Preloader from "../../../Common/Preloader/Preloader";
import {useNavigate} from "react-router";
import DemoHint from "../../../Common/DemoHint/DemoHint";
import {demoCode} from "../../../../settings/data";

const Verification = () => {
    const email = useAppSelector(getEmail);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        code: Yup.string()
            .required('Code is required')
            .min(6, 'Code must be at least 6 characters')
            .max(6, 'Code must be exactly 6 characters'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        clearErrors
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        loginVerification(data.code, email).then((response) => {
            if (response && response.access_token && response.refresh_token) {
                dispatch(setAuth(true));
                navigate('/');
            } else if (response?.errors) {
                setError('All');
            }
        }).finally(() => setIsLoading(false))
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.verification}>
            <h3>Enter your code</h3>
            <p>We sent a code to <a target={'_blank'} href={email}>{email}</a></p>
            <InputBox
                errors={errors}
                name="code"
                type="text"
                placeholder="Enter code"
                label="Enter code"
                options={{ ...register("code") }}
            />
            <div className={styles.verification__actions}>
                <button type='submit' className={'darkYellowBtn'}>
                    <span>Apply</span>
                </button>
            </div>
            {isLoading && (
                <Preloader />
            )}
        </form>
        <div className={styles.verification__demo}>
            <DemoHint>
                <p>No e-mail is sent in the demo. Use this code:</p>
                <button type="button" onClick={() => { clearErrors(); setValue('code', demoCode); }}>
                    {demoCode}
                </button>
            </DemoHint>
        </div>
        </>
    );
};

export default Verification;
