import { Layout, Row, Col } from "antd";
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import ChatWindow from "./../Messenger/ChatWindow";
import SideBar from "./../Messenger/SideBar";
import "./style.scss";
const { Content } = Layout;

const Messenger = () => {
    const { setIconActiveIndex, setSelectedUserId, selectedUserId } = useContext(AppContext);
    const location = useLocation();
    useEffect(() => {
        setIconActiveIndex(1);
        const uidPath = location.pathname.split("/")[2].toString();
        if (location.pathname.split("/")[2] === "inbox") {
            setSelectedUserId("");
        } else {
            setSelectedUserId(uidPath);
        }
    }, [location.pathname]);
    return (
        <Content className="content__messenger">
            <Row className="content__messenger__row">
                <Col style={{ display: "flex", width: "100%" }}>
                    <SideBar className="sideBar__mobile" />
                    <ChatWindow className="chatwindow__mobile" />
                </Col>
            </Row>
        </Content>
    );
};

export default Messenger;
