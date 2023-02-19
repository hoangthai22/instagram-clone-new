import { LeftOutlined, LoadingOutlined, MessageOutlined, RightOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, Modal, Spin, Typography } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { formatDate } from "../../../constants/formatDate";
import { handleLikeCard, handleUnLikeCard } from "../../../constants/handleLiked";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument } from "../../../firebase/services";
import { useFireStore } from "../../../hooks/useFirestore";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
// import { Comment } from "./Comment";
import "./style.scss";
import { Field, Formik } from "formik";

const Comment = React.lazy(() => import("./Comment"));

const { Text, Paragraph } = Typography;
export default function ShowCardModal() {
    const { openCardModal, setOpenCardModal, postInf, setOpenSettingPostModal, listCardProfile, setUserInf, setIconActiveIndex, setPostInf } = useContext(AppContext);
    const {
        user: { uid, displayName, photoURL },
    } = useContext(AuthContext);
    const location = useLocation();
    const [listPostProfile, setListPostProfile] = useState({});
    const [liked, setLiked] = useState(false);
    const [isArrow, setIsArrow] = useState(false);
    const history = useNavigate();
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const [showEmoji, setShowEmoji] = useState(false);

    // Add comment to "comment" collection
    const hanldeSubmit = async (values, resetForm) => {
        await addDocument("comment", {
            commentText: values,
            uid,
            displayName,
            photoURL,
            createdAt: new Date(),
            postId: postInf.postId,
        });
        resetForm();
    };

    useEffect(() => {
        setListPostProfile(postInf);
        if (location.pathname === "/") {
            setIsArrow(false);
        } else setIsArrow(true);
    }, [postInf]);

    const commentsCondition = useMemo(() => {
        return {
            fieldName: "postId",
            operator: "==",
            compareValue: listPostProfile.postId,
        };
    }, [listPostProfile.postId]);

    // Call function to get data from firestores
    const comments = useFireStore("comment", commentsCondition);

    // Next and prev Card
    const hanldeChangeCard = async (position) => {
        let index = listPostProfile.index;
        if (position === "right") {
            index = index + 1;
        } else {
            index = index - 1;
        }
        if (index > listCardProfile.length - 1 || index < 0) {
            return;
        } else {
            listCardProfile.map((item, ind) => {
                if (ind === index) {
                    const post = { ...item, index };
                    setPostInf(post);
                    setListPostProfile(post);
                }
            });
        }
    };
    const likeCondition = useMemo(() => {
        return {
            fieldName: "postId",
            operator: "==",
            compareValue: listPostProfile.postId,
        };
    }, [listPostProfile.postId]);
    const countLikedCard = useFireStore("post", likeCondition);

    useEffect(() => {
        if (countLikedCard[0]?.userLiked.some((item) => item.uid === uid)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [countLikedCard]);
    const hanldeLike = async () => {
        if (liked) {
            await handleUnLikeCard(listPostProfile.postId, uid, displayName, photoURL);
            setLiked(false);
        } else {
            await handleLikeCard(listPostProfile.postId, uid, displayName, photoURL);
            setLiked(true);
        }
    };

    // redirect to profile page with uid
    const hanldeSearch = () => {
        setUserInf({
            displayName: listPostProfile?.displayName,
            photoURL: listPostProfile?.img,
            uid: listPostProfile.uid,
        });
        setOpenCardModal(false);
        history("/profile/" + listPostProfile.uid, listPostProfile.uid);
        setIconActiveIndex(3);
    };
    return (
        <div>
            <Formik
                initialValues={{ message: "" }}
                onSubmit={(values, { resetForm }) => {
                    hanldeSubmit(values.message, resetForm);
                }}
            >
                {(formikProps) => {
                    return (
                        <Modal
                            style={{ height: 636 }}
                            centered
                            open={openCardModal}
                            onOk={() => setOpenCardModal(false)}
                            onCancel={() => {
                                formikProps.resetForm();
                                setListPostProfile({});
                                setPostInf({});
                                setOpenCardModal(false);
                            }}
                            width={1100}
                            footer={null}
                            className="my-modal-comment"
                            closable={false}
                        >
                            <div className="card__modal__wrap">
                                {isArrow ? (
                                    <div className="card__modal__wrap__after">
                                        <LeftOutlined onClick={() => hanldeChangeCard("left")} />
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="card__modal__img__wrap">
                                    <img className="card__modal__img" src={listPostProfile.imgPost} alt="" />
                                </div>
                                <div className="card__modal__info">
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                        <div className="card__modal__info__header">
                                            <Avatar
                                                size="default"
                                                style={{ cursor: "pointer" }}
                                                onClick={hanldeSearch}
                                                src={listPostProfile?.userInf ? listPostProfile?.userInf?.img : listPostProfile.img}
                                            />
                                            <div className="card__modal__info__header__right">
                                                <Text style={{ fontWeight: 500, cursor: "pointer" }} onClick={hanldeSearch}>
                                                    {listPostProfile?.userInf ? listPostProfile?.userInf?.displayName : listPostProfile.displayName}
                                                </Text>
                                                <Text
                                                    onClick={() => {
                                                        console.log({ listPostProfile });
                                                        if (uid === listPostProfile?.uid) {
                                                            setOpenSettingPostModal(true);
                                                        }
                                                    }}
                                                    className="setting-post"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "1.4rem",
                                                        lineHeight: "1.4rem",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    ...
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="card__modal__info__content" style={{ padding: 16 }}>
                                            {/* Tieu de bai post */}
                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    <Avatar
                                                        onClick={hanldeSearch}
                                                        size="default"
                                                        style={{ cursor: "pointer" }}
                                                        src={listPostProfile?.userInf ? listPostProfile?.userInf?.img : listPostProfile.img}
                                                    />
                                                </div>
                                                <div className="card__modal__info__content__post">
                                                    <Paragraph style={{ marginBottom: 0, marginLeft: 10 }} ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                                                        <Text
                                                            onClick={hanldeSearch}
                                                            style={{
                                                                fontWeight: 500,
                                                                cursor: "pointer",
                                                                marginRight: 8,
                                                            }}
                                                        >
                                                            {listPostProfile?.userInf ? listPostProfile?.userInf?.displayName : listPostProfile.displayName}
                                                        </Text>
                                                        {listPostProfile.content}
                                                    </Paragraph>
                                                    <Text
                                                        style={{
                                                            marginLeft: 10,
                                                            fontWeight: 400,
                                                            color: "rgb(170,170,170)",
                                                            fontSize: ".8rem",
                                                        }}
                                                    >
                                                        {formatDate(listPostProfile?.createdAt?.seconds)}
                                                    </Text>
                                                </div>
                                            </div>
                                            {/* end */}
                                            {/* comment start */}
                                            <React.Suspense
                                                fallback={
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <Spin indicator={antIcon} />
                                                    </div>
                                                }
                                            >
                                                {comments?.map((comment) => (
                                                    <Comment commentInf={comment} key={comment.commentText} onClick={hanldeSearch} />
                                                ))}
                                            </React.Suspense>

                                            {/* comment end */}
                                        </div>
                                    </div>
                                    <div className="card__modal__info__footer">
                                        <div style={{ display: "flex", marginTop: 10 }}>
                                            <div onClick={hanldeLike}>
                                                {liked ? (
                                                    <img
                                                        className={liked ? "img__heart-like" : ""}
                                                        src="/heart-red.png"
                                                        alt=""
                                                        style={{
                                                            width: 27,
                                                            height: 27,
                                                            marginLeft: 16,
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                                {!liked ? (
                                                    <img
                                                        className={!liked ? "img__heart-like" : ""}
                                                        src="/heart-black.png"
                                                        alt=""
                                                        style={{
                                                            width: 27,
                                                            height: 27,
                                                            marginLeft: 16,
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <img
                                                onClick={() => {
                                                    // history("/chat");
                                                }}
                                                src={"/messenger.png"}
                                                alt="message"
                                                style={{ width: 25, height: 25, marginLeft: 22, cursor: "pointer" }}
                                            />
                                            <SendOutlined style={{ fontSize: 25, marginLeft: 22, cursor: "pointer" }} />
                                        </div>
                                        <div
                                            style={{
                                                borderBottom: "1px solid rgb(235, 235, 235)",
                                                paddingBottom: 8,
                                            }}
                                        >
                                            <Text
                                                strong
                                                style={{
                                                    marginLeft: 16,
                                                    marginBottom: 8,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {countLikedCard[0]?.userLiked?.length} lượt thích
                                            </Text>
                                            <br />
                                            <Text
                                                style={{
                                                    marginLeft: 16,
                                                    marginBottom: 4,
                                                    color: "rgb(150, 150, 150)",
                                                    fontSize: ".8rem",
                                                }}
                                            >
                                                {}
                                                {formatDate(listPostProfile?.createdAt?.seconds)}
                                            </Text>
                                        </div>

                                        <Form className="card__formik__comment" style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 14, marginTop: 14 }}>
                                            <div className="emoji" style={{ display: showEmoji ? "block" : "none", left: 0, bottom: 70 }}>
                                                <Picker
                                                    data={data}
                                                    // previewPosition="none"
                                                    onEmojiSelect={(e) => {
                                                        formikProps.setFieldValue("message", formikProps.values.message.concat(e.native));
                                                    }}
                                                />

                                                <div className="emoji-arrow"></div>
                                            </div>
                                            <img
                                                id="emojis-btn"
                                                onClick={() => {
                                                    setShowEmoji(!showEmoji);
                                                }}
                                                src={"/smile.png"}
                                                alt="message"
                                                style={{ width: 23, height: 23, cursor: "pointer" }}
                                            />
                                            <Field type="text" name="message" className="card__input__commnent" placeholder="Thêm bình luận..." autoComplete="false" />
                                            <Button
                                                onClick={formikProps.submitForm}
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                    border: "none",
                                                    backgroundColor: "#fff",
                                                    color: `${formikProps.values.message === "" ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                                                }}
                                                disabled={formikProps.values.message === ""}
                                            >
                                                Đăng
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                                {isArrow ? (
                                    <div className="card__modal__wrap__before">
                                        <RightOutlined onClick={() => hanldeChangeCard("right")} />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </Modal>
                    );
                }}
            </Formik>
        </div>
    );
}
