import { Modal, Typography } from "antd";

import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { ButtonFollowCustom } from "../../Buttons/ButtonFollowCustom";
import { ButtonFollowingCustom } from "../../Buttons/ButtonFollowingrCustom";

export const ViewFollowerModal = () => {
    const { setOpenFollowerModal, openFollowerModal, profileInfo, profileFriendInfo } = useContext(AppContext);
    const {
        user,
        user: { uid },
    } = useContext(AuthContext);
    const location = useLocation();
    const [listFollower, setListFollower] = useState([]);
    const [isLoadingModal, setIsLoadingModal] = useState(true);
    const handleCancel = (resetForm) => {
        setOpenFollowerModal(false);
    };
    const history = useNavigate();
    useEffect(() => {
        console.log("follower");
        const uidPath = location.pathname.split("/")[2].toString();
        let profile = null;
        let tempArray = [];
        if (Object.keys(profileInfo).length !== 0 && uidPath === uid) {
            profile = profileInfo;
        } else if (Object.keys(profileFriendInfo).length !== 0 && uidPath) {
            profile = profileFriendInfo;
        }
        if (profile !== null) {
            if (profile?.info?.listFollower.length > 0) {
                profile?.info?.listFollower.map((item, index) => {
                    item.userRef.get().then((snapshot) => {
                        let userTmp = { ...snapshot.data(), id: snapshot.id, isFollow: true };

                        if (profileInfo?.info?.listFollow.findIndex((i) => i.uid === snapshot.data().uid) === -1) {
                            userTmp = { ...userTmp, isFollow: false };
                        }
                        tempArray.push(userTmp);
                        if (index === profile.info.listFollower.length - 1) {
                            setListFollower(tempArray);
                            setTimeout(() => {
                                setIsLoadingModal(false);
                            }, 400);
                        }
                    });
                });
            } else {
                setTimeout(() => {
                    setIsLoadingModal(false);
                }, 400);
            }
        }

        return () => {};
    }, [profileInfo, profileFriendInfo]);
    const { Text } = Typography;
    return (
        <div>
            <Modal width={450} footer={null} className="follow__modal" centered title="Đang theo dõi" open={openFollowerModal} onCancel={() => handleCancel()}>
                <div className="follow__wrapper" style={{ gap: listFollower.length > 0 && !isLoadingModal ? 14 : 9 }}>
                    {listFollower.length > 0 &&
                        !isLoadingModal &&
                        listFollower?.map((data, index) => {
                            return (
                                <div className="follow__item" key={index}>
                                    <img
                                        onClick={() => {
                                            history("/profile/" + data.uid);
                                            handleCancel();
                                        }}
                                        alt="example"
                                        src={data.photoURL}
                                        className="content__container-right__img-avatar"
                                        style={{ width: 48, height: 48, cursor: "pointer" }}
                                    />
                                    <div className="content__container-right__wrapName" style={{ marginLeft: 16 }}>
                                        <Text style={{ fontWeight: 500 }}>
                                            <span
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    history("/profile/" + data.uid);
                                                    handleCancel();
                                                }}
                                            >
                                                {data.displayName}
                                            </span>
                                        </Text>
                                        <Text style={{ color: "rgb(150, 150, 150)" }}>{data.fullName}</Text>
                                    </div>
                                    {data.uid !== uid && (data?.isFollow ? <ButtonFollowingCustom follow={data} user={user} /> : <ButtonFollowCustom follow={data} user={user} />)}
                                </div>
                            );
                        })}
                    {isLoadingModal &&
                        [1, 2, 3, 4, 5].map((item, index) => {
                            return (
                                <div className="follow__item" key={index}>
                                    <Skeleton height={48} width={48} circle />
                                    <div className="content__container-right__wrapName" style={{ marginLeft: 16 }}>
                                        <Skeleton height={13} width={100} borderRadius={6} style={{}} />
                                        <Skeleton height={13} width={100} borderRadius={6} style={{}} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Skeleton height={26} width={100} borderRadius={6} style={{}} />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </Modal>
        </div>
    );
};
