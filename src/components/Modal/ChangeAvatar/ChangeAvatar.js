import { CheckCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
import { Modal, notification, Spin, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import { uploadFile } from "../../../firebase/services";
import { openNotification } from "../../Nofication";
import "./style.scss";

export const ChangeAvatarModal = () => {
    const { openChangeAvatarModal, setOpenChangeAvatarModal } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName, id },
        setUser,
        user,
    } = useContext(AuthContext);

    const [fileList, setFileList] = useState([]);
    const [imageReview, setImageReview] = useState(null);
    const [isValidForm, setIsValidForm] = useState(false);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const history = useNavigate();
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const onChange = ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            setIsValidForm(true);
            console.log("true");
        } else {
            setIsValidForm(false);
            console.log("false");
        }
        setFileList(newFileList);
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    // Submit and add data to firestores
    const handleOk = async () => {
        setIsLoadingBtn(true);
        await uploadFile("posts", uid, fileList[0]).then((img) => {
            console.log(img);
            db.collection("users")
                .doc(id)
                .update({ photoURL: img })
                .then(() => {
                    setUser({ ...user, photoURL: img });
                })
                .then(() => {
                    setIsLoadingBtn(false);
                    setIsValidForm(false);
                    openNotification("topRight", "Cập nhật thông tin thành công", "success");
                    setFileList([]);
                });
        });

        setOpenChangeAvatarModal(false);
    };

    const handleCancel = () => {
        setOpenChangeAvatarModal(false);
        setFileList([]);
        setImageReview(null);
    };

    return (
        <>
            <Modal width={350} footer={null} title="Thay đổi ảnh đại diện" open={openChangeAvatarModal} onOk={handleOk} onCancel={handleCancel}>
                <div style={{ width: 300, height: 300, position: "relative" }}>
                    {/* {fileList.length === 0 ? ( */}
                    <div className="image-crop">
                        <ImgCrop rotate>
                            <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" fileList={fileList} onChange={onChange} onPreview={onPreview}>
                                {fileList.length < 1 && "+ Upload"}
                            </Upload>
                        </ImgCrop>
                    </div>
                </div>
                <div className="form__add__card__button">
                    <button
                        style={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            padding: "20px 10px",
                            height: 30,
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: "#fff",
                            color: `${!isValidForm ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                        }}
                        disabled={!isValidForm}
                        className={!isValidForm ? "form__add__card__button-invalid" : ""}
                        onClick={handleOk}
                    >
                        <span>{isLoadingBtn ? <Spin indicator={antIcon} /> : "Đồng ý"}</span>
                    </button>
                </div>
            </Modal>
        </>
    );
};
