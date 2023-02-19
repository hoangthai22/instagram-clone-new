import { InstagramOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { auth, db } from "../firebase/config";
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const history = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((userLogin) => {
            try {
                console.log({ userLogin });
                if (userLogin) {
                    db.collection("users")
                        .where("uid", "==", userLogin.uid)
                        .get()
                        .then((snapshot) => {
                            return snapshot.docs.map((doc) => {
                                setUser({ ...doc.data(), id: doc.id });
                                db.collection("users").doc(doc.id).update({ isOnline: true });
                                if (location.pathname === "/login" || location.pathname === "/register") {
                                    history("/");
                                    console.log("tai sao");
                                }
                                setIsLoading(false);
                                return doc.data();
                            });
                        });
                } else {
                    if (location.pathname === "/login") {
                        history("/login");
                    } else if (location.pathname === "/register") {
                        history("/register");
                    } else {
                        history("/login");
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.log({ error });
                setIsLoading(false);
            }
        });
        //clean function

        return () => {
            unsubscribed();
        };
    }, [history]);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {/* {isLoading ? <Loading/> : children} */}

            {isLoading ? (
                <div className="loading__page">
                    <div className="loading__page__icon">
                        <InstagramOutlined className="loading__page__img" />
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
