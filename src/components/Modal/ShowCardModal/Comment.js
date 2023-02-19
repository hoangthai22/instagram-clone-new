// @flow
import { Avatar, Typography } from "antd";
import * as React from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { formatDate } from "./../../../constants/formatDate";
const { Text, Paragraph } = Typography;

const Comment = (props) => {
    const { setUserInf, setOpenCardModal, setIconActiveIndex } = React.useContext(AppContext);
    const history = useNavigate();
    const { photoURL, displayName, commentText, createdAt, uid } = props.commentInf;
    const hanldeSearch = () => {
        setUserInf({
            displayName,
            photoURL,
            uid: uid,
        });
        setOpenCardModal(false);
        history("/profile/" + uid, uid);
        setIconActiveIndex(3);
    };

    return (
        <div style={{ display: "flex", marginTop: 16 }}>
            <div onClick={hanldeSearch}>
                <Avatar size="default" style={{ cursor: "pointer" }} src={photoURL} />
            </div>
            <div className="card__modal__info__content__post">
                <Paragraph style={{ marginBottom: 0, marginLeft: 10 }} ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                    <Text
                        onClick={hanldeSearch}
                        style={{
                            fontWeight: 500,
                            cursor: "pointer",
                            marginRight: 8,
                        }}
                    >
                        {displayName}
                    </Text>
                    {commentText}
                </Paragraph>
                <Text
                    style={{
                        marginLeft: 10,
                        fontWeight: 400,
                        color: "rgb(170,170,170)",
                        fontSize: ".8rem",
                    }}
                >
                    {formatDate(createdAt?.seconds)}
                </Text>
            </div>
        </div>
    );
};
export default Comment;
