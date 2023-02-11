import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, FormFeedback, Nav, NavItem, NavLink } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, postAdd, deleteData, updateData } from "../../apiQuery/user.query";
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

const listStatusUser = [
    {
        options: [
            // { label: "Status", value: "Status" },
            { label: "Aktif", value: "Aktif" },
            { label: "Pending", value: "Pending" },
            { label: "Diblokir", value: "Diblokir" },
        ],
    },
];

const User = () => {
    const { user, setUser } = useUser()
    const queryClient = useQueryClient()
    const { status, data } = useQuery(['user'], () => getAll(user?.accessToken))

    const [modalImportXls, setModalImportXls] = useState(false)
    const [modalTambahList, setModalTambahList] = useState(false)
    const [importDosenTemp, setImportDosenTemp] = useState([])
    // const [listDataDosen, setListDataDosen] = useState(data)
    const [dataRow, setDataRow] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [checkboxState, setCheckboxState] = useState([])
    const [modal, setModal] = useState(false);
    const [date, setDate] = useState('');
    const [activeTab, setActiveTab] = useState("1");
    const [listUser, setListUser] = useState(data);


    const users = data || []

    const memoHook = useMemo;
    const callbackHook = useCallback;

    const addSingleDosen = useMutation(postAdd, {
        onSuccess: () => {
            queryClient.invalidateQueries('user')
        }
    })

    // const addBulkDosen = useMutation(postBulk, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries('user')
    //     }
    // })

    const deleteSingleDosen = useMutation(deleteData, {
        onSuccess: () => {
            queryClient.invalidateQueries('user')
        }
    })

    const updateDosen = useMutation(updateData, {
        onSuccess: () => {
            queryClient.invalidateQueries('user')
        }
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setListUser(data)
        }
    }, [data])

    useEffect(() => {
        // if(addBulkDosen.isError){
        //     addBulkDosen.reset()
        //     toast('ADD BULK ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        // }

        if (addSingleDosen.isError) {
            addSingleDosen.reset()
            toast('ADD SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if (updateDosen.isError) {
            updateDosen.reset()
            toast('UPDATE DOSEN ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if (deleteSingleDosen.isError) {
            deleteSingleDosen.reset()
            toast('DELETE SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

    }, [addSingleDosen, deleteSingleDosen, updateDosen])

    useEffect(() => {
        // if(addBulkDosen.isSuccess){
        //     addBulkDosen.reset()
        //     toast('ADD BULK SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        // }

        if (addSingleDosen.isSuccess) {
            addSingleDosen.reset()
            toast('ADD SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if (updateDosen.isSuccess) {
            updateDosen.reset()
            toast('UPDATE DOSEN SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if (deleteSingleDosen.isSuccess) {
            deleteSingleDosen.reset()
            toast('DELETE SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

    }, [addSingleDosen, deleteSingleDosen, updateDosen])

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            id: (dataRow && dataRow._id) || '',
            nama: (dataRow && dataRow.nama) || '',
            jenisSurat: (dataRow && dataRow.jenisSurat) || '',
            createdAt: (dataRow && dataRow.createdAt) || '',
            nim: (dataRow && dataRow.nim) || '',
            status: (dataRow && dataRow.status) || '',
            jurusan: (dataRow && dataRow.jurusan) || '',
            tempatLahir: (dataRow && dataRow.tempatLahir) || '',
            tanggalLahir: (dataRow && dataRow.tanggalLahir) || '',
            alamat: (dataRow && dataRow.alamat) || '',
            email: (dataRow && dataRow.email) || '',
            email2: (dataRow && dataRow.email2) || '',
            role: (dataRow && dataRow.role) || '',
            sig: (dataRow && dataRow.sig) || '',
            reg: (dataRow && dataRow.reg) || '',
            adminReg: (dataRow && dataRow.adminReg) || '',
            adminSig: (dataRow && dataRow.adminSig) || '',
            adminSurat: (dataRow && dataRow.adminSurat) || '',
            scopeAdminSurat: (dataRow && dataRow.scopeAdminSurat) || []
        },
        // validationSchema: Yup.object({
        //   refId: Yup.string().required("Please Enter user Id"),
        //   nama: Yup.string().required("Please Enter nama Name"),
        //   nim: Yup.string().required("Please Enter Total nim"),
        //   status: Yup.string().required("Please Enter Delivery Status")
        // }),
        onSubmit: async (values) => {
            let newValues = {
                ...values,
                scopeAdminSurat : checkboxState
            }

            if (isEdit) {
                // edit dosen
                try {
                    await updateDosen.mutate({ accessToken: user?.accessToken, values: newValues })
                } catch (error) {
                    console.log(error)
                    throw new Error(error)
                }
            } else {
                // tambah dosen
                try {
                    await addSingleDosen.mutate({ accessToken: user?.accessToken, values: newValues })
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
        const user = arg;
        const {
            id,
            nama,
            nim,
            alamat,
            jurusan,
            tempatLahir,
            role,
            status,
            delegasi,
            createdAt,
            whatsapp,
            email2,
            email,
            accountType,
            tanggalLahir,
            sig,
            reg,
            adminReg,
            adminSig,
            adminSurat,
            scopeAdminSurat
        } = user

        setUser({
            id,
            nama,
            nim,
            jurusan,
            tempatLahir,
            tanggalLahir,
            alamat,
            role,
            sig,
            reg,
            status,
            delegasi,
            createdAt,
            whatsapp,
            email2,
            email,
            accountType,
            adminReg,
            adminSig,
            adminSurat,
            scopeAdminSurat
        });
        setCheckboxState(scopeAdminSurat)
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
                Header: "Nama",
                accessor: "nama",
                filterable: true,
                id: "nama"
            },
            {
                Header: "NIM/NIK",
                accessor: "nim",
                id: "nim",
                filterable: true
            },
            {
                Header: "Email",
                accessor: "email",
                id: "email",
                filterable: true
            },
            {
                Header: "Prodi",
                accessor: "jurusan",
                id: "jurusan",
                filterable: true
            },
            {
                Header: "Role",
                accessor: "role",
                id: "role",
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case 'Regular':
                            return <span className="badge text-uppercase bg-success"> Regular </span>;
                        case 'Admin':
                            return <span className="badge text-uppercase bg-warning"> Admin </span>;
                        case 'Superadmin':
                            return <span className="badge text-uppercase bg-danger"> Superadmin </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> - </span>;
                    }
                }
            },
            {
                Header: "Tandatangan",
                accessor: "sig",
                id: "sig",
                filterable: true,
            },
            {
                Header: "Registrasi",
                accessor: "reg",
                id: "reg",
                filterable: true,
            },
            {
                Header: 'Status',
                accessor: 'status',
                filterable: true,
                Cell: (cell) => {
                    switch (cell.value) {
                        case "Aktif":
                            return <span className="badge text-uppercase bg-success"> {cell.value} </span>;
                        case "Pending":
                            return <span className="badge text-uppercase bg-warning"> {cell.value} </span>;
                        case "Diblokir":
                            return <span className="badge text-uppercase bg-danger"> {cell.value} </span>;
                        default:
                            return <span className="badge text-uppercase bg-info"> {cell.value} </span>;
                    }
                }
            },

            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            {/* { cellProps.row.original.status[0].progres === 'Approved' && ( */}
                            <li className="list-inline-item"></li>
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
                                        console.log(dataUser)
                                        setDataRow(dataUser)
                                        handleDeleteClick();
                                    }}
                                >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
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

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((data) => {
            setImportDosenTemp(data);
        });
    };



    const handleSubmitButton = async () => {
        // dispatch(bulkDataDosen(importDosenTemp))
        // try {
        //     await addBulkDosen.mutate({ accessToken: user?.accessToken, bulkData: importDosenTemp  })
        // } catch (error) {
        //     throw new Error(error)
        // }
        setImportDosenTemp([])
        toggleModalImportXls()
        // return (
        //   <LoadingSpinnerInner />
        // )
        // setListDataDosen(importDosenTemp)
    }

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
        console.log(tab, type, field)
        console.log(users)
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filteredOrders = users;
            if (type !== "all" && field === "role") {
                filteredOrders = users.filter((data) => data.role === type);
            } else if (type !== "all" && field === "status") {
                filteredOrders = users.filter((data) => data.status === type);
            }
            setListUser(filteredOrders);
        }
        console.log(listUser)
    };

    const handleDeleteOrder = async () => {
        console.log(dataRow._id)
        if (dataRow._id) {
            try {
                await deleteSingleDosen.mutate({ accessToken: user?.accessToken, id: dataRow._id })
            } catch (error) {
                throw new Error(error)
            }
            setDeleteModal(false)
        }
    }

    const handleDeleteRow = async () => {
        console.log(dataRow._id)
        if (dataRow._id) {
            try {
                await deleteSingleDosen.mutate({ accessToken: user?.accessToken, id: dataRow._id })
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
    //                 await updateDosen.mutate({ accessToken: user?.accessToken, values: values })
    //             } catch (error) {
    //                 throw new Error(error)
    //             }
    //         } else {
    //             // tambah dosen
    //             try {
    //                 await addSingleDosen.mutate({ accessToken: user?.accessToken, values: values })
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

    document.title = "User | Velzon - React Admin & Dosen Pembimbing Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="User" pageTitle="User" />

                    <DeleteModal
                        show={deleteModal}
                        onDeleteClick={handleDeleteOrder}
                        onCloseClick={() => setDeleteModal(false)}
                    />

                    <Card>
                        <CardHeader className='card-header border-0'>
                            <div className="d-flex align-items-center">
                                <div className="mb-0 flex-grow-1">
                                    <button
                                        type='button'
                                        className='btn btn-danger'
                                        onClick={() => { toggleModalImportXls() }}>
                                        <i className='ri-add-line align-bottom me-1'></i> Import XLS (Replace All)
                                    </button>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        type='button'
                                        className='btn btn-success'
                                        onClick={() => {
                                            toggleModalTambahList()
                                            setIsEdit(false)
                                            setDataRow()
                                        }}>
                                        <i className='ri-add-line align-bottom me-1'></i> Tambah List
                                    </button>
                                    {/* <button type='button' className='btn btn-soft-danger'>
                <i className='ri-delete-bin-2-line align-bottom me-1'></i>
              </button> */}
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
                                                toggleTab("1", "all", "role");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                                            Semua User
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "2" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("2", "Admin", "role");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Admin{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.role === "Admin").length}
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
                                                toggleTab("3", "Superadmin", "role");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Superadmin{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.role === "Superadmin").length}
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
                                                toggleTab("4", "Regular", "role");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Regular{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.role === "Regular").length}
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
                                                toggleTab("5", "Aktif", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Aktif{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.status === "Aktif").length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "6" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("6", "Pending", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Pending{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.status === "Pending").length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames(
                                                { active: activeTab === "7" },
                                                "fw-semibold"
                                            )}
                                            onClick={() => {
                                                toggleTab("7", "Diblokir", "status");
                                            }}
                                            href="#"
                                        >
                                            <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                                            Diblokir{" "}
                                            <span className="badge bg-danger align-middle ms-1">
                                                {users.filter(data => data.status === "Diblokir").length}
                                            </span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TableContainer
                                    columns={columns}
                                    data={(listUser || [])}
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
                            <Modal
                                id='importXls'
                                isOpen={modalImportXls}
                                toggle={toggleModalImportXls}
                                size={'xl'}
                                centered>
                                <ModalHeader className='bg-light p-3' toggle={toggleModalImportXls}>Import XLS (Replace All)</ModalHeader>
                                <ModalBody>
                                    <Card>
                                        <CardBody>
                                            <Input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    readExcel(file)
                                                }}></Input>

                                            {importDosenTemp.length !== 0 && (
                                                <>
                                                    <Alert color='danger' className='my-2'>Perhatian! Anda akan menghapus dan mengganti semua list dosen dengan list di bawah ini. </Alert>
                                                    <TableContainer
                                                        columns={columns}
                                                        data={(importDosenTemp || [])}
                                                        isGlobalFilter={false}
                                                        customPageSize={30}
                                                        divClass="table-responsive table-card my-2"
                                                        tableClass="align-middle table-nowrap"
                                                        theadClass="table-light text-muted"
                                                        // handlePermohonanClick={handlePermohonanClicks}
                                                        isPermohonanFilter={false}
                                                    />
                                                </>
                                            )}
                                        </CardBody>
                                    </Card>
                                </ModalBody>
                                {importDosenTemp.length !== 0 && (
                                    <ModalFooter>
                                        <btn className='btn btn-success btn-md' onClick={handleSubmitButton}>Simpan Data</btn>
                                    </ModalFooter>
                                )}
                            </Modal>

                            {/* modal tambah list (single add) */}
                            <Modal
                                id='tambahList'
                                isOpen={modalTambahList}
                                toggle={toggleModalTambahList}
                                size={'lg'}
                                centered>
                                <ModalHeader className='bg-light p-3' toggle={toggleModalTambahList}>{isEdit ? "Edit Data Dosen" : "Tambah Data Dosen Pembimbing"}</ModalHeader>
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
                                                        <Label htmlFor="nama" className="form-label">
                                                            Nama
                                                        </Label>
                                                        <Input
                                                            name="nama"
                                                            id="nama"
                                                            className="form-control"
                                                            placeholder="Masukkan nama"
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.nama || ""}
                                                            invalid={
                                                                validation.touched.nama && validation.errors.nama ? true : false
                                                            }
                                                        />
                                                        {validation.touched.nama && validation.errors.nama ? (
                                                            <FormFeedback type="invalid">{validation.errors.nama}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="nim" className="form-label">
                                                            NIM/NIK
                                                        </Label>
                                                        <Input
                                                            name="nim"
                                                            id="nim"
                                                            className="form-control"
                                                            placeholder="Masukkan NIM/NIK"
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.nim || ""}
                                                            invalid={
                                                                validation.touched.nim && validation.errors.nim ? true : false
                                                            }
                                                        />
                                                        {validation.touched.nim && validation.errors.nim ? (
                                                            <FormFeedback type="invalid">{validation.errors.nim}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="nim" className="form-label">
                                                            Email
                                                        </Label>
                                                        <Input
                                                            name="email"
                                                            id="email"
                                                            className="form-control"
                                                            placeholder="Masukkan Email UII"
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.email || ""}
                                                            invalid={
                                                                validation.touched.email && validation.errors.email ? true : false
                                                            }
                                                        />
                                                        {validation.touched.email && validation.errors.email ? (
                                                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="jurusan" className="form-label">
                                                            Program Studi
                                                        </Label>
                                                        <Input
                                                            name="jurusan"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.jurusan || ""
                                                            }
                                                        >
                                                            {/* {listJurusan.map((item, index) => (
                                                                <option value={item} key={index}>{item}</option>
                                                            ))} */}
                                                        </Input>
                                                    </Col>
                                                    <Col lg={6} className="mb-3">
                                                        <Label htmlFor="status" className="form-label">
                                                            Status User
                                                        </Label>

                                                        <Input
                                                            name="status"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.status || ""
                                                            }
                                                        >
                                                            <option value='' disabled>Status</option>
                                                            {listStatusUser.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                        {validation.touched.status &&
                                                            validation.errors.status ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.status}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <h4 className="my-3">Role User</h4>
                                                    <Col lg={6}>
                                                        <Label htmlFor="role" className="form-label">
                                                            Role User
                                                        </Label>
                                                        <Input
                                                            name="role"
                                                            type="select"
                                                            className="form-select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={
                                                                validation.values.role || ""
                                                            }
                                                        >
                                                            <option value={''}>Pilih Role</option>
                                                            <option value={'Regular'}>Regular</option>
                                                            <option value={'Admin'}>Admin</option>
                                                            <option value={'Superadmin'}>Superadmin</option>
                                                        </Input>
                                                        {validation.touched.role &&
                                                            validation.errors.role ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.role}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                                {validation.values.role !== 'Regular' && (
                                                    <Row className="mb-3">
                                                        <Col lg={4} className='mb-3'>
                                                            <Label htmlFor="role" className="form-label">
                                                                Admin Registrasi QR
                                                            </Label>
                                                            <Input
                                                                name="adminReg"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={
                                                                    validation.values.adminReg
                                                                }
                                                            >
                                                                <option value={'Tidak'}>Tidak</option>
                                                                <option value={'Ya'}>Ya</option>
                                                            </Input>
                                                            {validation.touched.adminReg &&
                                                                validation.errors.adminReg ? (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.adminReg}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                        <Col lg={4} className='mb-3'>
                                                            <Label htmlFor="role" className="form-label">
                                                                Admin Tandatangan
                                                            </Label>
                                                            <Input
                                                                name="adminSig"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={
                                                                    validation.values.adminSig
                                                                }
                                                            >
                                                                <option value={'Tidak'}>Tidak</option>
                                                                <option value={'Ya'}>Ya</option>
                                                            </Input>
                                                            {validation.touched.adminSig &&
                                                                validation.errors.adminSig ? (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.adminSig}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                        <Col lg={4} className='mb-3'>
                                                            <Label htmlFor="role" className="form-label">
                                                                Admin Permohonan Surat
                                                            </Label>
                                                            <Input
                                                                name="adminSurat"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.adminSurat}
                                                            >
                                                                <option value={'Tidak'}>Tidak</option>
                                                                <option value={'Ya'}>Ya</option>
                                                            </Input>
                                                            {validation.touched.adminSurat &&
                                                                validation.errors.adminSurat ? (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.adminSurat}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                )}
                                                {/* IF USER = ADMIN PERMOHONAN SURAT */}
                                                {validation.values.adminSurat === 'Ya' && (
                                                    <Row>
                                                        <Col lg={4}>
                                                            <div>
                                                                <h6 className="fw-semibold">Pilih Jenis Surat</h6>

                                                                {/* $PENDINGWORK = CHECKBOX TIDAK BISA RERENDER */}
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='AKA' name='aka' value='aka' checked={checkboxState.includes('AKA')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat-surat Akademik
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='NAK' value='nak' checked={checkboxState.includes('NAK')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat-surat Non-akademik
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='LAB' value='lab' checked={checkboxState.includes('LAB')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat Ijin Lembur Lab
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='COV' value='cov' checked={checkboxState.includes('COV')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat Ijin Masuk Lab Terpadu Selama Covid19
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='RUG' value='rug' checked={checkboxState.includes('RUG')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat Pinjam Ruang
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='BRG' value='brg' checked={checkboxState.includes('BRG')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat Pinjam Alat dan Barang
                                                                    </Label>
                                                                </div>
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <Input className="form-check-input" type="checkbox" id='MBL' value='mbl' checked={checkboxState.includes('MBL')} onChange={handleCheckboxChange} />
                                                                    <Label className="form-check-label" htmlFor="formCheck19">
                                                                        Surat Pinjam Mobil
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )}
                                                {validation.values.role !== 'Regular' && (
                                                    <Row className="mt-3">
                                                        <h4 className="my-3">Aktivasi Fitur Surat Digital</h4>
                                                        <Col lg={6}>
                                                            <Label htmlFor="reg" className="form-label">
                                                                Registrasi Surat
                                                            </Label>
                                                            <Input
                                                                name="reg"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={
                                                                    validation.values.reg || ""
                                                                }
                                                            >
                                                                <option value={'Tidak'}>Tidak</option>
                                                                <option value={'Ya'}>Ya</option>
                                                            </Input>
                                                            {validation.touched.reg &&
                                                                validation.errors.reg ? (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.reg}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                        <Col lg={6}>
                                                            <Label htmlFor="sig" className="form-label">
                                                                Tandatangan Surat
                                                            </Label>
                                                            <Input
                                                                name="sig"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={
                                                                    validation.values.sig || ""
                                                                }
                                                            >
                                                                <option value={'Tidak'}>Tidak</option>
                                                                <option value={'Ya'}>Ya</option>
                                                            </Input>
                                                            {validation.touched.sig &&
                                                                validation.errors.sig ? (
                                                                <FormFeedback type="invalid">
                                                                    {validation.errors.sig}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Form>
                                        </CardBody>

                                    </Card>
                                </ModalBody>
                                <ModalFooter>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-success" type='submit' onClick={validation.handleSubmit}>{isEdit ? "Update Data" : "Tambah"}</button>
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

export default User;
