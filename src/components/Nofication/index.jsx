import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";

export const openNotification = (placement, message, icon) => {
    if(icon === "success"){
        icon = <CheckCircleTwoTone twoToneColor="#52c41a" />;
    }else if(icon === "error"){
        icon = <CloseCircleOutlined style={{ color: "red" }}  />;
    }
    notification.open({
      message: `Thông báo `,
      description: message,
      placement,
      icon: icon,
    });
  };