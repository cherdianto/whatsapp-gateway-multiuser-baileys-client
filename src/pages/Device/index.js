import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Container, FormFeedback, Nav, NavItem, NavLink } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/user.context";
import DeleteModal from "../../Components/Common/DeleteModal";
import * as XLSX from 'xlsx'
import { Link } from 'react-router-dom'
import { Card, CardBody, Alert, CardHeader, Modal, ModalBody, ModalHeader, Input, ModalFooter, Form, Row, Col, Label, CardFooter } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import classnames from "classnames";
import { getDatas, addData, deleteData, updateData, logout } from "../../apiQuery/device.query";
import QRCode from "qrcode";
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD


const DeviceList = () => {
    const { user, setUser } = useUser()
    const queryClient = useQueryClient()
    const { status, data } = useQuery(['device'], () => getDatas(user?.accessToken))

    const [modalImportXls, setModalImportXls] = useState(false)
    const [modalTambahList, setModalTambahList] = useState(false)
    const [modalScan, setModalScan] = useState(false)
    const [importDosenTemp, setImportDosenTemp] = useState([])
    // const [listDataDosen, setListDataDosen] = useState(data)
    const [dataRow, setDataRow] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [isScan, setIsScan] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [checkboxState, setCheckboxState] = useState([])
    const [modal, setModal] = useState(false);
    const [date, setDate] = useState('');
    const [activeTab, setActiveTab] = useState("1");
    const [listDevices, setListDevices] = useState(data);
    const [qrData, setQrData] = useState('');
    const [scanUrl, setScanUrl] = useState('');

    const canvasRef = useRef();
    const devices = data || []

    const memoHook = useMemo;
    const callbackHook = useCallback;

    // let scanUrl = ''

    const addSingleData = useMutation(addData, {
        onSuccess: () => {
            queryClient.invalidateQueries('device')
        }
    })

    // const addBulkDosen = useMutation(postBulk, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries('device')
    //     }
    // })

    const deleteSingleData = useMutation(deleteData, {
        onSuccess: () => {
            queryClient.invalidateQueries('device')
        }
    })

    const updateSingleData = useMutation(updateData, {
        onSuccess: () => {
            queryClient.invalidateQueries('device')
        }
    })

    const logoutDevice = useMutation(logout, {
        onSuccess: () => {
            queryClient.invalidateQueries('device')
        }
    })

    // QR CODE DATA GETTER 
    // useEffect(() => {
    //     // QRCode.toCanvas(
    //     //     canvasRef.current,
    //     //     qrData || ' ', (error) => error && console.log(error)
    //     // )
    // }, [qrData])


    // UPDATE DATA DEVICE FROM REACT-QUERY
    useEffect(() => {
        if (data) {
            // console.log(data)
            setListDevices(data)
        }
    }, [data])

    // ERROR NOTIFIER
    useEffect(() => {
        // if(addBulkDosen.isError){
        //     addBulkDosen.reset()
        //     toast('ADD BULK ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        // }

        if (addSingleData.isError) {
            addSingleData.reset()
            toast('ADD SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if (updateSingleData.isError) {
            updateSingleData.reset()
            toast('UPDATE DATA ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if (deleteSingleData.isError) {
            deleteSingleData.reset()
            toast('DELETE SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

    }, [addSingleData, deleteSingleData, updateSingleData])

    // SUCCESS NOTIFIER
    useEffect(() => {
        // if(addBulkDosen.isSuccess){
        //     addBulkDosen.reset()
        //     toast('ADD BULK SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        // }

        if (addSingleData.isSuccess) {
            addSingleData.reset()
            toast('ADD SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if (updateSingleData.isSuccess) {
            updateSingleData.reset()
            toast('UPDATE DATA SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if (deleteSingleData.isSuccess) {
            deleteSingleData.reset()
            toast('DELETE SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

    }, [addSingleData, deleteSingleData, updateSingleData])

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            id: (dataRow && dataRow._id) || '',
            userId: (dataRow && dataRow.userId) || '',
            connectionStatus: (dataRow && dataRow.connectionStatus) || '',
            cronIdle: (dataRow && dataRow.cronIdle) || '',
            deviceName: (dataRow && dataRow.deviceName) || '',
            number: (dataRow && dataRow.number) || '',
            status: (dataRow && dataRow.status) || '',
            apiKey: (dataRow && dataRow.apiKey) || '',

        },
        // validationSchema: Yup.object({
        //   refId: Yup.string().required("Please Enter device Id"),
        //   nama: Yup.string().required("Please Enter nama Name"),
        //   nim: Yup.string().required("Please Enter Total nim"),
        //   status: Yup.string().required("Please Enter Delivery Status")
        // }),
        onSubmit: async (values) => {
            const newValues = {
                deviceName: values.deviceName,
                number: values.number,
                id: values.id,
                status: values.status
            }
            if (isEdit) {
                // edit dosen
                try {
                    await updateSingleData.mutate({ accessToken: user?.accessToken, values: newValues })
                } catch (error) {
                    // console.log(error)
                    throw new Error(error)
                }
            } else {
                // tambah dosen
                try {
                    await addSingleData.mutate({ accessToken: user?.accessToken, values: newValues })
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
            connectionStatus,
            cronIdle,
            deviceName,
            number,
            status,
            userId
        } = device

        setUser({
            id,
            connectionStatus,
            cronIdle,
            deviceName,
            number,
            status,
            userId
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
                accessor: "deviceName",
                filterable: true,
                id: "deviceName"
            },
            {
                Header: "Phone Number",
                accessor: "number",
                id: "number",
                filterable: true
            },
            {
                Header: "Status",
                accessor: "status",
                id: "status",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case 'active':
                            return <span className="badge text-uppercase bg-success"> Active </span>;
                        case 'inactive':
                            return <span className="badge text-uppercase bg-warning"> Inactive </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Cron Idle",
                accessor: "cronIdle",
                id: "cronIdle",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case true:
                            return <span className="badge text-uppercase bg-success"> Idle </span>;
                        case false:
                            return <span className="badge text-uppercase bg-warning"> Queu </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Connection Status",
                accessor: "connectionStatus",
                id: "connectionStatus",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case 'connected':
                            return <span className="badge text-uppercase bg-success"> Connected </span>;
                        case 'disconnected':
                            return <span className="badge text-uppercase bg-warning"> Disconnected </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    // console.log(cellProps)
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            {/* { cellProps.row.original.status[0].progres === 'Approved' && ( */}
                            <li className="list-inline-item">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => {
                                        const dataUser = cellProps.row.original;
                                        // console.log(dataUser)
                                        setDataRow(dataUser)
                                        // handleEditClick();
                                        if (cellProps.row.original?.status === 'inactive') {
                                            console.log('device is inactive')
                                        } else if (cellProps.row.original?.connectionStatus === 'connected') {
                                            handleLogoutDevice({ apiKey: dataUser.apiKey });
                                        } else {
                                            handleScanQrCode({ apiKey: dataUser.apiKey });
                                        }

                                    }}

                                >
                                    {cellProps.row.original?.connectionStatus === 'connected' ? (<i className="ri-close-circle-fill fs-16"></i>) : (<i className="ri-qr-code-line fs-16"></i>)}
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
                                    <i className="ri-settings-2-line fs-16"></i>
                                </Link>
                            </li>
                            {/* <li className="list-inline-item">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => {
                                        const dataUser = cellProps.row.original;
                                        console.log(dataUser)
                                        setDataRow(dataUser)
                                        // handleDeleteClick();
                                    }}
                                >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </li> */}
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

    const toggleModalScan = callbackHook(() => {
        if (modalScan) {
            setModalScan(false)
        } else {
            setModalScan(true)
        }
    })
    const handleScanQrCode = async ({ apiKey }) => {
        // setScanUrl(`${apiBaseUrl}/sessions/add?key=${apiKey}`)
        const response = await axios.get(`${apiBaseUrl}/sessions/add?key=${apiKey}`)
        // console.log(response.data.data.qr)
        setQrData(response.data.data.qr)
        setIsScan(true)
        toggleModalScan()
    }

    const handleLogoutDevice = async ({ apiKey }) => {
        // console.log(dataRow.apiKey)
        try {
            await logoutDevice.mutate(apiKey)
        } catch (error) {
            console.log(error)
        }
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
        // console.log(devices)
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filteredOrders = devices;
            if (type !== "all" && field === "connectionStatus") {
                filteredOrders = devices.filter((data) => data.connectionStatus === type);
            } else if (type !== "all" && field === "status") {
                filteredOrders = devices.filter((data) => data.status === type);
            }
            setListDevices(filteredOrders);
        }
        // console.log(listDevices)
    };

    const handleDeleteOrder = async () => {
        // console.log(dataRow._id)
        if (dataRow._id) {
            try {
                await deleteSingleData.mutate({ accessToken: user?.accessToken, id: dataRow._id })
            } catch (error) {
                throw new Error(error)
            }
            setDeleteModal(false)
        }
    }

    const handleDeleteRow = async () => {
        // console.log(dataRow._id)
        if (dataRow._id) {
            try {
                await deleteSingleData.mutate({ accessToken: user?.accessToken, id: dataRow._id })
            } catch (error) {
                throw new Error(error)
            }
            setDeleteModal(false)
        }
    }

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
                        onDeleteClick={handleDeleteOrder}
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
                                            toggleModalTambahList()
                                            setIsEdit(false)
                                            setDataRow()
                                        }}>
                                        <i className='ri-add-line align-bottom me-1'></i> Add Device
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
                                                toggleTab("1", "all", "connectionStatus");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                                            All Devices
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "2" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("2", "connected", "connectionStatus");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Connected{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {devices.filter(data => data.connectionStatus === "connected").length}
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
                                                toggleTab("3", "disconnected", "connectionStatus");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Disconnected{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {devices.filter(data => data.connectionStatus === "disconnected").length}
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
                                                toggleTab("4", true, "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Active{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {devices.filter(data => data.status === 'active').length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "5" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("5", false, "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Inactive{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {devices.filter(data => data.status === 'inactive').length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TableContainer
                                    columns={columns}
                                    data={(listDevices || [])}
                                    isGlobalFilter={false}
                                    customPageSize={30}
                                    divClass="table-responsive table-card mb-1"
                                    tableClass="align-middle table-nowrap"
                                    theadClass="table-light text-muted"
                                    // handlePermohonanClick={handlePermohonanClicks}
                                    isPermohonanFilter={false}
                                />
                            </div>
                            {/* MODAL SCAN QRCODE */}
                            <Modal
                                id="scanQrcode"
                                isOpen={modalScan}
                                toggle={toggleModalScan}
                                size={'md'}
                                centered
                            >
                                <ModalHeader className="bg-light p-3" toggle={toggleModalScan}>Scan QR Code</ModalHeader>
                                <ModalBody className="d-flex align-items-center justify-content-center">
                                    {/* <> */}
                                        {/* <canvas ref={canvasRef} /> */}
                                        {/* <iframe src={scanUrl} width='100%' height={500}></iframe> */}
                                        <img src={qrData} alt='qr code'/>
                                    {/* </> */}
                                </ModalBody>

                            </Modal>

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
                                                <Row>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="deviceName" className="form-label">
                                                            Device Name
                                                        </Label>
                                                        <Input
                                                            name="deviceName"
                                                            id="deviceName"
                                                            className="form-control"
                                                            placeholder="Add Device Name"
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.deviceName || ""}
                                                            invalid={
                                                                validation.touched.deviceName && validation.errors.deviceName ? true : false
                                                            }
                                                        />
                                                        {validation.touched.deviceName && validation.errors.deviceName ? (
                                                            <FormFeedback type="invalid">{validation.errors.deviceName}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="number" className="form-label">
                                                            Whatsapp Number
                                                        </Label>
                                                        <Input
                                                            name="number"
                                                            id="number"
                                                            className="form-control"
                                                            placeholder="Input Whatsapp Number"
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.number || ""}
                                                            invalid={
                                                                validation.touched.number && validation.errors.number ? true : false
                                                            }
                                                        />
                                                        {validation.touched.number && validation.errors.number ? (
                                                            <FormFeedback type="invalid">{validation.errors.number}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={12} className="mb-3">
                                                        <Label htmlFor="apiKey" className="form-label">
                                                            API Key
                                                        </Label>
                                                        <Input
                                                            name="apiKey"
                                                            id="apiKey"
                                                            className="form-control"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.apiKey || ""}
                                                            disabled
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="connectionStatus" className="form-label">
                                                            Connection Status
                                                        </Label>
                                                        <Input
                                                            name="connectionStatus"
                                                            id="connectionStatus"
                                                            className="form-control"
                                                            // placeholder="Input Whatsapp connectionStatus"
                                                            type="text"
                                                            // onChange={validation.handleChange}
                                                            // onBlur={validation.handleBlur}
                                                            value={validation.values.connectionStatus.toUpperCase()}
                                                            disabled
                                                        />
                                                    </Col>
                                                </Row>
                                                { user?.role === 'Superadmin' && (

                                                    <Row>
                                                        <Col lg={6} className="mb-3">
                                                            <Label htmlFor="status-dev" className="form-label">
                                                                Subscription Status
                                                            </Label>
                                                            <Input
                                                                name="status"
                                                                id="status-dev"
                                                                className="form-control"
                                                                type="select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.status || ""}
                                                            >
                                                                <option value='active'>Active</option>
                                                                <option value='inactive'>Inactive</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                )}
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

export default DeviceList;
