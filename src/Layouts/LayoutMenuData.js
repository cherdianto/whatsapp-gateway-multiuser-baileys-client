import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
    const history = useHistory();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);

    // Apps
    const [isEmail, setEmail] = useState(false);
    const [isSubEmail, setSubEmail] = useState(false);
    const [isEcommerce, setIsEcommerce] = useState(false);
    const [isProjects, setIsProjects] = useState(false);
    const [isTasks, setIsTasks] = useState(false);
    const [isCRM, setIsCRM] = useState(false);
    const [isCrypto, setIsCrypto] = useState(false);
    const [isInvoices, setIsInvoices] = useState(false);
    const [isSupportTickets, setIsSupportTickets] = useState(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);


    // Authentication
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState(false);
    const [isLockScreen, setIsLockScreen] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [isVerification, setIsVerification] = useState(false);
    const [isError, setIsError] = useState(false);

    // Pages
    const [isProfile, setIsProfile] = useState(false);
    const [isLanding, setIsLanding] = useState(false);


    // Charts
    const [isApex, setIsApex] = useState(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState(false);
    const [isLevel2, setIsLevel2] = useState(false);

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
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history.push("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
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
            link: "/#",
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
            link: "/#",
            stateVariables: isApps,
            click: function (e) {
                e.preventDefault();
                setIsApps(!isApps);
                setIscurrentState('Apps');
                updateIconSidebar(e);
            }
        },
        {
            id: "authentication",
            label: "Authentication",
            icon: "ri-account-circle-line",
            link: "/#",
            stateVariables: isAuth,
            click: function (e) {
                e.preventDefault();
                setIsAuth(!isAuth);
                setIscurrentState('Auth');
                updateIconSidebar(e);
            },
        },
        {
            id: "pages",
            label: "Pages",
            icon: "ri-pages-line",
            link: "/#",
            stateVariables: isPages,
            click: function (e) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
        },
        {
            id: "landing",
            label: "Landing",
            icon: "ri-rocket-line",
            link: "/#",
            stateVariables: isLanding,
            click: function (e) {
                e.preventDefault();
                setIsLanding(!isLanding);
                setIscurrentState('Landing');
                updateIconSidebar(e);
            }
        },
        {
            label: "Superadmin Areas",
            isHeader: true,
        },
        {
            id: "baseUi",
            label: "Base UI",
            icon: "ri-pencil-ruler-2-line",
            link: "/#",
            stateVariables: isBaseUi,
            click: function (e) {
                e.preventDefault();
                setIsBaseUi(!isBaseUi);
                setIscurrentState('BaseUi');
                updateIconSidebar(e);
            },
        },
        {
            id: "advanceUi",
            label: "Advance UI",
            icon: "ri-stack-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsAdvanceUi(!isAdvanceUi);
                setIscurrentState('AdvanceUi');
                updateIconSidebar(e);
            },
            stateVariables: isAdvanceUi,
            subItems: [
                { id: "nestablelist", label: "Nestable List", link: "#", parentId: "advanceUi" },
                { id: "scrollbar", label: "Scrollbar", link: "#", parentId: "advanceUi" },
            ],
        },
        {
            id: "maps",
            label: "Maps",
            icon: "ri-map-pin-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsMaps(!isMaps);
                setIscurrentState('Maps');
                updateIconSidebar(e);
            },
            stateVariables: isMaps,
            subItems: [
                { id: "google", label: "Google", link: "#", parentId: "maps" },
                { id: "vector", label: "Vector", link: "#", parentId: "maps" },
            ],
        },
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;