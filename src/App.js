import React, { Suspense, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Loading } from "./components/Loading/loading";
import { AppContext } from "./Context/AppProvider";
import AuthLayout from "./layouts/AuthLayout";
import { DefaultLayout } from "./layouts/DefaultLayout";
import NotFoundPage from "./layouts/NotFoundPage";
import { privateRoutes, publicRoutes } from "./routes";
function App() {
    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <Loading />

            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    return <Route key={index} path={route.path} element={<DefaultLayout component={Page} />} />;
                })}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    return <Route key={index} path={route.path} element={<AuthLayout component={Page} />} />;
                })}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}

export default App;
