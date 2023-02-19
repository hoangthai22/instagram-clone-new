import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import { useContext, useState } from "react";
import { handleFollow } from "../../constants/handleFollow";
import { AppContext } from "../../Context/AppProvider";
const { Text } = Typography;
export const ButtonTextFollowCustom = ({ follow, user, setListUserRecommend, listUserRecommend }) => {
    const { profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo } = useContext(AppContext);
    const [loadingFolow, setLoadingFolow] = useState(false);
    return (
        <Text
            disabled={loadingFolow}
            style={{
                fontSize: ".7.5rem",
                fontWeight: 500,
                color: "#0095f6",
                // marginLeft: 10,
                cursor: "pointer",
                alignSelf: "center",
                width: 60,
            }}
            onClick={() => {
                setLoadingFolow(true);
                handleFollow(follow, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo).then((i) => {
                    setListUserRecommend(listUserRecommend.filter((i) => i.uid !== follow.uid));
                    setLoadingFolow(false);
                });
                // setIsFollow(true);
            }}
        >
            <div style={{ display: "flex", justifyContent: "center" }}>{loadingFolow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "#0095f6" }} spin />} /> : "Theo dõi"}</div>
        </Text>
    );
};
