import { Modal } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { auth, db } from "../../../firebase/config";
import "./style.scss";

export const SettingPostModal = () => {
    const { openSettingPostModal, setOpenSettingPostModal, setOpenDeletePostModal, setOpenUpdateCardModal } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
        setUser,
    } = useContext(AuthContext);
    const history = useNavigate();
    // Submit and add data to firestores
    const handleOk = (values) => {
        setOpenSettingPostModal(false);
    };

    const handleCancel = () => {
        setOpenSettingPostModal(false);
    };

    return (
        <div className="modal__setting__wrap">
            <Modal
                className="my-modal"
                footer={null}
                open={openSettingPostModal}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={450}
                wrapClassName="modal__setting__wrap"
                style={{ borderRadius: 10 }}
                closable={false}
            >
                <div
                    className="modal__setting"
                    onClick={() => {
                        // history("/edit");
                        setOpenSettingPostModal(false);
                        setOpenDeletePostModal(true);
                    }}
                >
                    <span style={{ color: "rgb(237, 73, 86)", fontWeight: 500 }}>Xóa</span>
                </div>
                <div
                    className="modal__setting"
                    onClick={() => {
                        // history("/edit");
                        setOpenSettingPostModal(false);
                        setOpenUpdateCardModal(true);
                    }}
                >
                    <span> Chỉnh sửa bài viết</span>
                </div>
                <div
                    className="modal__setting"
                    onClick={() => {
                        // history("/edit");
                        setOpenSettingPostModal(false);
                    }}
                >
                    <span>Sao chép liên kết</span>
                </div>
                <div className="modal__setting" onClick={handleCancel}>
                    <span>Hủy</span>
                </div>
            </Modal>
        </div>
    );
};
