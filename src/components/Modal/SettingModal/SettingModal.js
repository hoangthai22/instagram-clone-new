import { Modal } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { auth, db } from "../../../firebase/config";
import "./style.scss";

export const SettingModal = () => {
    const { openSettingModal, setOpenSettingModal, setHaveHeader } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
        setUser,
    } = useContext(AuthContext);
    const history = useNavigate();
    // Submit and add data to firestores
    const handleOk = (values) => {
        setOpenSettingModal(false);
    };

    const handleCancel = () => {
        setOpenSettingModal(false);
    };
    const hanldeSignOut = async () => {
        setHaveHeader(false);
        await auth.signOut();
        history("/login");

        db.collection("users")
            .where("uid", "==", uid)
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    db.collection("users").doc(doc.id).update({ isOnline: false });
                    setUser({});
                });
            });
        setOpenSettingModal(false);
    };
    return (
        <div className="modal__setting__wrap">
            <Modal
                className="my-modal"
                footer={null}
                open={openSettingModal}
                onOk={handleOk}
                onCancel={handleCancel}
                wrapClassName="modal__setting__wrap"
                style={{ borderRadius: 10 }}
                closable={false}
            >
                <div
                    className="modal__setting"
                    onClick={() => {
                        history("/edit");
                        setOpenSettingModal(false);
                    }}
                >
                    <span>Đổi mật khẩu</span>
                </div>
                <div
                    className="modal__setting"
                    onClick={() => {
                        history("/edit");
                        setOpenSettingModal(false);
                    }}
                >
                    <span> Chỉnh sửa thông tin cá nhân</span>
                </div>
                <div className="modal__setting" onClick={hanldeSignOut}>
                    <span>Đăng xuất</span>
                </div>
            </Modal>
        </div>
    );
};
