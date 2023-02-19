import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { auth, db } from "../../../firebase/config";
import { deleteDocument } from "../../../firebase/services";
import "./style.scss";

export const ConfirmDeleteModal = () => {
    const { openDeletePostModal, setOpenDeletePostModal, setOpenCardModal, postInf, setProfileInfo, profileInfo } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
        setUser,
    } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const history = useNavigate();
    // Submit and add data to firestores
    const handleOk = (values) => {
        setOpenDeletePostModal(false);
    };

    const handleCancel = () => {
        setOpenDeletePostModal(false);
    };

    return (
        <div className="modal__setting__wrap">
            <Modal
                className="my-modal"
                footer={null}
                open={openDeletePostModal}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={450}
                wrapClassName="modal__setting__wrap"
                style={{ borderRadius: 10 }}
                closable={false}
            >
                <div className="modal__setting__title">
                    <span>Xóa bài viết?</span>
                    <span>Bạn có chắc chắn muốn xóa bài viết này không?</span>
                </div>
                <div
                    className="modal__setting"
                    onClick={() => {
                        // history("/edit");
                        setIsLoading(true);
                        deleteDocument("post", postInf.documentId).then(() => {
                            setProfileInfo({ ...profileInfo, posts: profileInfo.posts.filter((i) => i.postId !== postInf.postId) });
                            setOpenDeletePostModal(false);
                            setOpenCardModal(false);
                            setIsLoading(false);
                        });
                    }}
                >
                    <span style={{ color: "rgb(237, 73, 86)", fontWeight: 500 }}>
                        <span>{isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "rgb(237, 73, 86)" }} spin />} /> : "Xóa"}</span>
                    </span>
                </div>

                <div className="modal__setting" onClick={handleCancel}>
                    <span>Hủy</span>
                </div>
            </Modal>
        </div>
    );
};
