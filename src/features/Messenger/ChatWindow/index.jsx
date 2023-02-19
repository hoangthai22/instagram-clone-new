import { InfoCircleOutlined, LeftOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Avatar, Col, Spin, Typography } from "antd";

import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import { addDocument } from "../../../firebase/services";
import Message from "../Message";
import "./style.scss";
const { Text } = Typography;

const ChatWindow = (props) => {
    const {
        user: { uid, photoURL, displayName },
        user,
    } = useContext(AuthContext);
    const { selectedUserId, messages, isMessage, setIsMessage, selectedRoomId, setOpenUpdaloadModal } = useContext(AppContext);
    // const [noSelectUser, setNoSelectUser] = useState(false);
    const [userInfomation, setUserInfomation] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);

    const initialValues = { message: "" };
    const location = useLocation();

    const handleOnSubmit = async (values, resetForm, setSubmitting) => {
        Promise.all([
            addDocument("messages", {
                text: { message: values },
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
                    resetForm({});
                    snapshot.docs.map((doc) => {
                        if (doc.data().uid !== uid) {
                            db.collection("nofications").doc(doc.id).update({ seen: false });
                        }
                    });
                }),
        ]);
    };

    useEffect(() => {
        let objDiv = document.getElementById("scollID");
        objDiv.scrollTop = objDiv.scrollHeight;

        db.collection("users")
            .where("uid", "==", selectedUserId)
            .get()
            .then((snapshot) => {
                if (!snapshot.empty) {
                    setUserInfomation(snapshot.docs[0].data());
                }
            });
        return () => {
            setUserInfomation({});
        };
    }, [selectedUserId]);
    useEffect(() => {
        document.querySelector(".content__messenger").addEventListener("click", (event) => {
            // Get parent element and check if click happened outside parent only
            const parent = document.querySelector(".emoji");
            if (showEmoji && !parent.contains(event.target)) {
                setShowEmoji(false);
            }
        });

        return () => {};
    }, [showEmoji]);

    const hanldeBackSideBar = () => {
        setIsMessage(false);
    };

    return (
        <Col className={isMessage ? "chatwindow__header active-message" : "chatwindow__header inactive-message"}>
            <div className="chatwindow__header__wrap">
                <div className="chatwindow__header__title">
                    <LeftOutlined style={{ marginRight: 10, fontSize: "1.5rem", cursor: "pointer" }} className="leftArrow" onClick={hanldeBackSideBar} />
                    <Text strong className="chatwindow__header__title-text" style={{ fontSize: "1rem", flex: 1 }}>
                        {userInfomation?.photoURL && <Avatar className="chatwindow__header__title-avatar" src={userInfomation?.photoURL}></Avatar>}
                        {userInfomation?.displayName}
                    </Text>
                    <InfoCircleOutlined style={{ fontSize: 26 }} />
                </div>

                <div className={!selectedUserId ? "chatwindow__body__empty" : "chatwindow__body"}>
                    {!selectedUserId ? (
                        <div id="scollID" className="chatwindow__content__empty">
                            <MailOutlined style={{ fontSize: 90, fontWeight: 300 }} />
                            <span style={{ fontSize: 20, fontWeight: 400 }}>Tin nhắn của bạn</span>
                            <span className="chatwindow__content__empty__text">Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm.</span>
                        </div>
                    ) : (
                        <>
                            <Formik
                                style={{ marginTop: 8 }}
                                initialValues={initialValues}
                                onSubmit={(values, { resetForm, setSubmitting }) => {
                                    handleOnSubmit(
                                        `<span className="messsage__content-input" style={{ marginBottom: 0 }}>
                                            <div className="fit-content">
                                                <span>${values.message}</span>
                                            </div>
                                        </span>`,
                                        resetForm,
                                        setSubmitting
                                    );
                                }}
                            >
                                {(formikProps) => {
                                    const { isSubmitting, resetForm, setSubmitting } = formikProps;
                                    return (
                                        <>
                                            <div id="scollID" className="chatwindow__content__chat">
                                                {messages
                                                    ? messages.map((mes, index) => (
                                                          <Message
                                                              key={mes.id}
                                                              id={mes.uid}
                                                              index={index}
                                                              text={mes.text}
                                                              photoURL={mes.photoURL}
                                                              displayName={mes.displayName}
                                                              createdAt={mes.createdAt}
                                                              own={mes.uid === uid ? true : false}
                                                          />
                                                      ))
                                                    : [1, 2, 3, 4, 5, 6, 7].map((i, index) => {
                                                          return (
                                                              <div className="messsage__wrap">
                                                                  {index < 5 && (
                                                                      <div>
                                                                          <Skeleton height={30} width={30} circle style={{}} />
                                                                      </div>
                                                                  )}
                                                                  <div className={`${index >= 5 ? "messsage__content own" : "messsage__content"}`}>
                                                                      <Skeleton height={44} width={200} borderRadius={22} style={{}} />
                                                                  </div>
                                                              </div>
                                                          );
                                                      })}
                                            </div>
                                            <Form>
                                                <div className="emoji" style={{ display: showEmoji ? "block" : "none" }}>
                                                    <Picker
                                                        data={data}
                                                        // previewPosition="none"
                                                        onEmojiSelect={(e) => {
                                                            formikProps.setFieldValue("message", formikProps.values.message.concat(e.native));
                                                        }}
                                                    />

                                                    <div className="emoji-arrow"></div>
                                                </div>
                                                <div className="chatwindow__content__input">
                                                    <div className="chatwindow__content__formik">
                                                        <div className="chatwindow__content__input-btn">
                                                            <img
                                                                id="emojis-btn"
                                                                onClick={() => {
                                                                    setShowEmoji(!showEmoji);
                                                                }}
                                                                src={"/smile.png"}
                                                                alt="message"
                                                                style={{ width: 25, height: 25, marginLeft: 10, cursor: "pointer" }}
                                                            />
                                                            <Field onPressEnter={handleOnSubmit} type="text" name="message" className="chatwindow__content__formik__input" placeholder="Nhắn tin..." />
                                                            {formikProps.values.message === "" ? (
                                                                <div style={{ height: "100%", display: "flex", alignItems: "center", paddingRight: 8, gap: 8 }}>
                                                                    <img
                                                                        onClick={() => {
                                                                            setOpenUpdaloadModal(true);
                                                                        }}
                                                                        src={"/image.png"}
                                                                        alt="upload"
                                                                        style={{ width: 23, height: 23, marginLeft: 10, cursor: "pointer" }}
                                                                    />
                                                                    <img
                                                                        onClick={() => {
                                                                            handleOnSubmit(
                                                                                `<svg
                                                                                fill="red"
                                                                                stroke="red"
                                                                                stroke-width="1.5"
                                                                                className="heart-image"
                                                                                viewBox="0 0 24 24"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <path
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                                                ></path>
                                                                            </svg>`,

                                                                                resetForm,
                                                                                setSubmitting
                                                                            );
                                                                        }}
                                                                        src={"/heart-black.png"}
                                                                        alt="message"
                                                                        style={{ width: 25, height: 25, marginLeft: 10, cursor: "pointer" }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: 600,
                                                                        color: "#0095f6",
                                                                        marginLeft: 10,
                                                                        cursor: "pointer",
                                                                        border: "none",
                                                                        backgroundColor: "#fff",
                                                                    }}
                                                                    type="submit"
                                                                    disabled={isSubmitting}
                                                                >
                                                                    {/*  */}
                                                                    {isSubmitting ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} /> : "Gửi"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        </>
                                    );
                                }}
                            </Formik>
                        </>
                    )}
                </div>
            </div>
        </Col>
    );
};

export default ChatWindow;
