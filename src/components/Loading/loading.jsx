import "./style.scss";
import * as React from "react";
import { AppContext } from "../../Context/AppProvider";
import { InstagramOutlined } from "@ant-design/icons";

export const Loading = () => {
    const { isLoadingMain } = React.useContext(AppContext);
    return (
        <div className="loading__page">
            {isLoadingMain ? (
                <div className="loading__page__icon">
                    <InstagramOutlined className="loading__page__img" />
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
