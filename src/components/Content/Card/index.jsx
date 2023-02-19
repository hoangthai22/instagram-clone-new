import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Avatar, Card, Spin, Typography } from "antd";
import Form from "antd/lib/form/Form";
import { Field, Formik } from "formik";
import { LazyLoadImage } from "react-lazy-load-image-component";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { formatDate } from "../../../constants/formatDate";
import { handleLikeCard, handleUnLikeCard } from "../../../constants/handleLiked";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument } from "../../../firebase/services";
import { useFireStore } from "../../../hooks/useFirestore";

import "./style.scss";

const { Text, Paragraph } = Typography;
function CardComponent(props) {
    const { user } = useContext(AuthContext);
    const { userInf, postId, imgPost, createdAt, content, uid } = props.data;
    const { setOpenCardModal, setPostInf, setUserInf, setIconActiveIndex } = useContext(AppContext);
    const [liked, setLiked] = useState(false);
    const [isActive, setActive] = useState("false");
    const history = useNavigate();
    const [showEmoji, setShowEmoji] = useState(false);
    // listen event in "post" colection
    const likeCondition = useMemo(() => {
        return {
            fieldName: "postId",
            operator: "==",
            compareValue: postId,
        };
    }, [postId]);
    const countLikedCard = useFireStore("post", likeCondition);
    useEffect(() => {
        if (countLikedCard[0]?.userLiked.some((item) => item.uid === user.uid)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [countLikedCard]);

    // Open Modal card when clic "Xem tat ca binh luan"
    const handleToggleModal = () => {
        const postInf = {
            ...userInf,
            imgPost,
            postId,
            content,
            createdAt,
            uid,
        };
        setPostInf(postInf);
        setOpenCardModal(true);
    };

    // Set state of heart
    const hanldeLike = async () => {
        console.log("like");
        setActive(!isActive);
        if (liked) {
            handleUnLikeCard(postId, user.uid, user.displayName, user.photoURL);
            setLiked(false);
            setActive(!isActive);
        } else {
            handleLikeCard(postId, user.uid, user.displayName, user.photoURL);
            setLiked(true);
        }
    };
    const initialValues = { message: "" };
    // set animation in button like
    // redirect to profile page with uid
    const hanldeSearch = () => {
        setUserInf({
            displayName: userInf?.displayName,
            photoURL: userInf?.img,
            uid,
        });
        history("/profile/" + uid);
        setIconActiveIndex(3);
    };

    const handleOnSubmit = async (values, resetForm) => {
        console.log({ values });
        await addDocument("comment", {
            commentText: values,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
            postId: postId,
        });
        resetForm();
    };
    return (
        <Card
            className="card__wrap"
            title={
                <a onClick={hanldeSearch}>
                    <Avatar alt="example" src={userInf?.img} />
                    <Text strong style={{ marginLeft: 20, cursor: "pointer" }}>
                        {userInf?.displayName}
                    </Text>
                </a>
            }
            bordered={false}
            style={{ width: "100%", marginBottom: 30 }}
            cover={
                <LazyLoadImage
                    style={{ borderRadius: 0 }}
                    effect="blur"
                    width={648}
                    src={imgPost} // use normal <img> attributes as props
                />
                // <img alt="example" style={{ borderRadius: 0 }} src={imgPost} />
            }
        >
            <div className="card__body">
                <div style={{ display: "flex" }}>
                    <div onClick={hanldeLike}>
                        {liked ? (
                            <img
                                className={liked ? "img__heart-like" : ""}
                                src="/heart-red.png"
                                // onClick={hanldeToggeLike}
                                alt=""
                                style={{
                                    width: 27,
                                    height: 27,
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
                                // onClick={hanldeToggeLike}
                                style={{
                                    width: 27,
                                    height: 27,
                                    cursor: "pointer",
                                }}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <img
                        onClick={() => {
                            // history("/chat/" + userInf.uid);
                        }}
                        src={"/messenger.png"}
                        alt="message"
                        style={{ width: 25, height: 25, marginLeft: 22, cursor: "pointer" }}
                    />
                    <SendOutlined style={{ fontSize: 25, marginLeft: 22, cursor: "pointer" }} />
                </div>

                <div className="card__bottom__wrap">
                    <Text
                        strong
                        style={{
                            marginBottom: 8,
                            cursor: "pointer",
                        }}
                    >
                        {countLikedCard[0]?.userLiked?.length} lượt thích
                    </Text>
                    <br />
                    <div className="card__bottom__user-content">
                        <Text strong style={{ cursor: "pointer" }} onClick={hanldeSearch}>
                            {userInf?.displayName}
                        </Text>
                        <Paragraph style={{ marginBottom: 4 }} ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                            {content}
                        </Paragraph>
                    </div>
                    <Text
                        onClick={() => {
                            handleToggleModal();
                        }}
                        style={{
                            marginBottom: 4,
                            color: "rgb(150, 150, 150)",
                            cursor: "pointer",
                        }}
                    >
                        Xem tất cả bình luận
                    </Text>
                    <br />
                    <Text
                        style={{
                            marginBottom: 4,
                            color: "rgb(150, 150, 150)",
                        }}
                    >
                        {formatDate(createdAt.seconds)}
                    </Text>
                </div>
            </div>

            <div className="hr"></div>
            <div className="card__formik__wrap">
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => {
                        handleOnSubmit(values.message, resetForm);
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form className="card__formik__comment">
                                <div className="emoji" style={{ display: showEmoji ? "block" : "none", left: 2, bottom: 70 }}>
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
                                <Field
                                    type="text"
                                    name="message"
                                    className="card__input__commnent"
                                    placeholder="Thêm bình luận..."
                                    //  onChange={handleChange}
                                    //  onBlur={handleBlur}
                                    //  value={values.email}
                                />

                                <Text
                                    style={{
                                        fontSize: "1rem",
                                        width: 50,
                                        textAlign: "right",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        color: `${formikProps.values.message === "" ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                                    }}
                                    onClick={formikProps.submitForm}
                                    disabled={formikProps.isSubmitting}
                                >
                                    {formikProps.isSubmitting ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : "Đăng"}
                                </Text>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Card>
    );
}

export default CardComponent;
