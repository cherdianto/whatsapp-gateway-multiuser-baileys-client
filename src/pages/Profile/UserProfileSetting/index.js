import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, FormFeedback, NavLink, Row, TabContent, TabPane, Alert, Table, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import { useFormik } from "formik";
//import images
import avatar1 from '../../../assets/images/users/avatar-1.jpg';
import axiosJWT from '../../../utils/axiosJWT';
import { useUser } from '../../../context/user.context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projects, document } from '../../../common/data';

const apiUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD
const jurusan_from_env = process.env.REACT_APP_JURUSAN
const listJurusan = jurusan_from_env.split(",")
const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

const UserProfileSettings = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const { user, setUser } = useUser()

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    useEffect(() => {
        if (error) {
            toast(`${error.message}`, { position: "top-right", hideProgressBar: false, closeOnClick: true, className: 'bg-danger text-white' })
        }
        if (success) {
            toast(`${success.message}`, { position: "top-right", hideProgressBar: false, closeOnClick: true, className: 'bg-success text-white' })
        }
    }, [error, success])

    const changeProfileValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            nama: user?.nama || '',
            nim: user?.nim || '',
            whatsapp: user?.whatsapp || '',
            alamat: user?.alamat || '',
            email: user?.email || '',
            tempatLahir: user?.tempatLahir || '',
            tanggalLahir: user?.tanggalLahir || '',
            jurusan: user?.jurusan || '',
        },
        validationSchema: Yup.object({
            nama: Yup.string().required("Masukkan Nama Lengkap"),
            nim: Yup.string().required("Masukkan NIM/NIK"),
            whatsapp: Yup.string().required("Masukkan nomor whatsapp aktif").matches(whatsappRegex, 'Nomor tidak valid'),
            alamat: Yup.string().required("Masukkan Alamat Lengkap"),
            email: Yup.string().required("Masukkan Alamat Email"),
            tempatLahir: Yup.string().required("Masukkan Tempat Lahir"),
            tanggalLahir: Yup.string().required("Masukkan Tanggal Lahir"),
            jurusan: Yup.string().required("Pilih Jurusan"),
        }),
        onSubmit: async (values) => {
            // console.log(user)
            const formData = {
                nama: values.nama,
                nim: values.nim,
                whatsapp: values.whatsapp,
                email: values.email,
                alamat: values.alamat,
                tanggalLahir: values.tanggalLahir,
                tempatLahir: values.tempatLahir,
                jurusan: values.jurusan
            }

            console.log(formData)

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    },
                }
                // #NOTE : tidak bisa pake methode dari apiQuery, nanti returnnnya error
                const res = await axiosJWT.put(`${apiUrl}/auth/update-profile`, formData, config)
                console.log(res)
                setUser(res.data.user)
                setError(null)
                setSuccess({
                    status: res.data.status,
                    message: res.data.message
                })
            } catch (error) {
                console.log('cek error')
                console.log(error)
                setSuccess(null)
                setError({
                    status: true,
                    message: error.response.data.message || 'FAILED CHANGE PROFILE'
                })
            }

        }
    });

    const changePasswordValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required("Masukkan password lama"),
            newPassword: Yup.string().required("Masukkan Password baru"),
            confirmNewPassword: Yup.string().required("Ulangi masukkan Password baru"),
        }),
        onSubmit: async (values) => {
            // console.log(user)
            const cred = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword
            }

            // console.log(cred)

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    },
                }
                // #NOTE : tidak bisa pake methode dari apiQuery, nanti returnnnya error
                const res = await axiosJWT.post(`${apiUrl}/auth/change-password`, cred, config)
                setError(null)
                setSuccess({
                    status: true,
                    message: 'PASSWORD HAS BEEN CHANGED SUCCESSFULY'
                })
            } catch (error) {
                console.log('cek error')
                console.log(error)
                setSuccess(null)
                setError({
                    status: true,
                    message: error.response.data.message || 'FAILED CHANGE PASSWORD'
                })
            }

        }
    });

    const handleFlatpickr = (date) => {
        changeProfileValidation.setFieldValue("tanggalLahir", date[0])
        console.log(changeProfileValidation.values.tanggalLahir)
    }

    document.title = "Profile Settings | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-2">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">{user?.nama}</h5>
                                        <p className="text-muted mb-0">{user?.role}</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Complete Your Profile</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> Edit</Link>
                                        </div>
                                    </div>
                                    <div className="progress animated-progress custom-progress progress-label">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}
                                            aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                                            <div className="label">30%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-2">
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Personal Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Change Password
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Personalization
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Signatures
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "5" })}
                                                onClick={() => {
                                                    tabChange("5");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Activity Logs
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Form onSubmit={(e) => {
                                                e.preventDefault();
                                                changeProfileValidation.handleSubmit();
                                                return false;
                                            }}
                                                action="#">
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="nama" className="form-label">Nama Lengkap <span className="text-danger">*</span></Label>
                                                            <Input
                                                                name="nama"
                                                                type="text"
                                                                placeholder="Enter Nama"
                                                                onChange={changeProfileValidation.handleChange}
                                                                onBlur={changeProfileValidation.handleBlur}
                                                                value={changeProfileValidation.values.nama || ""}
                                                                invalid={
                                                                    changeProfileValidation.touched.nama && changeProfileValidation.errors.nama ? true : false
                                                                }
                                                            />
                                                            {changeProfileValidation.touched.nama && changeProfileValidation.errors.nama ? (
                                                                <FormFeedback type="invalid"><div>{changeProfileValidation.errors.nama}</div></FormFeedback>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="nim" className="form-label">NIM/NIK<span className="text-danger">*</span></Label>
                                                            <Input
                                                                name="nim"
                                                                type="text"
                                                                placeholder="Enter NIM"
                                                                onChange={changeProfileValidation.handleChange}
                                                                onBlur={changeProfileValidation.handleBlur}
                                                                value={changeProfileValidation.values.nim || ""}
                                                                invalid={
                                                                    changeProfileValidation.touched.nim && changeProfileValidation.errors.nim ? true : false
                                                                }
                                                            />
                                                            {changeProfileValidation.touched.nim && changeProfileValidation.errors.nim ? (
                                                                <FormFeedback type="invalid"><div>{changeProfileValidation.errors.nim}</div></FormFeedback>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="nama" className="form-label">Whatsapp <span className="text-danger">*</span></Label>
                                                            <Input
                                                                name="whatsapp"
                                                                type="text"
                                                                placeholder="Enter Nama"
                                                                onChange={changeProfileValidation.handleChange}
                                                                onBlur={changeProfileValidation.handleBlur}
                                                                value={changeProfileValidation.values.whatsapp || ""}
                                                                invalid={
                                                                    changeProfileValidation.touched.whatsapp && changeProfileValidation.errors.whatsapp ? true : false
                                                                }
                                                            />
                                                            {changeProfileValidation.touched.whatsapp && changeProfileValidation.errors.whatsapp ? (
                                                                <FormFeedback type="invalid"><div>{changeProfileValidation.errors.whatsapp}</div></FormFeedback>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                    
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="submit"
                                                                className="btn btn-primary">Updates</button>
                                                            <button type="button"
                                                                className="btn btn-soft-success">Cancel</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            {/* {error?.status ? (<Alert color="danger"> {error.message} </Alert>) : null}
                                            {success ? (<Alert color="success"> {success.message} </Alert>) : null} */}
                                            <div>
                                                <Form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    changePasswordValidation.handleSubmit();
                                                    return false;
                                                }}
                                                    action="#">
                                                    <Row className="g-2">
                                                        <Col lg={4}>
                                                            <div>
                                                                <Label htmlFor="oldPassword" className="form-label">Old Password</Label>
                                                                <Input
                                                                    name="oldPassword"
                                                                    className="form-control"
                                                                    placeholder="Enter Old Password"
                                                                    type="password"
                                                                    onChange={changePasswordValidation.handleChange}
                                                                    onBlur={changePasswordValidation.handleBlur}
                                                                    value={changePasswordValidation.values.oldPassword || ""}
                                                                    invalid={
                                                                        changePasswordValidation.touched.oldPassword && changePasswordValidation.errors.oldPassword ? true : false
                                                                    }
                                                                />
                                                                {changePasswordValidation.touched.oldPassword && changePasswordValidation.errors.oldPassword ? (
                                                                    <FormFeedback type="invalid">{changePasswordValidation.errors.oldPassword}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>



                                                        <Col lg={4}>
                                                            <div>
                                                                <Label htmlFor="newPassword" className="form-label">New Password</Label>
                                                                <Input
                                                                    name="newPassword"
                                                                    className="form-control"
                                                                    placeholder="Enter New Password"
                                                                    type="password"
                                                                    onChange={changePasswordValidation.handleChange}
                                                                    onBlur={changePasswordValidation.handleBlur}
                                                                    value={changePasswordValidation.values.newPassword || ""}
                                                                    invalid={
                                                                        changePasswordValidation.touched.newPassword && changePasswordValidation.errors.newPassword ? true : false
                                                                    }
                                                                />
                                                                {changePasswordValidation.touched.newPassword && changePasswordValidation.errors.newPassword ? (
                                                                    <FormFeedback type="invalid">{changePasswordValidation.errors.newPassword}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                        <Col lg={4}>
                                                            <div>
                                                                <Label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</Label>
                                                                <Input
                                                                    name="confirmNewPassword"
                                                                    className="form-control"
                                                                    placeholder="Enter New Password"
                                                                    type="password"
                                                                    onChange={changePasswordValidation.handleChange}
                                                                    onBlur={changePasswordValidation.handleBlur}
                                                                    value={changePasswordValidation.values.confirmNewPassword || ""}
                                                                    invalid={
                                                                        changePasswordValidation.touched.confirmNewPassword && changePasswordValidation.errors.confirmNewPassword ? true : false
                                                                    }
                                                                />
                                                                {changePasswordValidation.touched.confirmNewPassword && changePasswordValidation.errors.confirmNewPassword ? (
                                                                    <FormFeedback type="invalid">{changePasswordValidation.errors.confirmNewPassword}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>

                                                        <Col lg={12}>
                                                            <div className="mb-3">
                                                                <Link to="/forgot-password"
                                                                    className="link-primary text-decoration-underline">Forgot
                                                                    Password ?</Link>
                                                            </div>
                                                        </Col>

                                                        <Col lg={12}>
                                                            <div className="text-end">
                                                                <button type="submit" className="btn btn-success">
                                                                    Change Password</button>
                                                            </div>
                                                        </Col>

                                                    </Row>

                                                </Form>
                                            </div>
                                            {/* <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-primary">All Logout</Link>
                                                </div>
                                                <h5 className="card-title">Login History</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">Los Angeles, United States - March 16 at
                                                        2:47PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-tablet-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Apple iPad Pro</h6>
                                                    <p className="text-muted mb-0">Washington, United States - November 06
                                                        at 10:43AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Galaxy S21 Ultra 5G</h6>
                                                    <p className="text-muted mb-0">Conneticut, United States - June 12 at
                                                        3:24PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-macbook-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Dell Inspiron 14</h6>
                                                    <p className="text-muted mb-0">Phoenix, United States - July 26 at
                                                        8:10AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div> */}
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">Whatsapp Notification</label>
                                                            <p className="text-muted">Messages from people you follow</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="directMessage" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="desktopNotification">
                                                                Email Notifications
                                                            </Label>
                                                            <p className="text-muted">Choose the option you want as your
                                                                default setting. Block a site: Next to "Not allowed to
                                                                send notifications," click Add.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="desktopNotification" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="emailNotification">
                                                                Show email notifications
                                                            </Label>
                                                            <p className="text-muted"> Under Settings, choose Notifications.
                                                                Under Select an account, choose the account to enable
                                                                notifications for. </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="emailNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="chatNotification">
                                                                Show chat notifications
                                                            </Label>
                                                            <p className="text-muted">To prevent duplicate mobile
                                                                notifications from the Gmail and Chat apps, in settings,
                                                                turn off Chat notifications.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="chatNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="purchaesNotification">
                                                                Show purchase notifications
                                                            </Label>
                                                            <p className="text-muted">Get real-time purchase alerts to
                                                                protect yourself from fraudulent charges.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="purchaesNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                        </TabPane>
                                        <TabPane tabId="4">
                                            <Card>
                                                <CardBody>
                                                    <div className="d-flex align-items-center mb-4">
                                                        <h5 className="card-title flex-grow-1 mb-0">Your Signatures</h5>
                                                        <div className="flex-shrink-0">
                                                            <Input className="form-control d-none" type="file" id="formFile" />
                                                            <Label htmlFor="formFile" className="btn btn-danger"><i className="ri-upload-2-fill me-1 align-bottom"></i> Upload
                                                                File</Label>
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <div className="table-responsive">
                                                                <Table className="table-borderless align-middle mb-0">
                                                                    <thead className="table-light">
                                                                        <tr>
                                                                            <th scope="col">File Name</th>
                                                                            <th scope="col">Type</th>
                                                                            <th scope="col">Size</th>
                                                                            <th scope="col">Upload Date</th>
                                                                            <th scope="col">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(document || []).map((item, key) => (
                                                                            <tr key={key}>
                                                                                <td>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <div className="avatar-sm">
                                                                                            <div
                                                                                                className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}>
                                                                                                <i className={item.icon}></i>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ms-3 flex-grow-1">
                                                                                            <h6 className="fs-15 mb-0"><Link to="#">{item.fileName}</Link>
                                                                                            </h6>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td>{item.fileType}</td>
                                                                                <td>{item.fileSize}</td>
                                                                                <td>{item.updatedDate}</td>
                                                                                <td>
                                                                                    <UncontrolledDropdown direction='start'>
                                                                                        <DropdownToggle tag="a" className="btn btn-light btn-icon" id="dropdownMenuLink15" role="button">
                                                                                            <i className="ri-equalizer-fill"></i>
                                                                                        </DropdownToggle>
                                                                                        <DropdownMenu>
                                                                                            <DropdownItem><i className="ri-eye-fill me-2 align-middle text-muted" />View</DropdownItem>
                                                                                            <DropdownItem><i className="ri-download-2-fill me-2 align-middle text-muted" />Download</DropdownItem>
                                                                                            <DropdownItem divider />
                                                                                            <DropdownItem><i className="ri-delete-bin-5-line me-2 align-middle text-muted" />Delete</DropdownItem>
                                                                                        </DropdownMenu>
                                                                                    </UncontrolledDropdown>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </TabPane>
                                        <TabPane tabId="5">
                                            <Card>
                                                <CardBody>
                                                    <h5 className="card-title mb-3">Activities</h5>
                                                    <div className="acitivity-timeline">
                                                        <div className="acitivity-item d-flex">
                                                            <div className="flex-shrink-0">
                                                                <img src={avatar1} alt="" className="avatar-xs rounded-circle acitivity-avatar" />
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6 className="mb-1">Oliver Phillips <span
                                                                    className="badge bg-soft-primary text-primary align-middle">New</span>
                                                                </h6>
                                                                <p className="text-muted mb-2">We talked about a project on linkedin.</p>
                                                                <small className="mb-0 text-muted">Today</small>
                                                            </div>
                                                        </div>
                                                        <div className="acitivity-item py-3 d-flex">
                                                            <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                                                                <div className="avatar-title bg-soft-success text-success rounded-circle"> N </div>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6 className="mb-1">Nancy Martino <span
                                                                    className="badge bg-soft-secondary text-secondary align-middle">In
                                                                    Progress</span></h6>
                                                                <p className="text-muted mb-2"><i
                                                                    className="ri-file-text-line align-middle ms-2"></i>
                                                                    Create new project Buildng product</p>
                                                                <small className="mb-0 text-muted">Yesterday</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default UserProfileSettings;