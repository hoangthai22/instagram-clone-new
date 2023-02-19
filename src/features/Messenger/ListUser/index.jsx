import { Avatar, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import "./style.scss";
const { Text } = Typography;

function ListUser() {
    const { user } = useContext(AuthContext);
    const { selectedUserId, rooms, setIsMessage, membersIsSeen, setSelectedUserId } = useContext(AppContext);
    const history = useNavigate();
    const hanldeSelectRoom = async (id) => {
        if (selectedUserId !== id) {
            setSelectedUserId(id);
            setIsMessage(true);

            // let result = [];
            // for (let i = 0; i < rooms.length; i++) {
            //     const members = rooms[i].members;
            //     const roomId = rooms[i].roomId;
            //     if (members.includes(id)) {
            //         result.push(roomId);
            //         break;
            //     }
            // }
            history("/chat/" + id);
        }
    };

    return (
        <div className="sidebar__header__listUser-wraps">
            {membersIsSeen.length > 0
                ? membersIsSeen?.map((userRoom) => (
                      <div
                          key={userRoom.uid}
                          className={userRoom.uid === selectedUserId ? "sidebar__header__listUser__active" : "sidebar__header__listUser"}
                          onClick={() => {
                              hanldeSelectRoom(userRoom.uid);
                              console.log({ userRoom });
                          }}
                      >
                          <Text key={userRoom.uid} className="sidebar__header__listUser-text" style={{ fontSize: ".9rem" }}>
                              <Avatar src={userRoom.photoURL} alt="" size="large" style={{ width: 50, height: 50, marginRight: 15 }} />
                              <div className="sidebar__header__listUser__userInfo ">
                                  <Text className={`sidebar__header__listUser__userInfo__displayName ${userRoom.isSeenMessage ? "isSeen" : ""}`}>{userRoom.displayName}</Text>
                                  {!userRoom.isSeenMessage ? (
                                      <Text style={{ fontWeight: "500" }}>Đã gửi tin nhắn cho bạn</Text>
                                  ) : (
                                      <Text
                                          style={{
                                              color: "rgb(150, 150, 150)",
                                              display: "flex",
                                              alignItems: "baseline",
                                          }}
                                      >
                                          <div className={userRoom.isOnline ? "isOnline" : ""}></div>
                                          {userRoom.isOnline ? "Online" : "Offline"}
                                      </Text>
                                  )}
                              </div>
                          </Text>
                          {!userRoom.isSeenMessage && <div className="dot-online"></div>}
                      </div>
                  ))
                : [1, 2, 3, 4, 5].map((i) => {
                      return (
                          <div className={"sidebar__header__listUser"} key={i}>
                              <Text key={user.uid} className="sidebar__header__listUser-text" style={{ fontSize: ".9rem", gap: 15 }}>
                                  <Skeleton height={50} width={50} circle style={{}} />
                                  <div className="sidebar__header__listUser__userInfo ">
                                      <Skeleton height={14} width={130} borderRadius={6} style={{}} />
                                      <Skeleton height={14} width={80} borderRadius={6} style={{}} />
                                  </div>
                              </Text>
                          </div>
                      );
                  })}
        </div>
    );
}

export default ListUser;
