import { Avatar, Typography } from "antd";
import parse from "html-react-parser";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import "./style.scss";

function Message({ text, displayName, createdAt, photoURL, own, id, index }) {
    const { messages, selectedRoomId } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const { setUserInf, setIconActiveIndex } = useContext(AppContext);
    const history = useNavigate();
    const location = useLocation();
    useEffect(() => {
        db.collection("nofications")
            .where("roomId", "==", selectedRoomId.filter((i) => i.length > 0).toString())
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    if (doc.data().uid === uid) {
                        db.collection("nofications").doc(doc.id).update({ seen: true });
                    }
                });
            });
        if (messages.length - 1 === index) {
            document.getElementById((messages.length - 1).toString()).scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [location.pathname]);
    const hanldeSearch = () => {
        setUserInf({
            displayName: displayName,
            photoURL: photoURL,
            uid: id,
        });
        history("/profile/" + id, id);
        setIconActiveIndex(3);
    };
    return (
        <div className="messsage__wrap" id={index}>
            {!own ? (
                <div>
                    <Avatar src={photoURL} onClick={hanldeSearch} style={{ cursor: "pointer" }}></Avatar>
                </div>
            ) : (
                ""
            )}
            <div className={`${own ? "messsage__content own" : "messsage__content"}`}>
                {parse(text.message)}
                {/* <div style={{ border: "1px solid rgb(230,230,230)", borderRadius: 22 }}>
                    <img src="/screenshot1.png" alt="" />
                </div> */}
                {/* <Paragraph className="messsage__content-input" style={{ marginBottom: 0 }}>
                    <div className="fit-content">
                        <span>{text.message}</span>
                    </div>
                </Paragraph> */}
            </div>
        </div>
    );
}

export default Message;
