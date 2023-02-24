import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, FormFeedback, Nav, NavItem, NavLink } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/user.context";
import DeleteModal from "../../Components/Common/DeleteModal";
// import * as XLSX from 'xlsx'
import { Link } from 'react-router-dom'
import { Card, CardBody, Alert, CardHeader, Modal, ModalBody, ModalHeader, Input, ModalFooter, Form, Row, Col, Label, CardFooter } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
// import * as Yup from 'yup'
import classnames from "classnames";
import { getDatas, addData } from "../../apiQuery/message.query";
import * as moment from "moment";


const Message = () => {
    const { user, setUser } = useUser()
    const queryClient = useQueryClient()
    const { status, data } = useQuery(['message'], () => getDatas(user?.accessToken))

    const [modalImportXls, setModalImportXls] = useState(false)
    const [modalTambahList, setModalTambahList] = useState(false)
    // const [listDataDosen, setListDataDosen] = useState(data)
    const [dataRow, setDataRow] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [checkboxState, setCheckboxState] = useState([])
    const [modal, setModal] = useState(false);
    const [date, setDate] = useState('');
    const [activeTab, setActiveTab] = useState("1");
    const [listMessages, setListMessages] = useState(data);


    const messages = data || []

    const memoHook = useMemo;
    const callbackHook = useCallback;

    const addSingleData = useMutation(addData, {
        onSuccess: () => {
            queryClient.invalidateQueries('message')
        }
    })

    // const deleteSingleData = useMutation(deleteData, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries('message')
    //     }
    // })

    // const updateSingleData = useMutation(updateData, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries('message')
    //     }
    // })

    useEffect(() => {
        if (data) {
            // console.log(data)
            setListMessages(data)
        }
    }, [data])

    // useEffect(() => {

    //     if (updateSingleData.isError) {
    //         updateSingleData.reset()
    //         toast('UPDATE DOSEN ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
    //     }

    //     if (deleteSingleData.isError) {
    //         deleteSingleData.reset()
    //         toast('DELETE SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
    //     }

    // }, [ deleteSingleData, updateSingleData])

    // useEffect(() => {

    //     if (updateSingleData.isSuccess) {
    //         updateSingleData.reset()
    //         toast('UPDATE DOSEN SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
    //     }

    //     if (deleteSingleData.isSuccess) {
    //         deleteSingleData.reset()
    //         toast('DELETE SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
    //     }

    // }, [ deleteSingleData, updateSingleData])
    const handleValidDate = date => {
        // console.log(date)
        const date1 = moment(new Date(date)).format("DD MMM Y");
        // console.log(date1)
        return date1;
    };

    const handleValidTime = (time) => {
        const time1 = new Date(time);
        const getHour = time1.getUTCHours();
        const getMin = time1.getUTCMinutes();
        const getTime = `${getHour}:${getMin}`;
        var meridiem = "";
        if (getHour >= 12) {
            meridiem = "PM";
        } else {
            meridiem = "AM";
        }
        const updateTime = moment(getTime, 'hh:mm').format('hh:mm') + " " + meridiem;
        return updateTime;
    };

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            id: (dataRow && dataRow._id) || '',
            userId: (dataRow && dataRow.userId) || '',
            to: (dataRow && dataRow.to) || '',
            isGroup: (dataRow && dataRow.isGroup) || '',
            message: (dataRow && dataRow.message) || '',
            retry: (dataRow && dataRow.retry) || '',
            priority: (dataRow && dataRow.priority) || '',
            status: (dataRow && dataRow.status) || '',
            time: (dataRow && dataRow.time) || '',

        },
        // validationSchema: Yup.object({
        //   refId: Yup.string().required("Please Enter device Id"),
        //   nama: Yup.string().required("Please Enter nama Name"),
        //   nim: Yup.string().required("Please Enter Total nim"),
        //   status: Yup.string().required("Please Enter Delivery Status")
        // }),
        onSubmit: async (values) => {
            // console.log(values)

            const choosenDevice = user?.devices?.filter((device) => device._id === values.deviceId)
            // console.log(choosenDevice[0].apiKey)

            const newValues = {
                ...values,
                message: {
                    text: values.message
                },
                key : choosenDevice[0].apiKey
            }

            // console.log(newValues)

            if (!isEdit) {
                // console.log('masuk sini')
                try {
                    await addSingleData.mutate({ accessToken: user?.accessToken, newValues })
                } catch (error) {
                    throw new Error(error)
                }
            }

            toggleModalTambahList()
            validation.resetForm()
        },
    });

    const defaultdate = () => {
        let d = new Date(),
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let h = (d.getHours() % 12) || 12;
        let ampm = d.getHours() < 12 ? "AM" : "PM";
        return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm).toString());
    };


    const toggle = callbackHook(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);

            setDate(defaultdate());
        }
    }, [modal]);

    const handleUserClick = callbackHook((arg) => {
        const device = arg;
        const {
            id,
            deviceId,
            to,
            isGroup,
            message,
            status,
            userId,
            time
        } = device

        setUser({
            id,
            deviceId,
            to,
            isGroup,
            message,
            status,
            userId,
            time
        });
        // setCheckboxState(scopeAdminSurat)
        setIsEdit(true);
        toggle();
    }, [toggle]);

    const handleCheckboxChange = (e) => {
        let tempData
        if (checkboxState.includes(e.target.id)) {
            tempData = checkboxState.filter(item => item !== e.target.id)
        } else {
            tempData = [...checkboxState, e.target.id]
        }
        setCheckboxState(tempData)
    }

    // Checked All
    const checkedAll = () => {
        const checkall = document.getElementById("checkBoxAllUser");
        const ele = document.querySelectorAll(".userCheckBox");

        if (checkall.checked) {
            ele.forEach((ele) => {
                ele.checked = true;
            });
        } else {
            ele.forEach((ele) => {
                ele.checked = false;
            });
        }
    };

    const columns = memoHook(
        () => [
            {
                Header: <input type="checkbox" id="checkBoxAllUser" onClick={() => checkedAll()} />,
                Cell: (cellProps) => {
                    return <input type="checkbox" className="userCheckBox" value={cellProps.row.original.id} />;
                },
                id: '#',
            },
            {
                Header: "Device Name",
                accessor: "deviceId.deviceName",
                filterable: true,
                id: "deviceName"
            },
            {
                Header: "To",
                accessor: "to",
                id: "to",
                filterable: true
            },
            {
                Header: "Message",
                accessor: "message.text",
                id: "message",
                filterable: true,
                maxWidth: 400
            },
            {
                Header: "Status",
                accessor: "status",
                id: "status",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case '1':
                            return <span className="badge text-uppercase bg-warning"> QUEU </span>;
                        case '2':
                            return <span className="badge text-uppercase bg-success"> SENT </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Retry",
                accessor: "retry",
                id: "retry",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case true:
                            return <span className="badge text-uppercase bg-info"> Yes </span>;
                        case false:
                            return <span className="badge text-uppercase bg-success"> No </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Priority",
                accessor: "priority",
                id: "priority",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case true:
                            return <span className="badge text-uppercase bg-danger"> Yes </span>;
                        case false:
                            return <span className="badge text-uppercase bg-success"> No </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Schedule",
                accessor: "time",
                id: "time",
                filterable: true,
                Cell: (cell) => (
                    // return handleValidDate(Date(cell.value))
                    <>
                        {handleValidDate(Date(cell.value))},
                        <small className="text-muted"> {handleValidTime(Date(cell.value))}</small>
                    </>
                )
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            {/* { cellProps.row.original.status[0].progres === 'Approved' && ( */}
                            <li className="list-inline-item">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => {
                                        const dataUser = cellProps.row.original;
                                        setDataRow(dataUser)
                                        // handleEditClick();
                                    }}
                                >
                                    <i className="ri-send-plane-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => {
                                        const dataUser = cellProps.row.original;
                                        setDataRow(dataUser)
                                        handleEditClick();
                                    }}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => {
                                        const dataUser = cellProps.row.original;
                                        // console.log(dataUser)
                                        setDataRow(dataUser)
                                        // handleDeleteClick();
                                    }}
                                >
                                    <i className="ri-delete-bin-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
        ],
        [handleUserClick]
    );

    const toggleModalImportXls = callbackHook(() => {
        if (modalImportXls) {
            setModalImportXls(false)
        } else {
            setModalImportXls(true)
        }
    })

    const toggleModalTambahList = callbackHook(() => {
        if (modalTambahList) {
            setModalTambahList(false)
        } else {
            setModalTambahList(true)
        }
    })

    const handleEditClick = () => {
        setIsEdit(true)
        toggleModalTambahList()
    }

    // const handleEditRow = () => {
    //   if(dataRow){
    //     dispatch(updateSingleDosen(dataRow))
    //     setModalTambahList(false)
    //   }
    // }

    const handleDeleteClick = () => {
        setDeleteModal(true)
    }

    const toggleTab = (tab, type, field) => {
        // console.log(tab, type, field)
        // console.log(messages)
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filteredOrders = messages;
            if (type !== "all" && field === "connectionStatus") {
                filteredOrders = messages.filter((data) => data.connectionStatus === type);
            } else if (type !== "all" && field === "status") {
                filteredOrders = messages.filter((data) => data.status === type);
            }
            setListMessages(filteredOrders);
        }
        // console.log(listMessages)
    };

    // const handleDeleteOrder = async () => {
    //     console.log(dataRow._id)
    //     if (dataRow._id) {
    //         try {
    //             await deleteSingleData.mutate({ accessToken: user?.accessToken, id: dataRow._id })
    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //         setDeleteModal(false)
    //     }
    // }

    // const handleDeleteRow = async () => {
    //     console.log(dataRow._id)
    //     if (dataRow._id) {
    //         try {
    //             await deleteSingleData.mutate({ accessToken: user?.accessToken, id: dataRow._id })
    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //         setDeleteModal(false)
    //     }
    // }

    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

    // const validation = useFormik({
    //     enableReinitialize: true,
    //     initialValues: {
    //         nama: (dataRow && dataRow.nama) || "",
    //         nik: (dataRow && dataRow.nik) || "",
    //         email: (dataRow && dataRow.email) || "",
    //         whatsapp: (dataRow && dataRow.whatsapp) || "",
    //         id: (dataRow && dataRow._id) || "",
    //     },
    //     validationSchema: Yup.object({
    //         nama: Yup.string().required("Masukkan nama lengkap dosen"),
    //         nik: Yup.number().required('Masukkan NIK dosen'),
    //         email: Yup.string().email('Alamat email tidak valid').required('Masukkan email dosen'),
    //         whatsapp: Yup.string().required('Masukkan nomor whatsapp dosen').matches(whatsappRegex, 'Nomor tidak valid'),
    //     }),
    //     onSubmit: async (values) => {

    //         if (isEdit) {
    //             // edit dosen
    //             try {
    //                 await updateSingleData.mutate({ accessToken: user?.accessToken, values: values })
    //             } catch (error) {
    //                 throw new Error(error)
    //             }
    //         } else {
    //             // tambah dosen
    //             try {
    //                 await addSingleData.mutate({ accessToken: user?.accessToken, values: values })
    //             } catch (error) {
    //                 throw new Error(error)
    //             }
    //         }

    //         toggleModalTambahList()
    //         validation.resetForm()
    //     }
    // })


    if (status === 'loading') {
        return <div className="text-info">Loading messages</div>
    }

    if (status === 'error') {
        return <div className="text-danger">Error...</div>
    }

    document.title = "Device List | Wabot - Whatsapp Gateway Multiuser";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Device List" pageTitle="Device List" />

                    <DeleteModal
                        show={deleteModal}
                        // onDeleteClick={handleDeleteOrder}
                        onCloseClick={() => setDeleteModal(false)}
                    />

                    <Card>
                        <CardHeader className='card-header border-0'>
                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <div className="flex-shrink-0">
                                    <button
                                        type='button'
                                        className='btn btn-success'
                                        onClick={() => {
                                            setIsEdit(false)
                                            toggleModalTambahList()
                                            setDataRow()
                                        }}>
                                        <i className='ri-add-line align-bottom me-1'></i> Add Message
                                    </button>
                                    <button type='button' className='btn btn-soft-danger'>
                                        <i className='ri-delete-bin-2-line align-bottom me-1'></i>
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        {/* <CardBody className='border border-dashed border-end-0 border-start-0'> */}
                        <CardBody className='pt-0'>
                            <div>
                                <Nav
                                    className="nav-tabs nav-tabs-custom nav-success"
                                    role="tablist"
                                >
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "1" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("1", "all", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                                            All Messages
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "2" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("2", "2", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Sent{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {messages.filter(data => data.status === "2").length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "3" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("3", "1", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Pending{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {messages.filter(data => data.status === "1").length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "4" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("4", "true", "priority");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Priority{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {messages.filter(data => data.priority === true).length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TableContainer
                                    columns={columns}
                                    data={(listMessages || [])}
                                    isGlobalFilter={false}
                                    customPageSize={30}
                                    divClass="table-responsive table-card mb-1"
                                    tableClass="align-middle table-nowrap"
                                    theadClass="table-light text-muted"
                                    // handlePermohonanClick={handlePermohonanClicks}
                                    isPermohonanFilter={false}
                                />
                            </div>
                            {/* modal import xls */}

                            {/* modal tambah list (single add) */}
                            <Modal
                                id='tambahList'
                                isOpen={modalTambahList}
                                toggle={toggleModalTambahList}
                                size={'lg'}
                                centered>
                                <ModalHeader className='bg-light p-3' toggle={toggleModalTambahList}>{isEdit ? "Edit Device" : "Add New Device"}</ModalHeader>
                                <ModalBody>
                                    <Card className='mb-0'>
                                        <CardBody className='mb-0'>
                                            <Form
                                                id="theForm"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}>
                                                <input type="hidden" id="id-field" />
                                                <Row className="mb-3">
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="deviceId" className="form-label">
                                                            Device Name
                                                        </Label>

                                                        <Input
                                                            name="deviceId"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.deviceId || ""
                                                            }
                                                        >
                                                            <option value='' disabled>Choose Device</option>
                                                            {(user?.devices || []).map((device, id) => (
                                                                <option value={device._id} key={id}>{device.deviceName} - {device.number}</option>
                                                            ))}
                                                        </Input>
                                                        {validation.touched.deviceId &&
                                                            validation.errors.deviceId ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.deviceId}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="to" className="form-label">
                                                            Target Number
                                                        </Label>
                                                        <Input
                                                            name="to"
                                                            id="to"
                                                            className="form-control"
                                                            placeholder="Input Whatsapp Number"
                                                            type="number"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.to || ""}
                                                            invalid={
                                                                validation.touched.to && validation.errors.to ? true : false
                                                            }
                                                        />
                                                        {validation.touched.to && validation.errors.to ? (
                                                            <FormFeedback type="invalid">{validation.errors.to}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="priority" className="form-label">
                                                            Priority
                                                        </Label>

                                                        <Input
                                                            name="priority"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.priority || ""
                                                            }
                                                        >
                                                            <option value='' disabled>Select Priority</option>
                                                            <option value={true}>Yes</option>
                                                            <option value={false}>No</option>
                                                            

                                                        </Input>
                                                        {validation.touched.priority &&
                                                            validation.errors.priority ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.priority}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="isGroup" className="form-label">
                                                            Send to group
                                                        </Label>

                                                        <Input
                                                            name="isGroup"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.isGroup || ""
                                                            }
                                                        >
                                                            <option value='' disabled>Send to Group</option>
                                                            <option value={true}>Yes</option>
                                                            <option value={false}>No</option>
                                                            

                                                        </Input>
                                                        {validation.touched.isGroup &&
                                                            validation.errors.isGroup ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.isGroup}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="retry" className="form-label">
                                                            Retry on failed
                                                        </Label>

                                                        <Input
                                                            name="retry"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.retry || ""
                                                            }
                                                        >
                                                            <option value='' disabled>Select Retry</option>
                                                            <option value={true}>Yes</option>
                                                            <option value={false}>No</option>
                                                            

                                                        </Input>
                                                        {validation.touched.retry &&
                                                            validation.errors.retry ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.retry}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3 pb-2">
                                                            <Label htmlFor="message" className="form-label">Message <span className="text-danger">*</span></Label>
                                                            <textarea
                                                                name="message"
                                                                rows={2}
                                                                placeholder="Enter Message"
                                                                className="form-control"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.message || ""}
                                                            />
                                                            {validation.touched.message && validation.errors.message ? (
                                                                <FormFeedback type="invalid"><div>{validation.errors.message}</div></FormFeedback>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </ModalBody>
                                <ModalFooter>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-success" type='submit' onClick={validation.handleSubmit}>{isEdit ? "Update Device" : "Add Device"}</button>
                                    </div>
                                </ModalFooter>
                            </Modal>
                        </CardBody>
                    </Card>
                </Container>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
};

export default Message;
