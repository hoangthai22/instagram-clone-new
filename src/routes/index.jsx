import ContentComponent from "../components/Content";
import NoficationMobile from "../components/Nofication/NoficationMobile";
import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import Messenger from "../features/Messenger";
import Profile from "../features/Profile";
import EditProfile from "../features/Profile/EditProfile";
import { DefaultLayout } from "../layouts/DefaultLayout";

const publicRoutes = [
    { path: "/login", component: <Login /> },
    { path: "/register", component: <Register /> },
];
const privateRoutes = [
    { path: "/", component: <ContentComponent /> },
    { path: "/chat/:id", component: <Messenger /> },
    { path: "/edit", component: <EditProfile /> },
    { path: "/profile/:id", component: <Profile /> },
    { path: "/nofication", component: <NoficationMobile /> },
];

export { publicRoutes, privateRoutes };
