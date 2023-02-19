import { Avatar, Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import { fetchUserList } from "./../../hooks/useFirestore";

function DebountSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [option, setOption] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOption([]);
            setFetching(true);
            // console.log("value", value);
            // console.log("option", option);
            fetchOptions(value, props.curMembers).then((newOptions) => {
                setOption(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);
    // console.log("New option", option);
    return (
        <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" /> : ""} {...props}>
            {option.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size="small" src={opt.photoURL}>
                        {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {`${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

export default function InviteMemberModals() {
    const { isInviteMember, setisInviteMember, setIsRoomChange } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

    const handleIOk = () => {
        addDocument("rooms", {
            members: [uid, value[0].key],
        });

        setIsRoomChange(true);
        setisInviteMember(false);
        //reset for
        form.resetFields();
    };

    const handleCancel = () => {
        setisInviteMember(false);
        form.resetFields();
    };

    return (
        <div>
            <Modal title="Mời bạn" open={isInviteMember} onOk={handleIOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
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
