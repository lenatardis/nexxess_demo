import React, {useEffect, useState} from "react";
import styles from './ForgotChange.module.scss';
import InputBox from "../../../Common/InputBox/InputBox";
import {passwordOptions} from "../../../../settings/validations";
import Preloader from "../../../Common/Preloader/Preloader";
import {useAppDispatch} from "../../../../hooks/redux";
import {useLocation, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {setResetPassword} from "../../../../api/authApi";

const ForgotChange = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const extractedToken = params.get("token");
        setToken(extractedToken);
    }, [location]);


    const {register, handleSubmit, formState: {errors}, setError, clearErrors
    } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);
        setResetPassword(token, data.newPassword, data.repeatPassword).then((response) => {
            if (response?.errors) setError('All');
            if (response?.success) navigate('/');
        }).finally(() => setIsLoading(false))
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.changePassword}>
            <h3>Change password</h3>
            <InputBox
                errors={errors}
                name="newPassword"
                type="password"
                placeholder="Write new password"
                label="New password"
                options={{
                    ...register("newPassword", {
                        ...passwordOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />

            <InputBox
                errors={errors}
                name="repeatPassword"
                type="password"
                placeholder="Repeat new password"
                label="Repeat new password"
                options={{
                    ...register("repeatPassword", {
                        ...passwordOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />
            <div className={styles.actions}>
                <button className={'darkYellowBtn'} type="submit">
                    <span>Apply</span>
                </button>
            </div>
            {isLoading && <Preloader/>}
        </form>
    )
}

export default ForgotChange;