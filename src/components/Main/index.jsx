import firebase from "firebase/compat/app";
import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import Messenger from "../../features/Messenger";
import Profile from "../../features/Profile";
import EditProfile from "../../features/Profile/EditProfile";
import ContentComponent from "../Content";
import HeaderComponent from "../Header";
import NoficationMobile from "../Nofication/NoficationMobile";

function Main() {
    const history = useNavigate();
    const { haveHeader, setHaveHeader } = useContext(AppContext);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                history("/login");
                return;
            }
            setHaveHeader(true);
        });
        return () => unregisterAuthObserver();
    }, []);

    const match = useLocation();
    console.log({ match });
    return (
        <div>
            {haveHeader ? <HeaderComponent /> : ""}
            <Routes>
                <Route exact path={`${match.pathname}`} element={<ContentComponent />} />
                <Route path={`${match.pathname}chat`} element={<Messenger />} />
                <Route path={`${match.pathname}edit`} element={<EditProfile />} />
                <Route path={`${match.pathname}profile`} element={<Profile />} />
                <Route path={`${match.pathname}nofication`} element={<NoficationMobile />} />
                {/* <Route component={NotFound} /> */}
            </Routes>
        </div>
    );
}

export default Main;
