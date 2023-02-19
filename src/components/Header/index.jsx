import { FlagOutlined, SearchOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, Form, Layout, Menu, Row, Select, Spin, Typography } from "antd";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MODAL_MODE_SEARCH_USER } from "../../constants/modalMode";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { auth, db } from "../../firebase/config";
import { fetchUserList, useFireStore } from "../../hooks/useFirestore";
import { ButtonFollowCustom } from "../Buttons/ButtonFollowCustom";
import { ButtonFollowingCustom } from "../Buttons/ButtonFollowingrCustom";
import "./style.scss";
const { Header } = Layout;
const { Text } = Typography;

// const ButtonCancelCustom = ({ item, user }) => {
//     const [loadingFolow, setLoadingFolow] = useState(false);
//     return (
//         <Button
//             disabled={loadingFolow}
//             onClick={() => {
//                 setLoadingFolow(true);
//                 handleCancelFollow(item, user);
//                 // setIsFollow(false);
//             }}
//             style={{ marginLeft: 20, borderRadius: 6, width: 120 }}
//         >
//             <Text style={{ fontWeight: 400 }}>{loadingFolow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "#d9d9d9" }} spin />} /> : "Đang theo dõi"}</Text>
//         </Button>
//     );
// };
// const ButtonFollowCustom = ({ item, user }) => {
//     const [loadingFolow, setLoadingFolow] = useState(false);
//     return (
//         <Button
//             disabled={loadingFolow}
//             onClick={() => {
//                 setLoadingFolow(true);
//                 handleFollow(item, user);
//                 // setIsFollow(true);
//             }}
//             style={{
//                 marginLeft: 20,
//                 backgroundColor: "#0095f6",
//                 borderRadius: 6,
//                 width: 100,
//             }}
//         >
//             <Text style={{ color: "#fff", fontWeight: 400 }}>{loadingFolow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "rgb(250,250,250)" }} spin />} /> : "Theo dõi"}</Text>
//         </Button>
//     );
// };

const HeaderComponent = () => {
    const { user, setUser } = useContext(AuthContext);
    const {
        selectedRoomId,
        setUserInf,
        setHaveHeader,
        messageNofi,

        setisInviteMember,
        isShowModalMode,
        setIsShowModalMode,
        iconActiveIndex,
        setIconActiveIndex,
    } = useContext(AppContext);
    const [value, setValue] = useState([]);
    const [isNofi, setIsNofi] = useState([]);
    const [isNofiAfterMerge, setIsNofiAfterMerge] = useState([]);
    const [isNofiIcon, setIsNofiIcon] = useState(false);
    const [iconNofi, setIsIconNofi] = useState(false);
    const [preIcon, sePreIcon] = useState(iconActiveIndex);
    const [isNofiDropdown, setIsNofiDropdown] = useState(false);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [loadingFolow, setLoadingFolow] = useState(false);
    const {
        user: { uid },
    } = useContext(AuthContext);

    const history = useNavigate();

    // Logout and set isOnline = false
    const hanldeSignOut = async () => {
        setHaveHeader(false);
        await auth.signOut();
        history("/login");

        db.collection("users")
            .where("uid", "==", user.uid)
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    db.collection("users").doc(doc.id).update({ isOnline: false });
                    setUser({});
                });
            });
    };

    const userCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "==",
            compareValue: uid,
        };
    }, [uid]);

    // Call function to get data from firestores
    const userFireStore = useFireStore("users", userCondition);

    const likeNofiCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "==",
            compareValue: uid,
        };
    }, [uid]);

    const likeNofi = useFireStore("post", likeNofiCondition);

    useEffect(() => {
        if (!userFireStore[0]?.nofication) {
            setIsNofiIcon(true);
        }
        const list = messageNofi.filter((item) => item);
        setIsNofi(list);
        setIsIconNofi(iconActiveIndex === 2);
        //disable dropdown nofi when width < 600px
        handleResize();
        function handleResize() {
            if (window.innerWidth < 600) {
                setIsNofiDropdown(false);
            } else {
                setIsNofiDropdown(true);
            }
        }
        window.addEventListener("resize", handleResize);
    }, [messageNofi, selectedRoomId, userFireStore, iconActiveIndex]);

    // useEffect(() => {
    //     if (userFireStore[0]?.listFollower?.some((item) => item.uid === uid)) {
    //         setIsFollow(true);
    //     } else {
    //         setIsFollow(false);
    //     }
    // }, [uid, userFireStore]);

    const sortNoti = (arrayMerge) => {
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
    };
    useEffect(() => {
        if (userFireStore[0]?.listFollower) {
            let newList = likeNofi.filter((i) => i.userLiked?.length > 0);
            let newListNoti = [];
            let arrayMerge = [];
            if (userFireStore[0]?.listFollower?.length > 0) {
                userFireStore[0]?.listFollower.map((item, index) => {
                    item.userRef.get().then((snapshot2) => {
                        newListNoti.push({
                            displayName: snapshot2.data().displayName,
                            photoURL: snapshot2.data().photoURL,
                            createdAtFollow: item.createdAtFollow,
                            uid: item.uid,
                            id: snapshot2.id,
                            isFollowNoti: snapshot2.data().listFollower.filter((e) => e.uid === user.uid).length > 0,
                        });
                        // console.log({ newListNoti });
                        arrayMerge = [...newListNoti, ...newList];
                        sortNoti(arrayMerge);
                    });
                });
            } else {
                let arrayMerge = [...newList];
                sortNoti(arrayMerge);
            }
        }
        // console.log({ isNofiAfterMerge });
    }, [likeNofi, userFireStore]);
    // List menu
    const items = [
        {
            key: "1",
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: "2",
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
        {
            key: "3",
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
    ];
    const menu = (
        <Menu
            style={{
                width: 280,
                // height: 280,
                borderRadius: 10,
                left: 30,
                padding: 8,
            }}
        >
            <Menu.Item
                key="1"
                onClick={() => {
                    history("/profile/" + uid);
                    setIconActiveIndex(3);
                    sePreIcon(3);
                }}
            >
                <div className="dropdown__wrap">
                    <UserOutlined style={{ fontSize: 20 }} />
                    <span className="dropdown__text"> Trang cá nhân</span>
                </div>
            </Menu.Item>
            <Menu.Item key="2">
                <div className="dropdown__wrap">
                    <FlagOutlined style={{ fontSize: 20 }} />
                    <span className="dropdown__text"> Đã lưu</span>
                </div>
            </Menu.Item>
            <Menu.Item key="3">
                <div className="dropdown__wrap">
                    <SettingOutlined style={{ fontSize: 20 }} />
                    <span className="dropdown__text"> Cài đặt</span>
                </div>
            </Menu.Item>
            <hr className="hr" />
            <Menu.Item onClick={hanldeSignOut} key="4">
                <div className="dropdown__wrap-last">
                    <span className="dropdown__text-last"> Đăng xuất</span>
                </div>
            </Menu.Item>
        </Menu>
    );

    const nofication = (
        <Menu
            style={{
                width: 500,
                height: 349,
                borderRadius: 10,
                left: 30,
                padding: 0,
                margin: 0,
                overflowY: "scroll",
                // boxShadow: "0 0 5px 1px rgb(0 0 0 / 20%)",
                display: isNofiDropdown ? "block" : "none",
            }}
            className="nofication__mobile"
        >
            <div className="test__test">
                {isNofiAfterMerge.map((item) => {
                    if (item.createdAtFollow) {
                        return (
                            <Menu.Item key={item.createdAtFollow} style={{ flexShrink: 0, height: 68, padding: "0 8px", background: "#fff" }} className="menu-item-hover">
                                <div style={{ display: "flex", alignItems: "center" }} className="nofi__wrap__mobile">
                                    <Avatar src={item.photoURL} style={{ width: 40, height: 40, marginRight: 10, flexShrink: 0 }}></Avatar>
                                    <Text style={{ flex: 1 }} className="nofi__text__mobile">
                                        <span style={{ fontWeight: 600 }}>{item?.displayName}</span> đã bắt đầu theo dõi bạn
                                    </Text>
                                    {item.isFollowNoti ? <ButtonFollowingCustom follow={item} user={user} /> : <ButtonFollowCustom follow={item} user={user} />}
                                </div>
                            </Menu.Item>
                        );
                    } else {
                        return (
                            <>
                                {item.userLiked.length > 0 && item?.userLiked[0].uid !== uid ? (
                                    <Menu.Item key={item.createdAtFollow} style={{ flexShrink: 0, height: 68, padding: "0 8px", background: "#fff" }} className="menu-item-hover">
                                        <div style={{ display: "flex", alignItems: "center" }} className="nofi__wrap__mobile">
                                            {item?.userLiked.length > 1 ? (
                                                <Avatar
                                                    src={
                                                        !item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                                                            ? item?.userLiked[item?.userLiked.length - 1].photoURL
                                                            : item?.userLiked[item?.userLiked.length - 2].photoURL
                                                    }
                                                    style={{ width: 40, height: 40, marginRight: 10, flexShrink: 0 }}
                                                    className="nofi__avatar__mobile"
                                                ></Avatar>
                                            ) : item?.userLiked[0].uid === uid ? (
                                                ""
                                            ) : (
                                                <Avatar src={item?.userLiked[0].photoURL} style={{ width: 40, height: 40, marginRight: 10, flexShrink: 0 }}></Avatar>
                                            )}

                                            {item?.userLiked.length > 1 ? (
                                                <Text style={{ flex: 1 }} className="nofi__text__mobile">
                                                    <span style={{ fontWeight: 600 }}>
                                                        {!item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                                                            ? item?.userLiked[item?.userLiked.length - 1].displayName + " "
                                                            : item?.userLiked[item?.userLiked.length - 2].displayName + " "}
                                                    </span>
                                                    và <span style={{ fontWeight: 600 }}>{item?.userLiked.length - 1} người khác</span> đã thích bài viết của bạn
                                                </Text>
                                            ) : item?.userLiked[0].uid === uid ? (
                                                ""
                                            ) : (
                                                <Text style={{ flex: 1 }} className="nofi__text__mobile">
                                                    <span style={{ fontWeight: 600 }}>{item?.userLiked[0].displayName}</span> đã thích bài viết của bạn
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
                                                    className="imgPost__mobile"
                                                />
                                            )}
                                        </div>
                                    </Menu.Item>
                                ) : (
                                    ""
                                )}
                            </>
                        );
                    }
                })}
            </div>
        </Menu>
    );

    const hanldeUpdateNofi = () => {
        setIsIconNofi(true);
        db.collection("users")
            .where("uid", "==", uid)
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    db.collection("users").doc(doc.id).update({ nofication: true });
                });
            });
    };

    function DebountSelect({ fetchOptions, debounceTimeout = 200, ...props }) {
        const [fetching, setFetching] = useState(false);
        const [option, setOption] = useState([]);

        const debounceFetcher = useMemo(() => {
            const loadOptions = (value) => {
                setOption([]);
                setFetching(true);

                // console.log("option", option);
                fetchOptions(value, props.curmembers).then((newOptions) => {
                    setOption(newOptions);
                    setFetching(false);
                });
            };
            return debounce(loadOptions, debounceTimeout);
        }, [debounceTimeout, fetchOptions]);

        return (
            <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" style={{}} /> : ""} {...props}>
                {option.length > 0 &&
                    option.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                            <Avatar size="small" src={opt.photoURL} style={{ marginRight: 10 }}>
                                {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            {`${opt.label}`}
                        </Select.Option>
                    ))}
            </Select>
        );
    }

    const handleSearch = (newValue) => {
        setUserInf({
            displayName: newValue[0].label[1],
            photoURL: newValue[0].label[0].props.src,
            uid: newValue[0].value,
        });
        history("/profile/" + newValue[0].value, newValue[0].value);
        setIconActiveIndex(3);
        setValue([]);
    };
    const handleIconNofi = () => {
        setOpen(!open);
        if (iconActiveIndex === 2) {
            setIconActiveIndex(preIcon);
        } else {
            setIconActiveIndex(2);
        }
    };
    const handleShowModalSearch = () => {
        setisInviteMember(true);
        setIsShowModalMode(MODAL_MODE_SEARCH_USER);
    };
    return (
        <div className="header-wrap">
            <Header className="header">
                <Row style={{ margin: "0 auto", maxWidth: 950 }}>
                    <Col flex className="header__container">
                        <div className="header__Logo-img">
                            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="header__img" />
                        </div>
                        <div style={{ alignSelf: "center" }}>
                            <Form form={form} layout="vertical">
                                <DebountSelect
                                    className="header__input"
                                    mode="multiple"
                                    label="Member name"
                                    placeholder="Nhập tên..."
                                    fetchOptions={fetchUserList}
                                    onChange={(newValue) => handleSearch(newValue)}
                                    style={{ width: 200 }}
                                    curmembers={uid ? uid : ""}
                                />
                            </Form>
                        </div>
                        <div className="header__btns">
                            <SearchOutlined style={{ fontSize: 25, marginLeft: 22, cursor: "pointer" }} className="header__search__btn" onClick={handleShowModalSearch} />
                            <img
                                onClick={() => {
                                    history("/");
                                    setIconActiveIndex(0);
                                    sePreIcon(0);
                                    // setIsLoading(true);
                                }}
                                src={iconActiveIndex === 0 ? "/home-fill.png" : "/home.png"}
                                alt="message"
                                style={{ width: 25, height: 25, cursor: "pointer" }}
                                className=""
                            />

                            <div className="header__btns-icon-message-wrap">
                                <img
                                    onClick={() => {
                                        history("/chat/inbox");
                                        setIconActiveIndex(1);
                                        sePreIcon(1);
                                    }}
                                    src={iconActiveIndex === 1 ? "/chat.png" : "/messenger.png"}
                                    alt="message"
                                    className="header__btns-icon-message"
                                />
                                {isNofi.length > 0 && (
                                    <>
                                        <div className="header__btns-icon-countMessage"></div>
                                        <span className="header__btns-icon-count">{isNofi.length}</span>
                                    </>
                                )}
                            </div>
                            <Dropdown dropdownRender={(me) => nofication} placement="bottomRight" open={open} trigger={["click"]} arrow onOpenChange={handleIconNofi}>
                                <div
                                    className="header__btns"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: 55,
                                        alignItems: "flex-end",
                                        position: "relative",
                                    }}
                                >
                                    <img
                                        onClick={hanldeUpdateNofi}
                                        src={iconActiveIndex === 2 ? "/heart.png" : "/heart-black.png"}
                                        alt=""
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginLeft: 22,
                                            cursor: "pointer",
                                            marginTop: 15,
                                        }}
                                    />
                                    {!userFireStore[0]?.nofication && (
                                        <div
                                            style={{
                                                width: 5,
                                                height: 5,
                                                backgroundColor: "#ed4956",
                                                borderRadius: "50%",
                                                position: "absolute",
                                                bottom: 3,
                                                right: 10,
                                            }}
                                        ></div>
                                    )}
                                    {/* <div
                                        style={{
                                            borderRadius: 10,
                                            bottom: -40,
                                            right: -13,
                                            backgroundColor: "#ed4956",
                                            position: "absolute",
                                        }}
                                    >
                                        {isNofiIcon && !userFireStore[0]?.nofication && (
                                            <div style={{ height: 35, width: 52, padding: 0 }} className="dropdonw__heart">
                                                <div id="heart">
                                                    <div className="heart__number">1</div>
                                                </div>
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            </Dropdown>

                            <div className={`header__btns-icon-avatar__wrap${iconActiveIndex === 3 ? "-active" : ""}`}>
                                <Dropdown dropdownRender={(me) => menu} placement="bottomRight" trigger={["click"]} arrow>
                                    {user?.photoURL ? <img src={user.photoURL} alt="" className="header__btns-icon-avatar" /> : <Avatar className="header__btns-icon-avatar" />}
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Header>
        </div>
    );
};

export default HeaderComponent;
