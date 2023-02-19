import { Avatar, Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MODAL_MODE_INVITE, MODAL_MODE_SEARCH_USER } from "../../constants/modalMode";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
import { addDocument, stringToHash } from "../../firebase/services";
import { fetchUserList } from "./../../hooks/useFirestore";

function DebountSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [option, setOption] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOption([]);
            setFetching(true);

            // console.log("option", option);
            fetchOptions(value, props.curMembers).then((newOptions) => {
                setOption(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);

    return (
        <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" /> : ""} {...props}>
            {option.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size="small" src={opt.photoURL} style={{ marginRight: 8 }}>
                        {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {`${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

export default function InviteMemberModals() {
    const { isInviteMember, setisInviteMember, setIsRoomChange, isShowModalMode, setUserInf, setSelectedUserId, setIconActiveIndex } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [value, setValue] = useState([]);
    const [titleModal, setTitleModal] = useState("");
    const [form] = Form.useForm();
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (isShowModalMode === MODAL_MODE_SEARCH_USER) {
            setTitleModal("Tìm kiếm người dùng");
        } else if (isShowModalMode === MODAL_MODE_INVITE) {
            setTitleModal("Mời bạn");
        }
    }, [isShowModalMode]);

    const handleIOk = () => {
        if (value.length === 0) {
            setisInviteMember(false);
            return;
        }
        if (isShowModalMode === MODAL_MODE_SEARCH_USER) {
            setUserInf({
                displayName: value[0].label[1],
                photoURL: value[0].label[0].props.src,
                uid: value[0].value,
            });
            history("/profile/" + value[0].value, value[0].value);
            setIconActiveIndex(3);
        } else if (isShowModalMode === MODAL_MODE_INVITE) {
            handleChatting(value[0].value);

            setIsRoomChange(true);
        }
        //reset for
        setisInviteMember(false);
        setValue([]);
        form.resetFields();
    };
    const handleChatting = async (inviteMemberId) => {
        const { uid } = user;
        const result = await db
            .collection("rooms")
            .where("members", "array-contains", uid)
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => {
                    if (doc.data()?.members.includes(uid) && doc.data()?.members.includes(inviteMemberId)) {
                        return doc.data();
                    } else return null;
                });
            });
        if (result[0] === null || result.length === 0) {
            await addDocument("rooms", {
                roomId: stringToHash(uid + inviteMemberId + new Date().toString()).toString(),
                members: [uid, inviteMemberId],
            });
            await addDocument("nofications", {
                uid: uid,
                seen: true,
                roomId: stringToHash(uid + inviteMemberId + new Date().toString()).toString(),
            });
            await addDocument("nofications", {
                uid: inviteMemberId,
                seen: false,
                roomId: stringToHash(uid + inviteMemberId + new Date().toString()).toString(),
            });
            setSelectedUserId(inviteMemberId);
        }

        history("/chat/" + stringToHash(uid + inviteMemberId + new Date().toString()).toString());
    };
    const handleCancel = () => {
        setisInviteMember(false);
        form.resetFields();
    };

    return (
        <div>
            <Modal title={titleModal} open={isInviteMember} onOk={handleIOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" style={{ margin: 20 }}>
                    <DebountSelect
                        mode="multiple"
                        label="Member name"
                        value={value}
                        placeholder="Nhập tên..."
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: "100%" }}
                        curMembers={uid ? uid : ""}
                    />
                </Form>
            </Modal>
        </div>
    );
}
