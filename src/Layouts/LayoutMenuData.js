import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
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
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Manual') {
            setIsManual(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isBaseUi,
        isAdvanceUi,
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
            id: "setting",
            label: "Setting",
            icon: "ri-account-circle-line",
            link: "/setting",
            stateVariables: isSetting,
            click: function (e) {
                e.preventDefault();
                setIsSetting(!isSetting);
                setIscurrentState('Setting');
                updateIconSidebar(e);
            },
        },
        {
            label: "Superadmin Areas",
            isHeader: true,
        },
        // {
        //     id: "baseUi",
        //     label: "Base UI",
        //     icon: "ri-pencil-ruler-2-line",
        //     link: "/#",
        //     stateVariables: isBaseUi,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsBaseUi(!isBaseUi);
        //         setIscurrentState('BaseUi');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "advanceUi",
        //     label: "Advance UI",
        //     icon: "ri-stack-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsAdvanceUi(!isAdvanceUi);
        //         setIscurrentState('AdvanceUi');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isAdvanceUi,
        //     subItems: [
        //         { id: "nestablelist", label: "Nestable List", link: "#", parentId: "advanceUi" },
        //         { id: "scrollbar", label: "Scrollbar", link: "#", parentId: "advanceUi" },
        //     ],
        // },
        {
            id: "usermanual",
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