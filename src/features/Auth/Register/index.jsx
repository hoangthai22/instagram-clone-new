import { FacebookFilled, LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Typography, notification, Spin } from "antd";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { addDocument, generateKeywords } from "../../../firebase/services";
import firebase, { auth } from "./../../../firebase/config";
import * as Yup from "yup";
import "./style.scss";
import { AuthContext } from "../../../Context/AuthProvider";
import { openNotification } from "../../../components/Nofication";

const { Title } = Typography;

const Register = (props) => {
    const initialValues = {
        email: "",
        password: "",
        userName: "",
        fullName: "",
    };
    const history = useNavigate();
    const { setIsLoadingMain } = useContext(AppContext);
    const { setUser } = useContext(AuthContext);
    const handleRegister = async (values) => {
        try {
            const response = await auth.createUserWithEmailAndPassword(values.email, values.password);
            if (!response) throw new Error("Could not create a new User");
            const response2 = await auth.signInWithEmailAndPassword(values.email, values.password);

            await response.user.updateProfile({
                displayName: values.userName,
            });
            const userRegister = {
                displayName: response.user.displayName,
                email: response.user.email,
                photoURL: "https://www.w3schools.com/howto/img_avatar.png",
                fullName: values.fullName,
                uid: response.user.uid,
                providerId: response.additionalUserInfo.providerId,
                keyword: generateKeywords(response.user.displayName),
                listFollow: [],
                listFollower: [],
                isOnline: true,
                nofication: true,
                description: "",
            };
            await addDocument("users", userRegister);
            console.log("add");
            if (response && response2) {
                setUser(userRegister);
                setIsLoadingMain(true);
                history("/");
            }
        } catch (error) {
            openNotification("topRight", "R???t ti???c, Email ??a?? t????n ta??i. Vui l??ng nh????p la??i email", "error");
        } finally {
            setIsLoadingMain(false);
        }
    };

    const handleFBLogin = async () => {
        try {
            const fbProvider = new firebase.auth.FacebookAuthProvider();
            const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
            setIsLoadingMain(true);
            if (additionalUserInfo.isNewUser) {
                addDocument("users", {
                    displayName: user.displayName,
                    email: user.email,
                    fullName: "",
                    photoURL: "",
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keyword: generateKeywords(user.displayName),
                    listFollow: [],
                    listFollower: [],
                    isOnline: true,
                    nofication: true,
                });
            }
        } catch (error) {
            openNotification("topRight");
        } finally {
            setIsLoadingMain(false);
            history("/");
        }
    };
    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "rgb(220,220,220)" }} spin />;
    return (
        <div className="register__wrap">
            <Row justify="center">
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 6 }} className="register__form-top">
                    <Title className="register__form__title">Instagram</Title>
                    {/* <Button type="primary" size="middle" className="login__btn-register" onClick={handleFBLogin} style={{ textAlign: "center", cursor: "pointer" }}>
                        <span>
                            <FacebookFilled /> ????ng nh????p b????ng Facebook
                        </span>
                    </Button> */}
                    {/* <div className="login__Pseudo">
                        <div className="login__Pseudo-left"></div>
                        <div className="login__Pseudo-center">
                            <span>HO????C</span>
                        </div>
                        <div className="login__Pseudo-right"></div>
                    </div> */}
                    <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        {(formikProps) => {
                            const { isSubmitting, values, handleChange } = formikProps;
                            return (
                                <Form>
                                    <Input
                                        type="email"
                                        name="email"
                                        className="login__input-text"
                                        placeholder="S???? ??i????n thoa??i ho????c Gmail..."
                                        onChange={handleChange}
                                        //  onBlur={handleBlur}
                                        value={values.email}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        name="password"
                                        className="login__input-text"
                                        placeholder="M????t kh????u..."
                                        onChange={handleChange}
                                        //  onBlur={handleBlur}
                                        value={values.password}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="userName"
                                        className="login__input-text"
                                        placeholder="T??n ng??????i du??ng..."
                                        onChange={handleChange}
                                        //  onBlur={handleBlur}
                                        value={values.userName}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="fullName"
                                        className="login__input-text"
                                        placeholder="H??? v?? t??n"
                                        onChange={handleChange}
                                        //  onBlur={handleBlur}
                                        value={values.fullName}
                                        required
                                    />
                                    <button type="submit" className="login__btn-register">
                                        <span>{isSubmitting ? <Spin indicator={antIcon} /> : "????ng Ky??"}</span>
                                    </button>
                                </Form>
                            );
                        }}
                    </Formik>
                    <div style={{ marginLeft: 60, marginRight: 60, marginTop: 20 }}>
                        <p style={{ textAlign: "center", color: "rgb(140,140,140)" }}>
                            B???ng c??ch ????ng k??, b???n ?????ng ?? v???i <span style={{ fontWeight: 500 }}>??i???u kho???n</span>, <span style={{ fontWeight: 500 }}>Ch??nh s??ch d??? li???u</span> v??{" "}
                            <span style={{ fontWeight: 500 }}>Ch??nh s??ch cookie</span> c???a ch??ng t??i.
                        </p>
                    </div>
                </Col>
            </Row>
            <Row justify="center" className="register__wrap__bottom">
                <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 6 }} className="login__form-bottom">
                    <div className="register__content">
                        <span>B???n ??a?? c?? t??i kho???n ??? </span>
                        <a
                            onClick={() => {
                                history("/login");
                            }}
                        >
                            ????ng Nh????p
                        </a>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

Register.propTypes = {};

export default Register;
