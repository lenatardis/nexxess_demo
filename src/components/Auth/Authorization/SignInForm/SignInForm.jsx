import React, { useState, useCallback } from "react";
import styles from "../Authorization.module.scss";
import InputBox from "../../../Common/InputBox/InputBox";
import { useAppDispatch } from "../../../../hooks/redux";
import { setAuth } from "../../../../store/account-slice";
import { signUp } from "../../../../api/authApi";
import { useForm } from "react-hook-form";
import {
    cityOptions, countryOptions, emailOptions, emailSecondOptions, firstNameOptions,
    lastNameOptions, passwordOptions, phoneOptions, phoneSecondOptions
} from "../../../../settings/validations";
import Preloader from "../../../Common/Preloader/Preloader";
import ConsultantsList from "./ConsultantsList/ConsultantsList";

const SignInForm = () => {
    const dispatch = useAppDispatch();
    const [consultant, setConsultant] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: { phone: "+", phone_two: "+", phone_three: "+" }
    });

    const onSubmit = useCallback(async (data) => {
        console.log(data);
        setIsLoading(true);
        try {
            const result = await signUp(
                data.phone,
                data.phone_two,
                data.phone_three,
                data.email,
                data.email_two,
                data.email_three,
                data.firstName,
                data.lastName,
                data.country,
                data.city,
                data.password,
                consultant
            );

            if (result?.email && result?.id) {
                dispatch(setAuth(true));
            } else if (result?.errors?.[0]?.attr === "email") {
                setError("email", { type: "manual", message: "Invalid email" });
            }
        } finally {
            setIsLoading(false);
        }
    }, [consultant, dispatch, setError]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.authBox}>
                <div className={styles.authContent}>
                    <div className={styles.authForm}>
                        <h4>Contact Information</h4>
                        <div className={styles.form}>
                            <InputBox errors={errors} name="phone" label="Phone *" placeholder="Phone" type="tel"
                                      options={register("phone", phoneOptions)} />
                            <InputBox errors={errors} name="email" label="E-mail *" placeholder="E-mail"
                                      options={register("email", emailOptions)} />
                            {/*<InputBox errors={errors} name="phone_two" label="Phone 2" placeholder="Phone 2" type="tel"*/}
                            {/*          options={register("phone_two", phoneSecondOptions)} />*/}
                            {/*<InputBox errors={errors} name="email_two" label="E-mail 2" placeholder="E-mail 2"*/}
                            {/*          options={register("email_two", emailSecondOptions)} />*/}
                            {/*<InputBox errors={errors} name="phone_three" label="Phone 3" placeholder="Phone 3" type="tel"*/}
                            {/*          options={register("phone_three", phoneSecondOptions)} />*/}
                            {/*<InputBox errors={errors} name="email_three" label="E-mail 3" placeholder="E-mail 3"*/}
                            {/*          options={register("email_three", emailSecondOptions)} />*/}
                            <InputBox errors={errors} name="firstName" label="First Name" placeholder="First Name"
                                      options={register("firstName", firstNameOptions)} />
                            <InputBox errors={errors} name="lastName" label="Last Name" placeholder="Last Name"
                                      options={register("lastName", lastNameOptions)} />
                            <InputBox errors={errors} name="country" label="Country" placeholder="Country"
                                      options={register("country", countryOptions)} />
                            <InputBox errors={errors} name="city" label="City" placeholder="City"
                                      options={register("city", cityOptions)} />
                            <ConsultantsList consultant={consultant} setConsultant={setConsultant} />
                            <InputBox errors={errors} name="password" type="password" placeholder="Password"
                                      label="Your Password" options={register("password", passwordOptions)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <div className={styles.login} style={{ paddingBottom: "24px" }}>
                    <button className="darkYellowBtn" type="submit">
                        <span>Register</span>
                    </button>
                </div>
            </div>
            {isLoading && <Preloader />}
        </form>
    );
};

export default SignInForm;
