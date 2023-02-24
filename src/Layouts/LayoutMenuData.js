import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const Navdata = () => {
    // const [isDashboard, setIsDashboard] = useState(false);
    const [isDevice, setIsDevice] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
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
        // console.log(iscurrentState)
        document.body.classList.remove('twocolumn-panel');
        // if (iscurrentState !== 'Dashboard') {
        //     setIsDashboard(false);
        // }
        if (iscurrentState !== 'Device') {
            setIsDevice(false);
        }
        if (iscurrentState !== 'Message') {
            setIsMessage(false);
        }
        if (iscurrentState !== 'Manual') {
            setIsManual(false);
        }
    }, [
        // history,
        iscurrentState,
        // isDashboard,
        isDevice,
        isMessage,
        isManual
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "device",
            label: "Device",
            icon: "ri-whatsapp-line",
            link: "/device",
            click: function (e) {
                e.preventDefault();
                setIsDevice(!isDevice);
                setIscurrentState('Device');
                updateIconSidebar(e);
            },
            stateVariables: isDevice
        },
        {
            id: "message",
            label: "Message",
            icon: "ri-mail-send-line",
            link: "/message",
            click: function (e) {
                e.preventDefault();
                setIsMessage(!isMessage);
                setIscurrentState('Message');
                updateIconSidebar(e);
            },
            stateVariables: isMessage
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;