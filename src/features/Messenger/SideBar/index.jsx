import { DownOutlined, UserAddOutlined } from "@ant-design/icons";
import { Col, Typography } from "antd";
import React, { useContext } from "react";
import { MODAL_MODE_INVITE } from "../../../constants/modalMode";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import ListUser from "../ListUser";
import "./style.scss";
const { Text } = Typography;

const SideBar = (props) => {
    const { user } = useContext(AuthContext);
    const { setisInviteMember, isMessage, setIsShowModalMode } = useContext(AppContext);
    return (
        <Col className={!isMessage ? "sidebar__header active-message" : "sidebar__header inactive-message"}>
            <div className="sidebar__header__wrap">
                <div className="sidebar__header__title">
                    <Text strong className="sidebar__header__title-text" style={{ fontSize: "1rem" }}>
                        {user.displayName}
                        <DownOutlined style={{ marginLeft: 10 }} />
                    </Text>
                </div>
                <div className="sidebar__header__tab">
                    <Text strong className="sidebar__header__tab-text">
                        <span style={{ fontSize: "1rem" }}> Chính</span>
                    </Text>
                    <Text
                        className="sidebar__header__tab-text"
                        onClick={() => {
                            setisInviteMember(true);
                            setIsShowModalMode(MODAL_MODE_INVITE);
                        }}
                        type="text"
                        style={{ fontSize: "1.1rem" }}
                    >
                        <UserAddOutlined />
                        <Text strong className="sidebar__header__tab-text">
                            <span style={{ fontSize: "1rem" }}> Tìm bạn</span>
                        </Text>
                    </Text>
                </div>
                <ListUser />
            </div>
        </Col>
    );
};

export default SideBar;
