import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import { useContext, useState } from "react";
import { handleFollow } from "../../constants/handleFollow";
import { AppContext } from "../../Context/AppProvider";
const { Text } = Typography;
export const ButtonFollowCustom = ({ follow, user }) => {
    const { profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo } = useContext(AppContext);
    const [loadingFolow, setLoadingFolow] = useState(false);
    return (
        <Button
            disabled={loadingFolow}
            onClick={() => {
                setLoadingFolow(true);
                handleFollow(follow, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo);
                // setIsFollow(true);
            }}
            style={{
                marginLeft: 20,
                backgroundColor: "#0095f6",
                borderRadius: 6,
                width: 100,
            }}
        >
            <Text style={{ color: "#fff", fontWeight: 400 }}>{loadingFolow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "rgb(250,250,250)" }} spin />} /> : "Theo dõi"}</Text>
        </Button>
    );
};
