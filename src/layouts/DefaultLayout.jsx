import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

export const DefaultLayout = (props) => {
    const { user } = useContext(AuthContext);

    // if (user.uid) {
    //     return <Navigate to="/" />;
    // }
    return <div>{props.component}</div>;
};
