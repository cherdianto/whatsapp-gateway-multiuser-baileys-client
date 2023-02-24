import React, { useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

//import images
// import avatar2 from "../../assets/images/users/avatar-2.jpg";
// import avatar8 from "../../assets/images/users/avatar-8.jpg";
// import avatar3 from "../../assets/images/users/avatar-3.jpg";
// import avatar6 from "../../assets/images/users/avatar-6.jpg";
import bell from "../../assets/images/svg/bell.svg";

//SimpleBar
import SimpleBar from "simplebar-react";

const NotificationDropdown = () => {
    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i className='bx bx-bell fs-22'></i>
                    <span
                        className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">3<span
                            className="visually-hidden">unread messages</span></span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                </Col>
                                <div className="col-auto dropdown-tabs">
                                    <span className="badge badge-soft-light fs-13"> 4 New</span>
                                </div>
                            </Row>
                        </div>

                        <div className="px-2 pt-2 bg-white">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                <div className="text-reset notification-item d-block dropdown-item">
                                    <div className="flex-1">
                                        <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">James Lemire</h6></Link>
                                        <div className="fs-13 text-muted">
                                            <p className="mb-1">We talked about a project on linkedin.</p>
                                        </div>
                                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                            <span><i className="mdi mdi-clock-outline"></i> 30 min ago</span>
                                        </p>
                                    </div>
                                </div>
                            </SimpleBar>
                        </div>

                    </div>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default NotificationDropdown;