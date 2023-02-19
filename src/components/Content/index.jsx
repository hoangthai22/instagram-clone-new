import { Col, Layout, Row, Spin, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
import { ButtonTextFollowCustom } from "../Buttons/ButtonTextFollowCustom";
import CardComponent from "./Card";
import "./style.scss";
const { Content } = Layout;
const { Text } = Typography;

const ContentComponent = (props) => {
    const { user, setUser } = useContext(AuthContext);
    const { setIconActiveIndex, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo } = useContext(AppContext);
    const [listPost, setListPost] = useState([]);
    const [listUserRecommend, setListUserRecommend] = useState([]);
    const [isLoadingHome, setIsLoadingHome] = useState(true);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [lastPost, setLastPost] = useState(null);
    const [loadMore, setLoadMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const history = useNavigate();
    const getUserRecommend = () => {
        let newList = [];
        return (
            db
                .collection("users")
                // .orderBy("uid")
                .orderBy("createdAt", "desc")
                // .where("uid", "!=", user.uid)
                // .limit(6)
                .get()
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        snapshot.docs.map((doc) => {
                            if (doc.data().uid !== user.uid && doc.data().listFollower.findIndex((i) => i.uid === user.uid) === -1) {
                                newList.push({ ...doc.data(), id: doc.id });
                                return doc.data();
                            }
                        });
                        setListUserRecommend(newList);
                    }
                })
        );
    };
    useEffect(() => {
        // setIsLoadingHome(true);
        setIconActiveIndex(0);
        if (user?.listFollow) {
            const oldListFollow = user?.listFollow.map((user) => user.uid);
            const newListFollow = user?.listFollow?.length > 0 ? [...oldListFollow, user.uid] : [user.uid];

            db.collection("post")
                .orderBy("createdAt", "desc")
                .where("uid", "in", newListFollow)
                .limit(2)
                .get()
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        setLastPost(snapshot.docs[snapshot.docs.length - 1]);
                        setListPost(
                            snapshot.docs.map((doc) => {
                                return { ...doc.data() };
                            })
                        );
                    }
                })
                .then(() => {
                    getUserRecommend();
                })
                .then(() => {
                    setIsLoadingHome(false);
                });

            getUserRecommend();
        }
        return () => {
            // setIsLoadingHome(false);
        };
    }, [user]);

    useEffect(() => {
        const list = document.getElementById("list");
        const handleScroll = (e) => {
            const el = e.target;
            if (el.scrollTop + el.clientHeight === el.scrollHeight && loadMore) {
                setLoadMore(false);
                setIsLoadingMore(true);
                setTimeout(() => {
                    getData(lastPost);
                }, 300);
            }
        };
        list.addEventListener("scroll", handleScroll);
        return () => {
            list.removeEventListener("scroll", handleScroll);
        };
    }, [listPost, loadMore, lastPost]);
    // useEffect(() => {
    //     getData(null);
    // }, []);
    const getData = (lastPostCheck) => {
        if (user?.listFollow) {
            // if (lastPostCheck && lastPostCheck.exists) {
            const oldListFollow = user?.listFollow.map((user) => user.uid);
            const newListFollow = user?.listFollow?.length > 0 ? [...oldListFollow, user.uid] : [user.uid];
            // const oldListFollow = user?.listFollow.map((user) => user.uid);
            let newListPosts = [...listPost];
            // const newListFollow = [...oldListFollow, user?.uid];
            db.collection("post")
                .orderBy("createdAt", "desc")
                .where("uid", "in", newListFollow)
                .limit(2)
                .startAfter(lastPostCheck)
                .get()
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        snapshot.docs.map((doc) => {
                            return (newListPosts = [...newListPosts, doc.data()]);
                        });
                        setLastPost(snapshot.docs[snapshot.docs.length - 1]);
                        setListPost(newListPosts);
                        setLoadMore(true);
                        setIsLoadingMore(false);
                    } else {
                        setIsLoadingMore(false);
                    }
                });
        }
    };
    return (
        <Content className="content" id="list">
            {/* <div className={`loading-spin ${!isLoadingHome && "loading-spin-done"}`}></div> */}
            <Row style={{ margin: "0 auto", maxWidth: 950 }}>
                <Col className="content__container-left">
                    {listPost.length > 0 && !isLoadingHome && listPost?.map((card, index) => <CardComponent data={card} key={card.postId} />)}
                    {listPost.length === 0 && !isLoadingHome && <div style={{ width: 650, textAlign: "center" }}>Không có bài viết nào!</div>}
                    {isLoadingHome && <Skeleton height={940} width={650} borderRadius={10} style={{ marginBottom: 30 }} />}
                    {/* {listPost?.map((card, index) => (
                        <CardComponent data={card} key={card.postId} />
                    ))} */}
                    {listPost.length !== 0 && isLoadingMore && (
                        <div style={{ textAlign: "center", width: "100%", marginBottom: 64, marginTop: 64 }}>
                            <Spin size="large" color="red" />
                        </div>
                    )}
                </Col>
                <Col className="content__container-right">
                    <div className="content__container-right-wrap">
                        {listUserRecommend.length > 0 && !isLoadingHome ? (
                            <>
                                <div style={{ display: "flex", width: "100%", paddingBottom: 8 }}>
                                    {user?.photoURL ? <img alt="example" src={user.photoURL} className="content__container-right__img-avatar" /> : ""}
                                    <div className="content__container-right__wrapName">
                                        <Text style={{ fontWeight: 500, cursor: "pointer" }}>{user.displayName}</Text>
                                        <Text style={{ color: "rgb(150, 150, 150)" }}>{user.fullName}</Text>
                                    </div>
                                    <Text
                                        style={{
                                            fontSize: ".9rem",
                                            fontWeight: 500,
                                            color: "#0095f6",
                                            marginLeft: 10,
                                            cursor: "pointer",
                                            alignSelf: "center",
                                        }}
                                    >
                                        Chuyển
                                    </Text>
                                </div>
                                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                                    <span style={{ color: "rgb(142,142,142)", fontWeight: 600 }}>Gợi ý cho bạn</span>

                                    <Text
                                        style={{
                                            fontSize: ".8rem",
                                            fontWeight: 500,
                                            color: "#000",
                                            marginLeft: 10,
                                            cursor: "pointer",
                                            alignSelf: "center",
                                        }}
                                    >
                                        Xem tất cả
                                    </Text>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ display: "flex", width: "100%", paddingBottom: 8, height: 60 }}>
                                    <Skeleton height={60} width={60} circle style={{ marginBottom: 30 }} />
                                    <div className="content__container-right__wrapName" style={{ gap: 3 }}>
                                        <Skeleton height={14} width={100} borderRadius={6} style={{}} />
                                        <Skeleton height={14} width={100} borderRadius={6} style={{}} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Skeleton height={16} width={60} borderRadius={6} style={{}} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                                    <Skeleton height={14} width={100} borderRadius={6} style={{}} />

                                    <Skeleton height={14} width={80} borderRadius={6} style={{}} />
                                </div>
                            </>
                        )}

                        {listUserRecommend.length > 0 && !isLoadingHome
                            ? listUserRecommend?.map((item, index) => {
                                  if (index === 5) {
                                      return true;
                                  }
                                  return (
                                      <div key={index} style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", paddingBottom: 16 }}>
                                          {item?.photoURL && (
                                              <img
                                                  onClick={() => {
                                                      history("/profile/" + item?.uid);
                                                  }}
                                                  alt="example"
                                                  src={item.photoURL}
                                                  className="content__container-right__img-avatar-recomnend"
                                              />
                                          )}
                                          <div className="content__container-right__wrapName" style={{ marginLeft: 16 }}>
                                              <Text style={{ fontWeight: 500 }}>
                                                  <span
                                                      style={{ cursor: "pointer" }}
                                                      onClick={() => {
                                                          history("/profile/" + item.uid);
                                                      }}
                                                  >
                                                      {item.displayName}
                                                  </span>
                                              </Text>
                                              <Text style={{ color: "rgb(150, 150, 150)" }}>{item.fullName}</Text>
                                          </div>
                                          <ButtonTextFollowCustom
                                              user={user}
                                              follow={item}
                                              setListUserRecommend={setListUserRecommend}
                                              listUserRecommend={listUserRecommend}
                                              //   onClick={() => {
                                              //         handleFollow(item, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo).then((i) => {
                                              //             setListUserRecommend(listUserRecommend.filter((i) => i.uid !== item.uid));
                                              //         });
                                              //       console.log("click");
                                              //   }}
                                          >
                                              {/* {!isLoadingFollow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "#d9d9d9" }} spin />} /> : "Theo dõi"} */}
                                          </ButtonTextFollowCustom>
                                      </div>
                                  );
                              })
                            : [1, 2, 3, 4, 5].map((item, index) => {
                                  if (index === 5) {
                                      return true;
                                  }
                                  return (
                                      <div key={index} style={{ display: "flex", width: "100%", paddingBottom: 16, height: 44 }}>
                                          <Skeleton height={40} width={40} circle style={{ marginBottom: 30 }} />
                                          <div className="content__container-right__wrapName" style={{ marginLeft: 16 }}>
                                              <Skeleton height={12} width={100} borderRadius={6} style={{}} />
                                              <Skeleton height={12} width={100} borderRadius={6} style={{}} />
                                          </div>
                                          <div style={{ display: "flex", alignItems: "center" }}>
                                              <Skeleton height={16} width={60} borderRadius={6} style={{}} />
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>
                </Col>
            </Row>
        </Content>
    );
};

export default ContentComponent;
