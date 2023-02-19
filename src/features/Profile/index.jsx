import { LoadingOutlined, SettingOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Spin, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "react-loading-skeleton";
import { useLocation, useNavigate } from "react-router";
import { SkeletonCustom } from "../../components/Skeleton/Skeleton";
import { handleCancelFollow, handleFollow } from "../../constants/handleFollow";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
import { addDocument, stringToHash } from "../../firebase/services";
import "./style.scss";

const { Text, Paragraph } = Typography;

const Profile = () => {
    const {
        setOpenCardModal,
        setSelectedUserId,
        setIconActiveIndex,
        setOpenAddCardModal,
        setPostInf,
        // userInf,
        setListCardProfile,
        setOpenFollowModal,
        setOpenFollowerModal,
        profileInfo,
        setProfileInfo,
        setOpenSettingModal,
        profileFriendInfo,
        setProfileFriendInfo,
    } = useContext(AppContext);
    const { user } = useContext(AuthContext);
    const history = useNavigate();
    const location = useLocation();
    const [userInfomation, setUserInfomation] = useState({});
    const [isFollow, setIsFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [listPost, setListPost] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [isIconSetting, setIsIconSetting] = useState(false);
    // Check if click on Profile and click on Search user
    function fetchProfile(uidPath, myProfile) {
        db.collection("post")
            .where("uid", "==", uidPath)
            .orderBy("createdAt", "desc")
            .get()
            .then((snapshot) => {
                let list = snapshot.docs.map((doc) => {
                    return { ...doc.data(), documentId: doc.id };
                });
                setListPost(list);
                return list;
            })
            .then((data) => {
                db.collection("users")
                    .where("uid", "==", uidPath)
                    .get()
                    .then((snapshot) => {
                        if (!snapshot.empty) {
                            setUserInfomation({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id });
                            let res = {
                                info: { ...snapshot.docs[0].data(), id: snapshot.docs[0].id },
                                posts: data,
                            };
                            if (myProfile) {
                                setProfileInfo(res);
                                setIsIconSetting(true);
                            } else {
                                setProfileFriendInfo(res);
                            }
                            if (snapshot.docs[0].data().listFollower?.some((item) => item.uid === user?.uid)) {
                                setIsFollow(true);
                            } else {
                                setIsFollow(false);
                            }
                        }
                    });
            })
            .then(() => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 400);
            });
    }
    useEffect(() => {
        const uidPath = location.pathname.split("/")[2].toString();
        if (Object.keys(profileInfo).length === 0) {
            setIsLoading(true);
            fetchProfile(user?.uid, true);
        } else if (Object.keys(profileInfo).length !== 0 && uidPath === user?.uid) {
            console.log("chay", profileInfo);
            setListPost(profileInfo.posts);
            setUserInfomation(profileInfo.info);
            setIsIconSetting(true);
            if (profileInfo.info.listFollower?.some((item) => item.uid === user?.uid)) {
                setIsFollow(true);
            } else {
                setIsFollow(false);
            }
        } else {
            console.log("profileFriendInfo.info", profileFriendInfo.info);
            // setUserInfomation(profileFriendInfo.info);
            fetchProfile(uidPath, false);
        }

        return () => {};
    }, [profileInfo, location.pathname, user]);
    useEffect(() => {
        setIconActiveIndex(3);
        if (user?.uid) {
            const uidPath = location.pathname.split("/")[2].toString();

            if (uidPath !== user?.uid) {
                setIsLoading(true);
                fetchProfile(uidPath, false);
            }
            // setIsLoading(true);
        }
        return () => {
            setUserInfomation({});
            setListPost([]);
        };
    }, [user, location.pathname]);

    // useEffect(() => {
    //     if (reLoadProfilePage) {
    //         setIsLoading(true);
    //         const uidPath = location.pathname.split("/")[2].toString();
    //         db.collection("post")
    //             .where("uid", "==", uidPath)
    //             .orderBy("createdAt")
    //             .get()
    //             .then((snapshot) => {
    //                 setListPost(snapshot.docs.map((doc) => ({ ...doc.data(), documentId: doc.id })));
    //                 setReLoadProfilePage(false);
    //             })
    //             .then(() => {
    //                 setTimeout(() => {
    //                     setIsLoading(false);
    //                 }, 500);
    //             });
    //     }
    //     return () => {};
    // }, [reLoadProfilePage]);

    // // Change when userInfomation change when redirect to profile page
    // const usersCondition = useMemo(() => {
    //     return {
    //         fieldName: "uid",
    //         operator: "==",
    //         compareValue: userInfomation.uid,
    //     };
    // }, [userInfomation.uid]);

    // const users = useFireStore("users", usersCondition);

    // // Set condition for postCondition
    // const postsCondition = useMemo(() => {
    //     return {
    //         fieldName: "uid",
    //         operator: "==",
    //         compareValue: userInfomation.uid,
    //     };
    // }, [userInfomation.uid]);

    // // Call function to get data from firestores
    // const posts = useFireStore("post", postsCondition);
    // useEffect(() => {
    //     setIconProfile(true);
    //     setIconMessage(false);
    //     setIconHome(false);
    //     setIsIconNofiDropdown(false);
    // }, [posts]);

    // // Set follow button
    // useEffect(() => {
    //     console.log({ userInfomation });
    //     if (userInfomation?.listFollower?.some((item) => item.uid === user?.uid)) {
    //         setIsFollow(true);
    //     } else {
    //         setIsFollow(false);
    //     }
    // }, [user, userInfomation]);
    // Toggle Modal
    const handleToggleModal = (userInf, imgPost, postId, content, index, uid, documentId) => {
        const postInf = {
            ...userInf,
            imgPost: imgPost,
            postId: postId,
            content: content,
            index: index,
            uid: uid,
            documentId: documentId,
        };
        setListCardProfile(listPost);
        setPostInf(postInf);
        setOpenCardModal(true);
    };

    // Hanlde when user click on button "nhawn tin"
    const handleChatting = async () => {
        const { uid } = user;
        let room = "";
        await db
            .collection("rooms")
            .where("members", "array-contains", uid)
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    if (doc.data()?.members.includes(uid) && doc.data()?.members.includes(userInfomation?.uid)) {
                        room = doc.data().roomId;
                        // return doc.data().roomId;
                    }
                });
            });
        if (room === "") {
            await addDocument("rooms", {
                roomId: stringToHash(uid + userInfomation?.uid + new Date().toString()).toString(),
                members: [uid, userInfomation?.uid],
            });
            await addDocument("nofications", {
                uid: uid,
                seen: true,
                roomId: stringToHash(uid + userInfomation?.uid + new Date().toString()).toString(),
            });
            await addDocument("nofications", {
                uid: userInfomation?.uid,
                seen: false,
                roomId: stringToHash(uid + userInfomation?.uid + new Date().toString()).toString(),
            });
            setSelectedUserId(userInfomation?.uid);
        }
        history("/chat/" + userInfomation?.uid);
    };

    const buttonLoading = () => {
        if (isLoading) {
            return <Skeleton height={32} width={100} style={{ marginLeft: 16 }} />;
        } else
            return userInfomation?.uid === user?.uid ? (
                <Button onClick={() => setOpenAddCardModal(true)} style={{ marginLeft: 20 }} className="profile__header__info__username-btn">
                    Thêm bài viết
                </Button>
            ) : !isFollow ? (
                <Button
                    onClick={() => {
                        setIsLoadingFollow(true);
                        handleFollow(userInfomation, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo).then(() => {
                            setIsFollow(true);
                            setIsLoadingFollow(false);
                        });
                    }}
                    disabled={isLoadingFollow}
                    style={{
                        marginLeft: 20,
                        backgroundColor: "#0095f6",
                        borderRadius: 6,
                        width: 100,
                    }}
                >
                    {isLoadingFollow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "#fff" }} spin />} /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Theo dõi</Text>}
                </Button>
            ) : (
                <>
                    <Button
                        onClick={handleChatting}
                        style={{
                            marginLeft: 20,
                            borderRadius: 6,
                            width: 90,
                        }}
                        className="mobi-profile__header__info__username__child__btn"
                    >
                        <Text style={{ fontWeight: 500 }}>Nhắn tin</Text>
                    </Button>
                    <Button
                        onClick={() => {
                            setIsLoadingFollow(true);
                            handleCancelFollow(userInfomation, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo).then(() => {
                                setIsFollow(false);
                                setIsLoadingFollow(false);
                            });
                        }}
                        disabled={isLoadingFollow}
                        style={{
                            marginLeft: 20,
                            borderRadius: 3,
                            width: 70,
                        }}
                    >
                        {isLoadingFollow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "rgb(150,150,150)" }} spin />} /> : <UserDeleteOutlined style={{ fontSize: "1.2rem" }} />}
                    </Button>
                </>
            );
    };

    return (
        <Content className="content__profile" style={{ position: "relative" }}>
            {/* <div className={`loading-spin ${!isLoading && "loading-spin-done"}`}></div> */}
            {/* <div style={{ opacity: isLoading ? 1 : 0, width: "100%", height: "100%", position: "absolute", background: "#fff", zIndex: 99, transition: "0.3s all" }}></div> */}
            <Row style={{ margin: "0 auto", maxWidth: 950 }}>
                <Col className="profile__header">
                    {/* <div className="profile__container"> */}
                    <div className="profile__header__wrap">
                        <div className="profile__header__avatar">
                            {!isLoading ? <Avatar className="profile__header__avatar__img" src={userInfomation?.photoURL} /> : <Skeleton height={148} width={148} circle />}
                        </div>

                        <div className="profile__header__info">
                            <div className="profile__header__info__username">
                                <div className="profile__header">{!isLoading ? <Text style={{ fontSize: "1.5rem" }}>{userInfomation?.displayName}</Text> : <Skeleton height={32} width={100} />}</div>
                                {/* ---------------------- */}
                                <div className="profile__header__info__username__child">
                                    {buttonLoading()}
                                    <SettingOutlined
                                        style={{
                                            marginLeft: 20,
                                            fontSize: 23,
                                            cursor: "pointer",
                                            display: isIconSetting ? "block" : "none",
                                            alignSelf: "center",
                                        }}
                                        onClick={() => {
                                            setOpenSettingModal(true);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="profile__header__info__follow">
                                {!isLoading ? (
                                    <>
                                        <Text style={{ fontSize: "1rem" }}>
                                            <Text style={{ fontWeight: 500 }}>{listPost.length}</Text>
                                            <Text> bài viết</Text>
                                        </Text>
                                        <Text
                                            style={{ fontSize: "1rem", marginLeft: 40, cursor: "pointer" }}
                                            onClick={() => {
                                                if (userInfomation?.listFollower?.length > 0) {
                                                    setOpenFollowerModal(true);
                                                }
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: 500,
                                                    marginRight: 5,
                                                }}
                                            >
                                                {userInfomation?.listFollower ? userInfomation.listFollower.length : " 0 "}
                                            </Text>
                                            người theo dõi
                                        </Text>
                                        <Text
                                            style={{ fontSize: "1rem", marginLeft: 40, cursor: "pointer" }}
                                            onClick={() => {
                                                if (userInfomation?.listFollow?.length > 0) {
                                                    setOpenFollowModal(true);
                                                }
                                            }}
                                        >
                                            <Text>đang theo dõi</Text>
                                            <Text
                                                style={{
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {userInfomation?.listFollow ? " " + userInfomation.listFollow.length + " " : " 0 "}
                                            </Text>
                                            người dùng
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Skeleton height={20} width={54} />
                                        <Skeleton height={20} width={115} style={{ marginLeft: 40 }} />
                                        <Skeleton height={20} width={183} style={{ marginLeft: 40 }} />
                                    </>
                                )}
                            </div>
                            {!isLoading ? (
                                <div className="profile__header__info__description">
                                    <Text style={{ fontSize: "1rem", fontWeight: 500 }}>{userInfomation?.fullName}</Text>
                                    <br />
                                    <Paragraph className="paragraph" ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                                        {userInfomation?.description}
                                    </Paragraph>
                                </div>
                            ) : (
                                <Skeleton height={50} width={400} />
                            )}
                        </div>
                    </div>
                    <div className="mobi-profile__header__info__description">
                        <Text style={{ fontSize: "1rem", fontWeight: 500 }}>Hoang Thai</Text>
                        <br />
                        <Paragraph className="paragraph" ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                            {user.description}
                        </Paragraph>
                    </div>
                    <div className="mobi-profile__header__info__follow">
                        <Text
                            className="profile__header__info__follow__text"
                            style={{
                                fontSize: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontWeight: 500 }}>{listPost.length}</Text>
                            <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>bài viết</Text>
                        </Text>
                        <Text
                            onClick={() => {
                                if (userInfomation?.listFollower?.length > 0) {
                                    setOpenFollowModal(true);
                                }
                            }}
                            className="profile__header__info__follow__text"
                            style={{
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontWeight: 500 }}>{userInfomation?.listFollower ? userInfomation.listFollower.length : "0"}</Text>
                            <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>người theo dõi</Text>
                        </Text>
                        <Text
                            onClick={() => {
                                if (userInfomation?.listFollower?.length > 0) {
                                    setOpenFollowerModal(true);
                                }
                            }}
                            className="profile__header__info__follow__text"
                            style={{
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: "rgb(150,150,150)",
                            }}
                        >
                            đang theo dõi
                            <Text style={{ fontWeight: 500 }}>{userInfomation?.listFollow ? userInfomation.listFollow.length : "0"}</Text>
                            <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>người dùng</Text>
                        </Text>
                    </div>
                    <div className="profile__menu">
                        <div className="profile__menu__list">
                            <span
                                className={`profile__menu__item ${tabIndex === 0 && "active"}`}
                                onClick={() => {
                                    setTabIndex(0);
                                }}
                            >
                                BÀI VIẾT
                            </span>
                            <span
                                className={`profile__menu__item ${tabIndex === 1 && "active"}`}
                                onClick={() => {
                                    setTabIndex(1);
                                }}
                            >
                                REELS
                            </span>
                            <span
                                className={`profile__menu__item ${tabIndex === 2 && "active"}`}
                                onClick={() => {
                                    setTabIndex(2);
                                }}
                            >
                                ĐÃ LƯU
                            </span>
                            <span
                                className={`profile__menu__item ${tabIndex === 3 && "active"}`}
                                onClick={() => {
                                    setTabIndex(3);
                                }}
                            >
                                ĐƯỢC GẮN THẺ
                            </span>
                        </div>
                    </div>
                    <div className="profile__card__wrap">
                        <div className="profile__card__list">
                            {!isLoading
                                ? listPost?.map((post, index) => (
                                      <div
                                          key={post.postId}
                                          className="profile__card__item"
                                          onClick={() => handleToggleModal(post.userInf, post.imgPost, post.postId, post.content, index, userInfomation.uid, post.documentId)}
                                      >
                                          <div className="profile__card__item__layer">
                                              <div>
                                                  <img
                                                      src="/heart-white.png"
                                                      alt=""
                                                      style={{
                                                          width: 23,
                                                          height: 23,
                                                          cursor: "pointer",
                                                      }}
                                                  />
                                                  <span>{post?.userLiked?.length}</span>
                                              </div>
                                              <div>
                                                  <img
                                                      src="/comment.png"
                                                      alt=""
                                                      style={{
                                                          width: 21,
                                                          height: 21,
                                                          cursor: "pointer",
                                                      }}
                                                  />
                                                  <span>1</span>
                                              </div>
                                          </div>
                                          <LazyLoadImage
                                              className="profile__card__item__img"
                                              effect="blur"
                                              //   width={648}
                                              src={post.imgPost} // use normal <img> attributes as props
                                          />
                                          {/* <img className="profile__card__item__img" src={post.imgPost} alt="" /> */}
                                          <div className="hover"></div>
                                      </div>
                                  ))
                                : [1, 2, 3, 4, 5, 6].map((i) => {
                                      return <SkeletonCustom key={i} />;
                                  })}
                        </div>
                    </div>
                </Col>
            </Row>
        </Content>
    );
};

export default Profile;
