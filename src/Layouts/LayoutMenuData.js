import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const Navdata = () => {
    // const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [isFormOption, setIsFormOption] = useState(false);
    const [isDosenPembimbing, setIsDosenPembimbing] = useState(false);
    const [isLaboran, setIsLaboran] = useState(false);
    const [isAlurApproval, setIsAlurApproval] = useState(false);
    const [isNotifikasi, setIsNotifikasi] = useState(false);
    const [isKepalaLab, setIsKepalaLab] = useState(false);
    const [isManual, setIsManual] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        console.log(iscurrentState)
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Setting') {
            setIsSetting(false);
        }
        if (iscurrentState !== 'FormOption') {
            setIsFormOption(false);
        }
        if (iscurrentState !== 'DosenPembimbing') {
            setIsDosenPembimbing(false);
        }
        if (iscurrentState !== 'Laboran') {
            setIsLaboran(false);
        }
        if (iscurrentState !== 'Notifikasi') {
            setIsNotifikasi(false);
        }
        if (iscurrentState !== 'AlurApproval') {
            setIsAlurApproval(false);
        }
        if (iscurrentState !== 'Manual') {
            setIsManual(false);
        }
    }, [
        // history,
        iscurrentState,
        isDashboard,
        isApps,
        isDosenPembimbing,
        isLaboran,
        isNotifikasi,
        isAlurApproval,
        isManual
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/dashboard",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            }
        },
        {
            id: "apps",
            label: "Apps",
            icon: "ri-apps-2-line",
            link: "/app",
            stateVariables: isApps,
            click: function (e) {
                e.preventDefault();
                setIsApps(!isApps);
                setIscurrentState('Apps');
                updateIconSidebar(e);
            }
        },
        {
            label: "Superadmin Areas",
            isHeader: true,
        },
        {
            id: "setting",
            label: "Setting",
            icon: "ri-share-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSetting(!isSetting);
                setIscurrentState('Setting');
                updateIconSidebar(e);
            },
            stateVariables: isSetting,
            subItems: [
                { id: "notifikasi", label: "Notifikasi", link: "/notifikasi", parentId: 'formOption' },
                { id: "alurApproval", label: "Alur Approval", link: "/alur-approval", parentId: 'formOption'},
                {
                    id: "formOption",
                    label: "Form Option",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsFormOption(!isFormOption);
                        // setIscurrentState('Form Option');
                    },
                    stateVariables: isFormOption,
                    parentId: "setting",
                    childItems: [
                        { 
                            id: 1, 
                            label: "Dosen Pembimbing", 
                            link: "/dosen-pembimbing",
                            click: function (e) {
                                e.preventDefault();
                                setIsDosenPembimbing(!isDosenPembimbing);
                            }
                        },
                        { 
                            id: 2, 
                            label: "Kepala Lab", 
                            link: "/kepala-lab",
                            click: function (e) {
                                e.preventDefault();
                                setIsKepalaLab(!isKepalaLab);
                            }},
                        { id: 3, label: "Laboran", link: "/laboran"},
                    ]
                },
            ],
        },
        {
            id: "manual",
            label: "Manual",
            icon: "ri-map-pin-line",
            link: "/manual",
            click: function (e) {
                e.preventDefault();
                setIsManual(!isManual);
                setIscurrentState('Manual');
                updateIconSidebar(e);
            },
            stateVariables: isManual,
        },
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;