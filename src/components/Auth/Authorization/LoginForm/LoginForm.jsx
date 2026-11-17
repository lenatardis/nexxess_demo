import React, { useEffect, useState } from "react";
import styles from "../Authorization.module.scss";
import InputBox from "../../../Common/InputBox/InputBox";
import { useAppDispatch } from "../../../../hooks/redux";
import { setEmail } from "../../../../store/account-slice";
import { login } from "../../../../api/authApi";
import GoogleAuth from "./GoogleAuth";
import { useForm } from "react-hook-form";
import { emailOptions, passwordOptions } from "../../../../settings/validations";
import { useNavigate } from "react-router";
import Preloader from "../../../Common/Preloader/Preloader";
import { demoPassword } from "../../../../settings/data";

// Demo: `demoPick` comes from the demo hint above the tabs (Authorization.jsx)
const LoginForm = ({ demoPick }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError, clearErrors, setValue } = useForm();

    // Demo: a click on a demo account fills the form; the two login steps stay as they are
    useEffect(() => {
        if (!demoPick) return;
        clearErrors();
        setValue("email", demoPick.email);
        setValue("password", demoPassword);
    }, [demoPick, clearErrors, setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await login(data.email, data.password);
            if (response?.success) {
                dispatch(setEmail(data.email));
                navigate("/verification");
            } else if (response?.errors?.[0]?.code === "authentication_failed") {
                setError("All");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.authBox}>
                <div className={styles.authContent}>
                    <div className={styles.authForm}>
                        <h4>Enter your login and password</h4>
                        <div className={styles.form}>
                            <InputBox
                                errors={errors}
                                name="email"
                                type="text"
                                placeholder="E-mail"
                                label="Your E-mail"
                                options={{
                                    ...register("email", {
                                        ...emailOptions,
                                        onChange: () => clearErrors(),
                                    }),
                                }}
                            />
                            <InputBox
                                errors={errors}
                                name="password"
                                type="password"
                                placeholder="Password"
                                label="Your password"
                                options={{
                                    ...register("password", {
                                        ...passwordOptions,
                                        onChange: () => clearErrors(),
                                    }),
                                }}
                            />
                        </div>
                        <div className={styles.forgot}>
                            <button
                                className={styles.forgot__btn}
                                type="button"
                                onClick={() => navigate("/forgotPassword")}
                            >
                                <p>Forgot password</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <div className={styles.login}>
                    <button className="darkYellowBtn" type="submit">
                        <span>Log In</span>
                    </button>
                </div>
                <span className={styles.actions__topText}>or</span>
                <GoogleAuth setIsLoading={setIsLoading} />
            </div>
            {isLoading && <Preloader />}
        </form>
    );
};

export default LoginForm;
