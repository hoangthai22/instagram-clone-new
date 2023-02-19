import { Modal, Spin, Upload } from "antd";
import React, { useContext, useState } from "react";
import ImgCrop from "antd-img-crop";
import { AppContext } from "../../../Context/AppProvider";
import { LoadingOutlined } from "@ant-design/icons";
import { addDocument, uploadFile } from "../../../firebase/services";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
const UploadImgModal = () => {
    const {
        user: { uid, photoURL, displayName },
        user,
    } = useContext(AuthContext);
    const { openUpdaloadModal, setOpenUpdaloadModal, selectedRoomId } = useContext(AppContext);
    const [fileList, setFileList] = useState([]);
    const [isValidForm, setIsValidForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const onChange = ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            setIsValidForm(true);
        } else {
            setIsValidForm(false);
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
    function hanldeSubmit() {
        setIsLoading(true);
        uploadFile("posts", uid, fileList[0]).then((img) => {
            Promise.all([
                addDocument("messages", {
                    text: {
                        message: ` <div className="image-message">
                                    <img src="${img}" alt="" />
                                </div>`,
                    },
                    uid,
                    photoURL,
                    roomId: selectedRoomId.filter((i) => i.length > 0).toString(),
                    displayName,
                }),
                db
                    .collection("nofications")
                    .where("roomId", "==", selectedRoomId.filter((i) => i.length > 0).toString())
                    .get()
                    .then((snapshot) => {
                        snapshot.docs.map((doc) => {
                            if (doc.data().uid !== uid) {
                                db.collection("nofications").doc(doc.id).update({ seen: false });
                            }
                        });
                    }),
            ]).then(() => {
                setFileList([]);
                setOpenUpdaloadModal(false);
                setIsLoading(false);
            });
        });
    }
    return (
        <Modal width={350} centered footer={null} title="Thêm hình ảnh" open={openUpdaloadModal} onCancel={() => setOpenUpdaloadModal(false)}>
            <div className="form__add__card">
                <div style={{ width: 300, height: 300, position: "relative" }}>
                    {/* {fileList.length === 0 ? ( */}
                    <div className="image-crop">
                        <ImgCrop rotate>
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                onDownload={(e) => {
                                    console.log({ e });
                                }}
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
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
                            paddingTop: 10,
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: "#fff",
                            color: `${!isValidForm ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                        }}
                        disabled={isLoading || !isValidForm}
                        className={!isValidForm ? "form__add__card__button-invalid" : ""}
                        type="submit"
                        onClick={() => {
                            console.log("ok");
                            hanldeSubmit();
                        }}
                        // disabled={isSubmitting}
                    >
                        <span>{isLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : "Gửi"}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UploadImgModal;
