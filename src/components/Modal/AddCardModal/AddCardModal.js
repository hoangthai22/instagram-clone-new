import { LoadingOutlined } from "@ant-design/icons";
import { Input, Modal, Spin, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument, stringToHash, uploadFile } from "../../../firebase/services";
import "./style.scss";

export const AddCardModal = () => {
    const { openAddCardModal, setOpenAddCardModal, profileInfo, setProfileInfo } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);

    const [fileList, setFileList] = useState([]);
    const [isValidForm, setIsValidForm] = useState(false);
    const history = useNavigate();
    const initialValues = {
        title: "",
    };

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
    const handleOk = async (values, resetForm) => {
        uploadFile("posts", uid, fileList[0])
            .then((img) => {
                const data = {
                    content: values.title,
                    imgPost: img,
                    createdAt: new Date(),
                    postId: stringToHash(uid + new Date().toString()).toString(),
                    uid: uid,
                    userLiked: [],
                    userInf: {
                        displayName: displayName,
                        img: photoURL,
                    },
                };
                return data;
            })
            .then((data) => {
                addDocument("post", data).then((res) => {
                    setProfileInfo({ ...profileInfo, posts: [data, ...profileInfo.posts] });
                });
            })
            .then(() => {
                // history("/profile/" + uid);
                setFileList([]);
                resetForm();
                setOpenAddCardModal(false);
            });
    };

    const handleCancel = (resetForm) => {
        setFileList([]);
        setOpenAddCardModal(false);
        resetForm({});
    };
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <>
            <Formik
                style={{ marginTop: 8 }}
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    handleOk(values, resetForm);
                }}
            >
                {(formikProps) => {
                    const { isSubmitting, values, handleChange, resetForm } = formikProps;
                    return (
                        <Modal width={350} footer={null} title="Thêm bài viết" open={openAddCardModal} onOk={handleOk} onCancel={() => handleCancel(resetForm)}>
                            <Form className="form__add__card">
                                <Input
                                    type="text"
                                    name="title"
                                    className="form__add__card__input"
                                    placeholder="Tiêu đề..."
                                    onChange={handleChange}
                                    //  onBlur={handleBlur}
                                    value={values.title}
                                />
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
                                            paddingTop: 10,
                                            cursor: "pointer",
                                            border: "none",
                                            backgroundColor: "#fff",
                                            color: `${!isValidForm ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                                        }}
                                        disabled={!isValidForm || isSubmitting}
                                        className={!isValidForm ? "form__add__card__button-invalid" : ""}
                                        type="submit"
                                        // disabled={isSubmitting}
                                    >
                                        <span>{isSubmitting ? <Spin indicator={antIcon} /> : "Đăng"}</span>
                                    </button>
                                </div>
                            </Form>
                        </Modal>
                    );
                }}
            </Formik>
        </>
    );
};
