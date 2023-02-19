import { LoadingOutlined } from "@ant-design/icons";
import { Input, Modal, Spin, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Field, Form, Formik, useField } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument, stringToHash, updateDocument, uploadFile } from "../../../firebase/services";
import "./style.scss";

export const UpdateCardModal = () => {
    const { openUpdateCardModal, setOpenUpdateCardModal, postInf, setPostInf, profileInfo, setProfileInfo } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);

    const [fileList, setFileList] = useState([]);
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [isValidForm, setIsValidForm] = useState(false);
    const history = useNavigate();
    // const initialValues = {
    //     title: postInf.content,
    // };

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
        if (image === "") {
            await uploadFile("posts", uid, fileList[0])
                .then((img) => {
                    const data = {
                        content: values.title,
                        imgPost: img,
                    };
                    return data;
                })
                .then((data) => {
                    updateDocument("post", data, postInf.postId).then(() => {
                        setPostInf({ ...postInf, content: values.title, imgPost: data.imgPost });
                        setProfileInfo({
                            ...profileInfo,
                            posts: profileInfo.posts.map((i) => {
                                if (i.postId === postInf.postId) {
                                    i.content = values.title;
                                    i.imgPost = data.imgPost;
                                }
                                return i;
                            }),
                        });
                        setFileList([]);
                        resetForm();
                        setOpenUpdateCardModal(false);
                    });
                });
        } else {
            await updateDocument("post", { content: values.title }, postInf.postId).then(() => {
                setPostInf({ ...postInf, content: values.title });
                setProfileInfo({
                    ...profileInfo,
                    posts: profileInfo.posts.map((i) => {
                        if (i.postId === postInf.postId) {
                            i.content = values.title;
                        }
                        return i;
                    }),
                });
                setFileList([]);
                resetForm();
                setOpenUpdateCardModal(false);
            });
        }
    };

    const handleCancel = (resetForm) => {
        setFileList([]);
        setOpenUpdateCardModal(false);
        resetForm({});
    };
    useEffect(() => {
        console.log({ postInf });
        setImage(postInf.imgPost);
        setTitle(postInf.content);

        return () => {};
    }, [postInf]);

    const FieldCustom = (props) => {
        const [field, , { setValue }] = useField(props.field.name);
        const onChange = (e) => {
            setValue(e.target.value);
        };
        return (
            <Input
                type="text"
                name="title"
                className="form__add__card__input"
                placeholder="Tiêu đề..."
                value={field.value}
                onChange={onChange}
                //  onBlur={handleBlur}
            />
        );
    };

    const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;
    return (
        <>
            <Formik
                style={{ marginTop: 8 }}
                initialValues={{
                    title: postInf.content,
                }}
                // validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    handleOk(values, resetForm);
                }}
            >
                {(formikProps) => {
                    const { isSubmitting, resetForm, submitForm } = formikProps;
                    return (
                        <Modal width={350} footer={null} title="Thêm bài viết" open={openUpdateCardModal} onOk={handleOk} onCancel={() => handleCancel(resetForm)}>
                            <Form className="form__add__card">
                                <Field
                                    type="text"
                                    name="title"
                                    className="form__add__card__input"
                                    placeholder="Tiêu đề..."
                                    // onChange={handleChange}
                                    component={FieldCustom}
                                    //  onBlur={handleBlur}
                                />
                                <div style={{ width: 300, height: 300, position: "relative" }}>
                                    {/* {fileList.length === 0 ? ( */}
                                    <div className="image-crop">
                                        {image !== "" ? (
                                            <div style={{ position: "relative", borderRadius: 6, overflow: "hidden" }}>
                                                <img src={image} alt="" style={{ width: "100%" }} />
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        height: 25,
                                                        width: 25,
                                                        background: "rgb(240,240,240)",
                                                        right: 0,
                                                        top: 0,
                                                        zIndex: 9,
                                                        borderRadius: 50,
                                                        padding: 3,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <svg
                                                        onClick={() => {
                                                            setImage("");
                                                        }}
                                                        fill="rgb(150,150,150)"
                                                        stroke="rgb(120,120,120)"
                                                        stroke-width="1.5"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        aria-hidden="true"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <ImgCrop rotate>
                                                <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" fileList={fileList} onChange={onChange} onPreview={onPreview}>
                                                    {fileList.length < 1 && "+ Upload"}
                                                </Upload>
                                            </ImgCrop>
                                        )}
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
                                            color: image === "" && !isValidForm ? "rgba(180, 180, 180, 0.7)" : `#0095f6`,
                                        }}
                                        onClick={() => {
                                            submitForm();
                                        }}
                                        disabled={(image === "" && !isValidForm) || isSubmitting}
                                        className={image === "" && !isValidForm ? "form__add__card__button-invalid" : ""}
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
