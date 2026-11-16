import React, {useEffect, useState} from "react";
import styles from './EditProfile.module.scss';
import backIcon from '../../../assets/icons/backIcon.svg';
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";
import InputBox from "../../Common/InputBox/InputBox";
import userIcon from "../../../assets/icons/user.svg";
import {useNavigate} from "react-router";
import {useAppSelector} from "../../../hooks/redux";
import {getProfile} from "../../../store/selectors";
import {getAccessToken} from "../../../api/localStorage";
import {editUserInfo} from "../../../api/profileApi";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Preloader from "../../Common/Preloader/Preloader";

const EditProfile = () => {
    const navigate = useNavigate();
    const profile = useAppSelector(getProfile)
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().notRequired().min(3, 'First name should be at-least 3 characters').max(30, ''),
        lastName: Yup.string().notRequired().min(3, 'Last name should be at-least 3 characters').max(30, ''),
        phone: Yup.string().transform(value => value === '+' ? null : value).notRequired().min(6, 'Phone should be at-least 6 characters').max(20, '')
            .matches(/^\+?[0-9]{10,14}$/, 'Invalid phone number format'),
        phone_two: Yup.string().transform(value => value === '+' ? null : value).notRequired().min(6, 'Phone should be at-least 6 characters').max(20, '')
            .matches(/^\+?[0-9]{10,14}$/, 'Invalid phone number format'),
        phone_three: Yup.string().transform(value => value === '+' ? null : value).notRequired().min(6, 'Phone should be at-least 6 characters').max(20, '')
            .matches(/^\+?[0-9]{10,14}$/, 'Invalid phone number format'),
        email: Yup.string().notRequired().matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, 'Email is not valid'),
        email_two: Yup.string()
            .nullable()
            .notRequired()
            .test('is-valid-email-or-empty', 'Email 2 is not valid', function (value) {
                if (!value) return true;
                return /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(value);
            }),
        email_three: Yup.string()
            .nullable()
            .notRequired()
            .test('is-valid-email-or-empty', 'Email 2 is not valid', function (value) {
                if (!value) return true;
                return /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(value);
            }),
        country: Yup.string().transform(value => value === '' ? null : value).notRequired().min(3, 'Country name should be at-least 3 characters').max(15, ''),
        city: Yup.string().transform(value => value === '' ? null : value).notRequired().min(3, 'City name should be at-least 3 characters').max(15, ''),
        street: Yup.string().transform(value => value === '' ? null : value).notRequired().min(3, 'Street name should be at-least 3 characters').max(15, ''),
        password: Yup.string().transform(value => value === '' ? null : value).notRequired().min(10, 'Password must be at least 10 characters long with at least one capital letter'),
        newPassword: Yup.string().transform(value => value === '' ? null : value).notRequired().min(10, 'Password must be at least 10 characters long with at least one capital letter'),
    });

    const {
        register, handleSubmit, formState: {errors}, setError
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            phone: profile?.phone || "+",
            phone_two: profile?.phone_two || "+",
            phone_three: profile?.phone_three || "+",
            email: profile?.email || '',
            email_two: profile?.email_two || '',
            email_three: profile?.email_three || '',
            country: profile?.country || '',
            city: profile?.city || '',
            street: profile?.street || '',
        }
    });

    useEffect(() => {
        if (profile?.photo) {
            setImgData(profile.photo)
        }
    }, [profile])

    const getFile = (e) => {
        if (e.target.files[0]) {
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
            return e.target.files[0];
        }
    }

    const onSubmit = (data) => {
        setIsLoading(true)

        getAccessToken().then((token) => {
            const payload = {
                email: data.email !== profile.email && data.email ? data.email : null,
                email_two: data.email_two !== profile.email_two && data.email_two ? data.email_two : null,
                email_three: data.email_three !== profile.email_three && data.email_three ? data.email_three : null,
                photo: picture ? picture : null,
                firstName: data.firstName !== profile.first_name && data.firstName ? data.firstName : null,
                lastName: data.lastName !== profile.last_name && data.lastName ? data.lastName : null,
                phone: data.phone !== profile.phone && data.phone ? data.phone : null,
                phone_two: data.phone_two !== profile.phone_two && data.phone_two ? data.phone_two : null,
                phone_three: data.phone_three !== profile.phone_three && data.phone_three ? data.phone_three : null,
                country: data.country !== profile.country && data.country ? data.country : null,
                city: data.city !== profile.city && data.city ? data.city : null,
                street: data.street !== profile.street && data.street ? data.street : null,
                current_password: data.password !== '' ? data.password : null,
                password: data.newPassword !== '' ? data.newPassword : null,
            };

            const cleanedPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => value !== null)
            );

            editUserInfo(token, cleanedPayload).finally(() => setIsLoading(false))
                .then(response => {
                    if (response?.errors) {
                        if (response.errors[0].detail === "The current password is incorrect") {
                            setError("password", { type: "manual", message: "Invalid Current Password" })
                        }
                    }
                })
                .catch(error => {
                    console.error("Error updating user info:", error);
                });
        }).catch(error => {
            console.error("Error fetching token:", error);
        })
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.editProfile}>
            <Breadcrumbs secondPage={{utl: '/personalInformation', name: 'Personal information'}}/>
            <h3 className={styles.mainTitle}>Edit profile</h3>
            <div className={styles.profileWrap}>
                <div className={`${styles.profileBox} ${styles.personalInfo}`}>
                    <h4>Personal Information</h4>
                    <div className={styles.outerWrap}>
                        <div className={styles.imgBlock}>
                            {!imgData ? <div className={styles.imgPlaceholder}>
                                <img src={userIcon} alt=""/>
                            </div> : <img className={styles.profileImg} src={imgData} alt=''/>}
                            <div className={styles.fileInputWrap}>
                                <input type="file" className={styles.fileInput} onChange={(e) => {
                                    getFile(e)
                                }}/>
                                <p>Change Photo</p>
                            </div>
                        </div>
                        <div className={styles.wrap}>
                            <div className={styles.column}>
                                <InputBox errors={errors} name={'firstName'} label={'First name'} placeholder={'First name'}
                                          type={'text'} options={{...register('firstName')
                                }}/>
                            </div>
                            <div className={styles.column}>
                                <InputBox errors={errors} name={'lastName'} label={'Last name'} placeholder={'Last name'}
                                          type={'text'} options={{
                                    ...register("lastName")
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <h4>Contact Information</h4>
                    <div className={styles.wrap}>
                        <div className={styles.column}>
                            <InputBox errors={errors} name={'phone'} label={'Phone'} placeholder={'Phone'} type={'tel'}
                                      options={{...register("phone")}}/>
                            <InputBox errors={errors} name={'phone_two'} label={'Phone 2'} placeholder={'Phone 2'} type={'tel'}
                                      options={{...register("phone_two")}}/>
                            <InputBox errors={errors} name={'phone_three'} label={'Phone 3'} placeholder={'Phone 3'} type={'tel'}
                                      options={{...register("phone_three")}}/>
                            <InputBox errors={errors} name={'country'} label={'Country'} placeholder={'Country'}
                                      type={'text'} options={{...register("country")}}/>
                            <InputBox errors={errors} name={'street'} label={'Street'} placeholder={'Street'}
                                      type={'text'} options={{...register("street")}}/>
                        </div>
                        <div className={styles.column}>
                            <InputBox errors={errors} name={'email'} type={'text'} label={'E-mail'}
                                      placeholder={'E-mail'} options={{...register("email")}}/>
                            <InputBox errors={errors} name={'email_two'} type={'text'} label={'E-mail 2'}
                                      placeholder={'E-mail 2'} options={{...register("email_two")}}/>
                            <InputBox errors={errors} name={'email_three'} type={'text'} label={'E-mail 3'}
                                      placeholder={'E-mail 3'} options={{...register("email_three")}}/>
                            <InputBox errors={errors} name={'city'} label={'City'} placeholder={'City'} type={'text'}
                                      options={{...register("city")}}/>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <h4>Password</h4>
                    <div className={styles.wrap}>
                        <div className={styles.column}>
                            <InputBox errors={errors} name={'password'} type={'password'} placeholder={'Current password is empty'}
                                      label={'Current Password'} options={{...register("password")}}/>
                        </div>
                        <div className={styles.column}>
                            <InputBox errors={errors} name={'newPassword'} type={'password'} placeholder={'New password is empty'}
                                      label={'New Password'} options={{...register("newPassword")}}/>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button className={'darkBlueBtn'} type={'button'} onClick={() => navigate('/')}>
                        <img src={backIcon} alt=""/>
                        <span>Back to home</span>
                    </button>
                    <button className={'darkYellowBtn'} type={'submit'}>
                        <span>Save changes</span>
                    </button>
                </div>
            </div>
            {isLoading && (
                <Preloader />
            )}
        </form>
    )
}

export default EditProfile;