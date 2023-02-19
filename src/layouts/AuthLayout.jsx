import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header";
import { AddCardModal } from "../components/Modal/AddCardModal/AddCardModal";
import { ChangeAvatarModal } from "../components/Modal/ChangeAvatar/ChangeAvatar";
import InviteMemberModals from "../components/Modal/InviteMemberModals";
import { ConfirmDeleteModal } from "../components/Modal/SettingModal/ConfirmDeleteModal";
import { SettingModal } from "../components/Modal/SettingModal/SettingModal";
import { SettingPostModal } from "../components/Modal/SettingModal/SettingPostModal";
import ShowCardModal from "../components/Modal/ShowCardModal/ShowCardModal";
import { UpdateCardModal } from "../components/Modal/UpdateCardModal/UpdateCardModal";
import { ViewFollowerModal } from "../components/Modal/ViewFollowModal/ViewFollowerModal";
import { ViewFollowModal } from "../components/Modal/ViewFollowModal/ViewFollowModal";
import { AppContext } from "../Context/AppProvider";
import UploadImgModal from "../features/Messenger/ChatWindow/UploadImgModal";

const AuthLayout = (props) => {
    const { openUpdateCardModal, openFollowerModal, openFollowModal, openCardModal } = useContext(AppContext);
    const history = useNavigate();
    // if (!user.uid) {
    //     console.log("go login");
    //     history("/login");
    // }
    return (
        <div>
            <HeaderComponent />
            {props.component}
            {openCardModal && <ShowCardModal />}
            <InviteMemberModals />
            <SettingModal />
            <AddCardModal />
            {openFollowModal && <ViewFollowModal />}
            {openFollowerModal && <ViewFollowerModal />}
            <SettingPostModal />
            <ChangeAvatarModal />
            <ConfirmDeleteModal />
            <UploadImgModal />
            {openUpdateCardModal && <UpdateCardModal />}
        </div>
    );
};

export default AuthLayout;
