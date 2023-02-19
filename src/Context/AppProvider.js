import React, { useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import { useFireStore, useFireStoreToListenNofiMessage } from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
    const [listUserChatted, setListUserChatted] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMember, setisInviteMember] = useState(false);
    const [isRoomChange, setIsRoomChange] = useState(false);
    const [openFollowModal, setOpenFollowModal] = useState(false);
    const [openFollowerModal, setOpenFollowerModal] = useState(false);
    const [openUpdaloadModal, setOpenUpdaloadModal] = useState(false);
    const [openCardModal, setOpenCardModal] = useState(false);
    const [openUpdateCardModal, setOpenUpdateCardModal] = useState(false);
    const [openAddCardModal, setOpenAddCardModal] = useState(false);
    const [postInf, setPostInf] = useState({});
    const [listCardProfile, setListCardProfile] = useState([]);
    const [profileInfo, setProfileInfo] = useState({});
    const [profileFriendInfo, setProfileFriendInfo] = useState({});
    const [userInf, setUserInf] = useState({});
    const [haveHeader, setHaveHeader] = useState(false);
    const [isLoadingMain, setIsLoadingMain] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [isValidAuth, setIsValidAuth] = useState(false);
    const [openSettingModal, setOpenSettingModal] = useState(false);
    const [openSettingPostModal, setOpenSettingPostModal] = useState(false);
    const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);
    const [openDeletePostModal, setOpenDeletePostModal] = useState(false);
    const [iconActiveIndex, setIconActiveIndex] = useState(0);
    const [membersIsSeen, setMembersIsSeen] = useState([]);
    const [isShowModalMode, setIsShowModalMode] = useState("Search" || "Invite");

    const {
        user: { uid },
    } = useContext(AuthContext);

    //Get list room of user current
    const roomsCondition = useMemo(() => {
        return {
            fieldName: "members",
            operator: "array-contains",
            compareValue: uid,
        };
    }, [uid]);
    const rooms = useFireStore("rooms", roomsCondition);

    // filter room và lấy id người nhắn tin còn lại k phải người đang đăng nhập
    const result = useMemo(() => {
        let kq = rooms.map((item) => {
            return item.members.map((i) => {
                if (i !== uid) {
                    return i;
                }
            });
        });
        let room = [];
        kq = kq.map((i) => i.filter((item) => item));
        kq.map((item) => {
            room.push(item[0]);
        });

        return room;
    }, [rooms, uid]);
    const resultRoomId = useMemo(() => {
        let kq = rooms.map((item) => {
            return item.members.map((i) => {
                if (i !== uid) {
                    return item.roomId;
                }
            });
        });
        let room = [];
        kq = kq.map((i) => i.filter((item) => item));
        kq.map((item) => {
            room.push(item[0]);
        });

        return room;
    }, [rooms, uid]);

    // lấy thông tin user từ array id
    const usersCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "in",
            compareValue: result.length === 0 ? [""] : result,
        };
    }, [result]);

    const members = useFireStore("users", usersCondition);

    const selectedRoomId = useMemo(() => {
        let result = [];
        for (let i = 0; i < rooms.length; i++) {
            const members = rooms[i].members;
            const roomId = rooms[i].roomId;
            if (members.includes(selectedUserId)) {
                result.push(roomId);
                break;
            }
        }
        // let kq = rooms.map((item) => {
        //     return item.members.map((i) => {
        //         if (i === selectedUserId) {
        //             return item.roomId;
        //         }
        //     });
        // });
        // kq = kq.map((i) => i.filter((item) => item));
        // console.log({ kq });
        return result;
    }, [rooms, selectedUserId]);

    const roomCondition = useMemo(
        () => ({
            fieldName: "uid",
            operator: "==",
            compareValue: uid,
        }),
        [uid]
    );
    const messageNofi = useFireStoreToListenNofiMessage("nofications", roomCondition);

    const messageNofiIsSeen = useFireStore("nofications", roomCondition);

    const condition = useMemo(
        () => ({
            fieldName: "roomId",
            operator: "==",
            compareValue: selectedRoomId.filter((i) => i.length > 0).toString(),
        }),
        [selectedRoomId]
    );

    const messages = useFireStore("messages", condition);

    const membersIsSeenMemo = useMemo(async () => {
        let member = [...members];
        member = member.map((i) => {
            return {
                ...i,
                isSeenMessage: true,
            };
        });
        let test = [];
        messageNofiIsSeen.map((noti) => {
            if (!noti.seen) {
                test.push(noti.roomId);
            }
        });
        let result = [];
        for (let index = 0; index < test.length; index++) {
            await db
                .collection("nofications")
                .where("roomId", "==", test[index])
                .get()
                .then((snapshot) => {
                    return snapshot.docs.map((doc) => {
                        if (doc.data().uid !== uid) {
                            result.push(doc.data().uid);
                        }
                    });
                })
                .then(() => {
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        let indexFind = member.findIndex((e) => e.uid === element);
                        if (indexFind !== -1) {
                            member[indexFind].isSeenMessage = false;
                        }
                    }
                    setMembersIsSeen(member);
                    return member;
                });
        }

        // console.log({nofis});
    }, [members, messageNofiIsSeen, uid]);

    useEffect(() => {
        const fetchData = async () => {
            let member = [...members];
            member = member.map((i) => {
                return {
                    ...i,
                    isSeenMessage: true,
                };
            });
            let test = [];
            messageNofiIsSeen.map((noti) => {
                if (!noti.seen) {
                    test.push(noti.roomId);
                }
            });
            let result = [];
            for (let index = 0; index < test.length; index++) {
                const snapshot = await db.collection("nofications").where("roomId", "==", test[index]).get();
                snapshot.docs.forEach((doc) => {
                    if (doc.data().uid !== uid) {
                        result.push(doc.data().uid);
                    }
                });
            }
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                let indexFind = member.findIndex((e) => e.uid === element);
                if (indexFind !== -1) {
                    member[indexFind].isSeenMessage = false;
                }
            }
            setMembersIsSeen(member);
            return member;
        };
        fetchData();
        return () => {};
    }, [members, messageNofiIsSeen, uid]);

    return (
        <AppContext.Provider
            value={{
                messages,
                selectedRoomId,
                selectedUserId,
                setSelectedUserId,
                listUserChatted,
                isAddRoomVisible,
                setIsAddRoomVisible,
                isInviteMember,
                setisInviteMember,
                setIsRoomChange,
                members,

                openCardModal,
                setOpenCardModal,
                openAddCardModal,
                setOpenAddCardModal,
                postInf,
                setPostInf,
                userInf,
                setUserInf,
                haveHeader,
                setHaveHeader,
                messageNofi,
                isLoadingMain,
                setIsLoadingMain,
                listCardProfile,
                setListCardProfile,
                isMessage,
                setIsMessage,
                isValidAuth,
                setIsValidAuth,

                openSettingModal,
                setOpenSettingModal,
                openChangeAvatarModal,
                setOpenChangeAvatarModal,
                membersIsSeen,
                setMembersIsSeen,
                isShowModalMode,
                setIsShowModalMode,

                setOpenFollowModal,
                openFollowModal,
                openSettingPostModal,
                setOpenSettingPostModal,
                openDeletePostModal,
                setOpenDeletePostModal,
                iconActiveIndex,
                setIconActiveIndex,
                openUpdateCardModal,
                setOpenUpdateCardModal,
                profileInfo,
                setProfileInfo,
                setOpenFollowerModal,
                openFollowerModal,
                profileFriendInfo,
                setProfileFriendInfo,
                openUpdaloadModal,
                setOpenUpdaloadModal,
                rooms,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
