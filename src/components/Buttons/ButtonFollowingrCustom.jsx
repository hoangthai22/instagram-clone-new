import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import { useContext, useState } from "react";
import { handleCancelFollow } from "../../constants/handleFollow";
import { AppContext } from "../../Context/AppProvider";
const { Text } = Typography;
export const ButtonFollowingCustom = ({ follow, user }) => {
    const { profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo } = useContext(AppContext);
    const [loadingFolow, setLoadingFolow] = useState(false);
    return (
        <Button
            disabled={loadingFolow}
            onClick={() => {
                console.log("cancel");
                setLoadingFolow(true);
                handleCancelFollow(follow, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo).then(() => {
                    setLoadingFolow(false);
                });
                // setIsFollow(false);
            }}
            style={{ marginLeft: 20, borderRadius: 6, width: 120 }}
        >
            <Text style={{ fontWeight: 400 }}>{loadingFolow ? <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: "#d9d9d9" }} spin />} /> : "Đang theo dõi"}</Text>
        </Button>
    );
};
