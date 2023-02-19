import { FacebookFilled, LoadingOutlined } from "@ant-design/icons";
import { Col, Input, Row, Spin, Typography } from "antd";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { openNotification } from "../../../components/Nofication";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument, generateKeywords } from "../../../firebase/services";
import firebase, { auth } from "./../../../firebase/config";
import "./style.scss";
const { Title } = Typography;

const Login = (props) => {
    const { user } = useContext(AuthContext);
    const { setIsLoadingMain, setIsValidAuth } = useContext(AppContext);
    const [isLogin, setIsLogin] = useState(false);
    const initialValues = {
        email: "",
        password: "",
    };

    const history = useNavigate();
    const handleFBLogin = async () => {
        const fbProvider = new firebase.auth.FacebookAuthProvider();
        const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
        setIsLoadingMain(true);
        if (additionalUserInfo.isNewUser) {
            addDocument("users", {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keyword: generateKeywords(user.displayName),
                listFollow: [],
                listFollower: [],
                isOnline: true,
                nofication: true,
                description: "",
            });
        }
        setIsLoadingMain(false);
        history("/");
    };

    const hanldeLogin = async (values) => {
        try {
            const response = await auth.signInWithEmailAndPassword(values.email, values.password);
            if (response) {
                console.log("ok");
                setIsLoadingMain(true);
            }
        } catch (error) {
            openNotification("topRight", "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu.", "error");
            console.log(error);
        } finally {
            setIsLoadingMain(false);
        }
    };
    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "rgb(220,220,220)" }} spin />;
    return (
        <div className="login__wrap">
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        backgroundSize: "468.32px 634.15px",
                        height: 581,
                        position: "relative",
                    }}
                >
                    <img src="/home-phones.png" alt="" height={634} style={{ position: "absolute", right: 30 }} />
                    <img src="/screenshot1.png" alt="" width={250} height={540} style={{ position: "absolute", right: 88, bottom: 13 }} />
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <Row style={{ width: 400 }}>
                    <Col className="login__form-top">
                        <Title className="login__form__title">
                            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="header__img" />
                        </Title>
                        <div style={{ textAlign: "center", paddingBottom: 16, color: "rgb(150,150,150)" }}>Email: hoangthaivn@gmail.com | Password: 123456</div>
                        <Formik
                            initialValues={initialValues}
                            // validationSchema={validationSchema}
                            onSubmit={hanldeLogin}
                        >
                            {(formikProps) => {
                                const { isSubmitting, values, handleChange } = formikProps;
                                return (
                                    <Form>
                                        <Input
                                            type="email"
                                            name="email"
                                            className="login__input-text"
                                            placeholder="Số điện thoại hoặc Gmail..."
                                            onChange={handleChange}
                                            //  onBlur={handleBlur}
                                            value={values.email}
                                            required
                                        />
                                        <Input
                                            type="password"
                                            name="password"
                                            className="login__input-text"
                                            placeholder="Mật khẩu..."
                                            onChange={handleChange}
                                            //  onBlur={handleBlur}
                                            value={values.password}
                                            required
                                        />

                                        <button type="primary" className="login__btn-login">
                                            <span>{isSubmitting ? <Spin indicator={antIcon} /> : "Đăng nhập"}</span>
                                        </button>
                                        {/* <Button type="submit">
                    {isSubmitting && <Spin size="sm" />}
                    <span>Đăng nhập</span>
                  </Button> */}
                                    </Form>
                                );
                            }}
                        </Formik>
                        <div className="login__Pseudo">
                            <div className="login__Pseudo-left"></div>
                            <div className="login__Pseudo-center">
                                <span>HOẶC</span>
                            </div>
                            <div className="login__Pseudo-right"></div>
                        </div>
                        <div type="primary" size="middle" className="login__btn-loginFB" onClick={handleFBLogin} style={{ textAlign: "center", cursor: "pointer" }}>
                            <span>
                                <FacebookFilled style={{ marginRight: 8 }} /> Đăng nhập bằng Facebook
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row justify="center" className="login__wrap__bottom" style={{ width: 400 }}>
                    <Col className="login__form-bottom">
                        <div className="register__content">
                            <span>Bạn chưa có tài khoản ư? </span>
                            <a
                                onClick={() => {
                                    history("/register");
                                }}
                            >
                                Đăng ký
                            </a>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

Login.propTypes = {};

export default Login;
