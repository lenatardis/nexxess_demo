import React, {useEffect, useState} from "react";
import styles from './Home.module.scss';
import Header from "./Header/Header";
import {Route, Routes} from "react-router-dom";
import HomeContent from "./HomeContent/HomeContent";
import RightBox from "./RightBox/RightBox";
import TrustProcess from "./TrustProcess/TrustProcess";
import MyPurchases from "./MyPurchases/MyPurchases";
import ServicePackages from "./ServicePackages/ServicePackages";
import NewTickets from "./NewTickets/NewTickets";
import MyRequests from "./MyRequests/MyRequests";
import CreateRequest from "./CreateRequest/CreateRequest";
import Invoices from "./Invoices/Invoices";
import FAQ from "./FAQ/FAQ";
import Education from "./Education/Education";
import EditProfile from "./EditProfile/EditProfile";
import LeftBox from "./LeftBox/LeftBox";
import MobSubHeader from "../Common/MobSubHeader/MobSubHeader";
import ServiceTrusts from "./ServiceTrusts/ServiceTrusts";
import Footer from "../Footer/Footer";
import {getAccessToken} from "../../api/localStorage";
import {getPurchases, getPurchasesFiles} from "../../api/pagesApi";
import {useAppDispatch} from "../../hooks/redux";
import {setPurchases} from "../../store/main-slice";
import { useLocation } from "react-router-dom";
import {setNewNotifications} from "../../store/account-slice";
import {getCountNotifications} from "../../api/header";
import MyFiles from "./MyFiles/MyFiles";
import DemoPayment from "./DemoPayment/DemoPayment";
import LegalNotice from "./LegalNotice/LegalNotice";
import DemoChat from "./DemoChat/DemoChat";
import {isPhoneLayout} from "../../settings/layout";

const Home = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [menuActives, setMenuActives] = useState({navigation: false, communication: false});

    useEffect(() => {
        const fetchData = async (page = 1) => {
            try {
                const token = await getAccessToken();

                const [purchasesResponse] = await Promise.all([
                    getPurchases(token, page),
                    getPurchasesFiles(token)
                ]);
                if (purchasesResponse?.results) {
                    dispatch(setPurchases(purchasesResponse.results));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchNewNotifications = async () => {
            try {
                const token = await getAccessToken();

                const count = await getCountNotifications(token);

                if (count?.quantity) {
                    dispatch(setNewNotifications(count.quantity));
                }
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };
        fetchNewNotifications();

    }, [location.pathname]);

    return (
        <>
        <div className={styles.home}>
            <Header />
            {isPhoneLayout() && (
                <MobSubHeader setMenuActives={setMenuActives} menuActives={menuActives} />
            )}
            <div className={styles.centralWrapper}>
                <LeftBox isActive={menuActives.navigation} setMenuActives={setMenuActives}/>
                <div className={styles.content}>
                    <Routes>
                        <Route path={'/'} element={<HomeContent />}/>
                        <Route path={'/trustProcess'} element={<TrustProcess />}/>
                        <Route path={'/myPurchases'} element={<MyPurchases />}/>
                        <Route path={'/myFiles'} element={<MyFiles />}/>
                        <Route path={'/packages'} element={<ServicePackages />}/>
                        <Route path={'/trusts'} element={<ServiceTrusts />}/>
                        <Route path={'/newTickets'} element={<NewTickets />}/>
                        <Route path={'/myRequests'} element={<MyRequests />}/>
                        <Route path={'/createRequest'} element={<CreateRequest />}/>
                        <Route path={'/invoices'} element={<Invoices />}/>
                        <Route path={'/education'} element={<Education />}/>
                        <Route path={'/faq'} element={<FAQ />}/>
                        <Route path={'/personalInformation'} element={<EditProfile />}/>
                        <Route path={'/demoPayment'} element={<DemoPayment />}/>
                        <Route path={'/terms'} element={<LegalNotice title={'Terms of Service'} />}/>
                        <Route path={'/privacy'} element={<LegalNotice title={'Privacy Policy'} />}/>
                    </Routes>
                </div>
                <RightBox isActive={menuActives.communication} setMenuActives={setMenuActives} />
            </div>

        </div>
            <Footer />
            <DemoChat />
            </>
    )
}

export default Home;