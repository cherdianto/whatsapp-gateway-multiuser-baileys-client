import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, postAdd, postBulk, deleteData, updateData } from "../../../../apiQuery/laboran.query";
import { useUser } from "../../../../context/user.context";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import * as XLSX from 'xlsx'
import { Link } from 'react-router-dom'
import { Card, CardBody, Alert, CardHeader, Modal, ModalBody, ModalHeader, Input, ModalFooter, Form, Row, Col, Label, CardFooter } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup'

const Laboran = () => {
    const { user, setUser } = useUser()
    const queryClient = useQueryClient()
    const { status, data } = useQuery(['laboran'], () => getAll(user?.accessToken))

    const [modalImportXls, setModalImportXls] = useState(false)
    const [modalTambahList, setModalTambahList] = useState(false)
    const [importDosenTemp, setImportDosenTemp] = useState([])
    const [listDataDosen, setListDataDosen] = useState(data)
    const [dataRow, setDataRow] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const memoHook = useMemo;
    const callbackHook = useCallback;

    const addSingleDosen = useMutation(postAdd, {
        onSuccess: () => {
            queryClient.invalidateQueries('laboran')
        }
    })

    const addBulkDosen = useMutation(postBulk, {
        onSuccess: () => {
            queryClient.invalidateQueries('laboran')
        }
    })

    const deleteSingleDosen = useMutation(deleteData, {
        onSuccess: () => {
            queryClient.invalidateQueries('laboran')
        }
    })

    const updateDosen = useMutation(updateData, {
        onSuccess: () => {
            queryClient.invalidateQueries('laboran')
        }
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setListDataDosen(data)
        }
    }, [data])

    useEffect(() => {
        if(addBulkDosen.isError){
            addBulkDosen.reset()
            toast('ADD BULK ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if(addSingleDosen.isError){
            addSingleDosen.reset()
            toast('ADD SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if(updateDosen.isError){
            updateDosen.reset()
            toast('UPDATE DOSEN ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

        if(deleteSingleDosen.isError){
            deleteSingleDosen.reset()
            toast('DELETE SINGLE ERROR', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-danger text-white' })
        }

    }, [addBulkDosen, addSingleDosen, deleteSingleDosen, updateDosen])

    useEffect(() => {
        if(addBulkDosen.isSuccess){
            addBulkDosen.reset()
            toast('ADD BULK SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if(addSingleDosen.isSuccess){
            addSingleDosen.reset()
            toast('ADD SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if(updateDosen.isSuccess){
            updateDosen.reset()
            toast('UPDATE DOSEN SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

        if(deleteSingleDosen.isSuccess){
            deleteSingleDosen.reset()
            toast('DELETE SINGLE SUCCESS', { position: "top-right", hideProgressBar: false, closeOnClick: false, className: 'bg-success text-white' })
        }

    }, [addBulkDosen, addSingleDosen, deleteSingleDosen, updateDosen])


    const columns = memoHook(
        () => [
            // {
            //     Header: <input
            //         type="checkbox"
            //         id="checkBoxAllPermohonan"
            //     // onClick={() => checkedAll()} 
            //     />,
            //     Cell: (cellProps) => {
            //         return <input type="checkbox" className="permohonanCheckBox" value={cellProps.row.original._id} />;
            //     },
            //     id: '#',
            // },
            {
                Header: "Nama Laboran",
                accessor: "nama",
                filterable: true,
                Cell: (cell) => {
                    return <>
                        {cell.value}
                    </>
                },
            },
            {
                Header: "NIK",
                accessor: "nik",
                filterable: true,
                Cell: (cell) => {
                    return <>
                        {cell.value}
                    </>
                },
            },
            {
                Header: "Email",
                accessor: "email",
                filterable: true,
                Cell: (cell) => {
                    return <>
                        {cell.value}
                    </>
                },
            },
            {
                Header: "Whatsapp",
                accessor: "whatsapp",
                filterable: true,
                Cell: (cell) => {
                    return <>
                        {cell.value}
                    </>
                },
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => {
                                        const dataToEdit = cellProps.row.original;
                                        setDataRow(dataToEdit)
                                        handleEditClick()
                                        // handlePermohonanClick(dataPermohonan);
                                    }}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item edit">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block delete-item-btn"
                                    onClick={() => {
                                        const dataToEdit = cellProps.row.original;
                                        // console.log(dataToEdit)
                                        setDataRow(dataToEdit)
                                        handleDeleteClick()
                                        // handlePermohonanClick(dataPermohonan);
                                    }}
                                >
                                    <i className="ri-delete-bin-2-line fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
        ],
        // [handlePermohonanClick]
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
        try {
            await addBulkDosen.mutate({ accessToken: user?.accessToken, bulkData: importDosenTemp  })
        } catch (error) {
            throw new Error(error)
        }
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

    const handleDeleteRow = async () => {
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

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            nama: (dataRow && dataRow.nama) || "",
            nik: (dataRow && dataRow.nik) || "",
            email: (dataRow && dataRow.email) || "",
            whatsapp: (dataRow && dataRow.whatsapp) || "",
            id: (dataRow && dataRow._id) || "",
        },
        validationSchema: Yup.object({
            nama: Yup.string().required("Masukkan nama lengkap dosen"),
            nik: Yup.number().required('Masukkan NIK dosen'),
            email: Yup.string().email('Alamat email tidak valid').required('Masukkan email dosen'),
            whatsapp: Yup.string().required('Masukkan nomor whatsapp dosen').matches(whatsappRegex, 'Nomor tidak valid'),
        }),
        onSubmit: async (values) => {

            if (isEdit) {
                // edit dosen
                try {
                    await updateDosen.mutate({ accessToken: user?.accessToken, values: values })
                } catch (error) {
                    throw new Error(error)
                }
            } else {
                // tambah dosen
                try {
                    await addSingleDosen.mutate({ accessToken: user?.accessToken, values: values })
                } catch (error) {
                    throw new Error(error)
                }
            }

            toggleModalTambahList()
            validation.resetForm()
        }
    })


    if (status === 'loading') {
        return <div className="text-info">Loading messages</div>
    }

    if (status === 'error') {
        return <div className="text-danger">Error...</div>
    }

    document.title = "Laboran | Velzon - React Admin & Dosen Pembimbing Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Laboran" pageTitle="Laboran" />

                    <DeleteModal
                        show={deleteModal}
                        onDeleteClick={handleDeleteRow}
                        onCloseClick={() => setDeleteModal(false)}
                    />

                    <Card>
                        <CardHeader className='card-header border-0'>
                            <div className="d-flex align-items-center">
                                <div className="mb-0 flex-grow-1">
                                    <button
                                        type='button'
                                        className='btn btn-warning'
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
                            <TableContainer
                                columns={columns}
                                data={(listDataDosen || [])}
                                isGlobalFilter={false}
                                customPageSize={30}
                                divClass="table-responsive table-card mb-1"
                                tableClass="align-middle table-nowrap"
                                theadClass="table-light text-muted"
                                // handlePermohonanClick={handlePermohonanClicks}
                                isPermohonanFilter={false}
                            />
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
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    validation.handleSubmit()
                                                    return false
                                                }}
                                                className="needs-validation" action='#'>

                                                <Row>
                                                    <Col lg={12} className="mb-3">
                                                        <Label htmlFor='nama' className='form-label'>Nama Lengkap</Label>
                                                        <Input
                                                            id='nama'
                                                            name='nama'
                                                            type='text'
                                                            className='form-control'
                                                            placeholder='Masukkan nama lengkap'
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.nama || ''}
                                                            invalid={
                                                                validation.touched.nama && validation.errors.nama ? true : false
                                                            } />
                                                    </Col>
                                                    <Col lg={12} className="mb-3">
                                                        <Label htmlFor='nik' className='form-label'>NIK </Label>
                                                        <Input
                                                            id='nik'
                                                            name='nik'
                                                            type='text'
                                                            className='form-control'
                                                            placeholder='Masukkan nik lengkap'
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.nik || ''}
                                                            invalid={
                                                                validation.touched.nik && validation.errors.nik ? true : false
                                                            } />
                                                    </Col>
                                                    <Col lg={12} className="mb-3">
                                                        <Label htmlFor='email' className='form-label'>Email</Label>
                                                        <Input
                                                            id='email'
                                                            name='email'
                                                            type='text'
                                                            className='form-control'
                                                            placeholder='Masukkan email lengkap'
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.email || ''}
                                                            invalid={
                                                                validation.touched.email && validation.errors.email ? true : false
                                                            } />
                                                    </Col>
                                                    <Col lg={12}>
                                                        <Label htmlFor='whatsapp' className='form-label'>Whatsapp</Label>
                                                        <Input
                                                            id='whatsapp'
                                                            name='whatsapp'
                                                            type='text'
                                                            className='form-control'
                                                            placeholder='Masukkan whatsapp lengkap'
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.whatsapp || ''}
                                                            invalid={
                                                                validation.touched.whatsapp && validation.errors.whatsapp ? true : false
                                                            } />
                                                    </Col>
                                                </Row>
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

export default Laboran;
