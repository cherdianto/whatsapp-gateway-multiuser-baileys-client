import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// #REGISTER
// action
// import { registerUser, apiError, resetRegisterFlag } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import axios from 'axios'
import { registerUser } from "../../apiQuery/user.query";

const apiUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD

const Register = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)


    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            nama: '',
            email: '',
            nim: '',
            whatsapp: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            nama: Yup.string().required("Masukkan nama lengkap"),
            email: Yup.string().required("Masukkan email Anda"),
            nim: Yup.number().required("Masukkan NIM?NIK"),
            whatsapp: Yup.number().required("Masukkan whatsapp"),
            password: Yup.string().required("Masukkan password"),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password harus sama')
        }),
        onSubmit: async (values, { resetForm }) => {
            const formData = {
                email : values.email,
                password : values.password,
                confirmPassword : values.confirmPassword,
                whatsapp: values.whatsapp,
                nim: values.nim,
                nama: values.nama,
            }

            try {
                const res = await registerUser(formData)
                // console.log(res.user)
                // setUser(res.user)
                setError(null)
                setSuccess(true)
            } catch (error) {
                console.log('error disni')
                console.log(error)
                setSuccess(false)
                // if (error.response.status === 429) {
                //     // rate limiter error
                //     setError({
                //         status: true,
                //         message: error.response?.data
                //     })
                // } else {
                    // other errors
                    setError({
                        status: true,
                        message: error.response?.message || 'FAILED'
                    })
                // }
            }
            resetForm({ values: '' })
        }
    });

    // const { error, registrationError, success } = useSelector(state => ({
    //     registrationError: state.Account.registrationError,
    //     success: state.Account.success,
    //     error: state.Account.error
    // }));

    // useEffect(() => {
    //     // dispatch(apiError(""));
    // }, [dispatch]);

    // useEffect(() => {
    //     if (success) {
    //         setTimeout(() => history.push("login"), 3000);
    //     }

    //     setTimeout(() => {
    //         // dispatch(resetRegisterFlag());
    //     }, 3000);

    // }, [dispatch, success, error, history]);

    document.title = "Basic SignUp | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">

                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free velzon account now</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        {/* {registrationError} */}
                                                        {error?.message}</div></Alert>
                                                ) : null}
                                                <div className="mb-3">
                                                    <Label htmlFor="nama" className="form-label">Nama Lengkap <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="nama"
                                                        type="text"
                                                        placeholder="Enter Nama"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nama || ""}
                                                        invalid={
                                                            validation.touched.nama && validation.errors.nama ? true : false
                                                        }
                                                    />
                                                    {validation.touched.nama && validation.errors.nama ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.nama}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="usernim" className="form-label">NIM/NIK <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="nim"
                                                        name="nim"
                                                        className="form-control"
                                                        placeholder="Enter nim address"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.nim || ""}
                                                        invalid={
                                                            validation.touched.nim && validation.errors.nim ? true : false
                                                        }
                                                    />
                                                    {validation.touched.nim && validation.errors.nim ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.nim}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email address"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="userwhatsapp" className="form-label">Whatsapp <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="whatsapp"
                                                        name="whatsapp"
                                                        className="form-control"
                                                        placeholder="Enter whatsapp"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.whatsapp || ""}
                                                        invalid={
                                                            validation.touched.whatsapp && validation.errors.whatsapp ? true : false
                                                        }
                                                    />
                                                    {validation.touched.whatsapp && validation.errors.whatsapp ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.whatsapp}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                

                                                <div className="mb-3">
                                                    <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password || ""}
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-2">
                                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.confirmPassword || ""}
                                                        invalid={
                                                            validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false
                                                        }
                                                    />
                                                    {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirmPassword}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-4">
                                                    <p className="mb-0 fs-12 text-muted fst-italic">By registering you agree to the Velzon
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">Terms of Use</Link></p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">Sign Up</button>
                                                </div>

                                                {/* <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                                                    </div>

                                                    <div>
                                                        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>
                                                    </div>
                                                </div> */}
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
