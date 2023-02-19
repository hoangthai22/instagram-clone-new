import { Avatar, Col, Layout, Row, Typography } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { useFireStore } from "../../../hooks/useFirestore";
import "./style.scss";
const { Content } = Layout;
const { Text } = Typography;
const NoficationMobile = () => {
    const {} = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [isNofiAfterMerge, setIsNofiAfterMerge] = useState([]);

    const likeNofiCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "==",
            compareValue: uid,
        };
    }, [uid]);

    const likeNofi = useFireStore("post", likeNofiCondition);
    const noficationCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "==",
            compareValue: uid,
        };
    }, [uid]);

    // Call function to get data from firestores
    const nofications = useFireStore("users", noficationCondition);
    useEffect(() => {
        if (nofications[0]?.listFollower) {
            let newList = likeNofi.filter((i) => i.userLiked?.length > 0);
            let arrayMerge = [...nofications[0]?.listFollower, ...newList];
            arrayMerge = arrayMerge.sort((a, b) => {
                var c = null;
                var d = null;
                if (a.userLiked) {
                    c = new Date(a.userLiked[a.userLiked?.length === 0 ? 0 : a.userLiked?.length - 1]?.createdAtLike.seconds);
                } else {
                    c = new Date(a.createdAtFollow.seconds);
                }
                if (b.userLiked) {
                    d = new Date(b.userLiked[b.userLiked?.length === 0 ? 0 : b.userLiked?.length - 1]?.createdAtLike.seconds);
                } else {
                    d = new Date(b.createdAtFollow.seconds);
                }
                return c - d;
            });
            setIsNofiAfterMerge(arrayMerge);
        }
        // console.log({ isNofiAfterMerge });
    }, [likeNofi, nofications]);

    return (
        <Content className="content__nofication__mobile">
            <Row style={{ margin: "0 auto", maxWidth: 950 }}>
                <Col className="content__nofication__mobile__wrap" style={{ width: "100%" }}>
                    {isNofiAfterMerge.map((item) => {
                        if (item.createdAtFollow) {
                            return (
                                <div style={{ flexShrink: 0, height: 68, padding: 0 }}>
                                    <div style={{ display: "flex" }} className="content__nofication__mobile__container">
                                        <Avatar src={item.photoURL} style={{ width: 40, height: 40, flexShrink: 0 }}></Avatar>
                                        <Text style={{ flex: 1 }} className="content__nofication__mobile__text">
                                            {item?.displayName} đã bắt đầu theo dõi bạn
                                            <span></span>
                                        </Text>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <>
                                    {item.userLiked.length > 0 && item?.userLiked[0].uid !== uid ? (
                                        <div key={item.createdAtFollow} style={{ flexShrink: 0, height: 68, padding: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center" }} className="content__nofication__mobile__container">
                                                {item?.userLiked.length > 1 ? (
                                                    <Avatar
                                                        src={
                                                            !item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                                                                ? item?.userLiked[item?.userLiked.length - 1].photoURL
                                                                : item?.userLiked[item?.userLiked.length - 2].photoURL
                                                        }
                                                        style={{ width: 40, height: 40, flexShrink: 0 }}
                                                        className="content__nofication__mobile__avatar"
                                                    ></Avatar>
                                                ) : item?.userLiked[0].uid === uid ? (
                                                    ""
                                                ) : (
                                                    <Avatar src={item?.userLiked[0].photoURL} style={{ width: 40, height: 40, flexShrink: 0 }}></Avatar>
                                                )}

                                                {item?.userLiked.length > 1 ? (
                                                    <Text style={{ flex: 1 }} className="content__nofication__mobile__text">
                                                        {!item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                                                            ? item?.userLiked[item?.userLiked.length - 1].displayName + " "
                                                            : item?.userLiked[item?.userLiked.length - 2].displayName + " "}
                                                        và {item?.userLiked.length - 1} người khác đã thích bài viết của bạn
                                                    </Text>
                                                ) : item?.userLiked[0].uid === uid ? (
                                                    ""
                                                ) : (
                                                    <Text style={{ flex: 1 }} className="content__nofication__mobile__text">
                                                        {item?.userLiked[0].displayName} đã thích bài viết của bạn
                                                    </Text>
                                                )}
                                                {item?.userLiked[0].uid === uid ? (
                                                    ""
                                                ) : (
                                                    <img
                                                        src={item.imgPost}
                                                        alt="image__post"
                                                        style={{
                                                            width: "10%",
                                                            height: "10%",
                                                            alignSelf: "flex-end",
                                                        }}
                                                        className="img__nofication__mobile"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </>
                            );
                        }
                    })}
                </Col>
            </Row>
        </Content>
    );
};

export default NoficationMobile;
