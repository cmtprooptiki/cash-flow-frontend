import React,{ useState, useRef }from "react";
import {NavLink} from "react-router-dom";
import logo from "../logo2.png";
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LogOut, LoginUser,reset} from "../features/authSlice"
import '../navbar-custom.css';
import {IoPerson,IoPricetag,IoHome,IoLogOut} from "react-icons/io5";


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import cmt from "../logocmt.png";
import { ReactComponent as WizardIcon } from '../icons/wizardicon.svg'; // Import the SVG as a React component

import { Toolbar } from "primereact/toolbar";

import {useClickOutside} from "primereact/hooks";

// import apiBaseUrl from '../../apiConfig';
import apiBaseUrl from "../apiConfig";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { AutoComplete } from "primereact/autocomplete";
import { Navigate } from "react-router-dom";

const Navbar =()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state)=>state.auth)
    const logout = ()=>{
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);

    const [anchorEl, setAnchorEl] = React.useState(null);

  
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [visible, setVisible] = useState(false);
    const [ShowSearch,setShowSearch] = useState(false);

    const overlayRef = useRef(null);

    useClickOutside(overlayRef, () => {
        setVisible(false);
    });



    const startContent = (
        <React.Fragment>
     
            <div >
                <Avatar icon="p-ripple pi pi-plus" style={{borderRadius:"20px"}} onClick={() => setVisible(true)} ><Ripple/></Avatar>
                <Sidebar
                visible={visible}
                onHide={() => setVisible(true)}
                
                content={({ closeIconRef, hide }) => (
                    <div className="min-h-screen flex relative lg:static surface-ground">
                        <div id="app-sidebar-2" className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '280px',backgroundImage: 'linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))' }}>
                            <div className="flex flex-column h-full">
                                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                                    <img 
                                      src={cmt}
                                      width="180" 
                                      alt="logo"
                                    />
                                    <span>
                                        <Button type="button" ref={closeIconRef} onClick={(e) => {hide(e);setVisible(false)}} icon="pi pi-times" rounded outlined className="h-2rem w-2rem"></Button>
                                    </span>
                                </div>
                                <div className="overflow-y-auto " >
                                    <ul className="list-none p-3 m-0">
                                        <li>
                                            <StyleClass nodeRef={btnRef1} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                                    <span className="font-medium">Διαχείριση Οικονομικών</span>
                                                    <i className="pi pi-chevron-down text-gray-50"></i>
                                                    <Ripple />
                                                </div>
                                            </StyleClass>
                                            <ul className="list-none p-0 m-0 overflow-hidden">


                                            <li>
                                                <Link to="/statistics" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                <i className="pi pi-chart-bar mr-2 text-gray-50"></i>
                                                    <span className="font-medium">Στατιστικά</span>
                                                    <Ripple />

                                                    </div>
                                                </Link>
                                                </li>

                                                <li>
                                                <Link to="/reports" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                <i className="pi pi-chart-line mr-2 text-gray-50"></i>
                                                    <span className="font-medium">Αναφορές</span>
                                                    <Ripple />

                                                    </div>
                                                </Link>
                                                </li>


                                                <li><Link className="link-a-tag" to="/dashboard"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-calendar-plus mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Ημερολόγιο Εσόδων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-bookmark mr-2"></i>
                                                        <span className="font-medium">Bookmarks</span>
                                                        <Ripple />
                                                    </a>
                                                </li> */}

                                          
                                                {/* <li>
                                                <Link to="/esoda_step1"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-chart-line mr-2"></i>
                                                            <span className="font-medium">Οδηγός Εσόδων</span>
                                                            <Ripple />
                                                        </a>
                                                    </Link>
                                                </li> */}
                                             


                                                {/* <li>
                                                <Link to="/esoda_step1" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div className="wizard-hover p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <WizardIcon style={{ width: '1em', height: '1em' }}  className="mr-2 wizard-icon" />  
                                                        <span className="font-medium">Οδηγός Εσόδων</span>
                                                    </div>
                                                </Link>
                                                </li> */}

                                 
                                          

                                                <li><Link to="/expen" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-calendar-minus mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Ημερολόγιο Εξόδων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>

                                             
{/* 
                                                <li>
                                                <Link to="/step1" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div className="wizard-hover p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                                                        <WizardIcon style={{ width: '1em', height: '1em' }}  className="mr-2 wizard-icon" /> 
                                                        <span className="font-medium">Οδηγός Εξόδων</span>
                                                    </div>
                                                </Link>
                                                </li> */}


                                                <li><Link to="/budget" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-euro mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Προυπολογισμός</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul className="list-none p-3 m-0">
                                        <li>
                                            <StyleClass nodeRef={btnRef4} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                <div ref={btnRef4} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                                    <span className="font-medium">Διαχείριση</span>
                                                    <i className="pi pi-chevron-down text-gray-50"></i>
                                                    <Ripple />
                                                </div>
                                            </StyleClass>
                                            <ul className="list-none p-0 m-0 overflow-hidden">
                                                <li><Link to="/customer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-users mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Πελατών</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/erga"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Εργων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/ergacat"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Κατηγοριών Εργων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/timologia"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Τιμολογίων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/ek_tim"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Εκχωριμένων Τιμολογίων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/paradotea"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Παραδοτέων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/daneia"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Δανείων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/tags"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Tags</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/doseis"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Δόσεων</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/ypoquery"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                            <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                            <span className="font-medium">Διαχείριση Υποχρεώσεων</span>
                                                            <Ripple />
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li><Link to="/budgetform"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <div  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700  transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2 text-gray-50"></i>
                                                        <span className="font-medium">Διαχείριση Budget</span>
                                                        <Ripple />
                                                    </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-auto">
                                    <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                                    <a v-ripple className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700  transition-duration-150 transition-colors p-ripple">
                                        {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                                        <span className="font-bold">Amy Elsner</span> */}
                                        {/* {console.log("here is the profile pci",user?.profileImage)} */}
                                         <Avatar
                                                    image={`${apiBaseUrl}/uploads/${user?.profileImage.split('/').pop()}`}
                                                    shape="circle"
                                                />
                                                <span className="font-bold">{user?.name || "Amy Elsner"}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            ></Sidebar>
            </div>
        </React.Fragment>
    );
    const op = useRef(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [filteredCities, setFilteredCities] = useState(null);
    const groupedCities = [
        {
            label: 'Customer',
            items: [
                { label: 'Πελάτης', value: 'customer' },
                { label: 'Customer', value: 'customer' },
            ]
        },{
            label: 'Erga',
            items: [
                { label: 'Εργα', value: 'erga' },
                { label: 'erga', value: 'erga' },
            ]
        },
        {
            label: 'Paradotea',
            items: [
                { label: 'Παραδοτέα', value: 'paradotea' },
                { label: 'paradotea', value: 'paradotea' },
            ]
        },
        {
            label: 'Timologia',
            items: [
                { label: 'Τιμολόγια', value: 'timologia' },
                { label: 'timologia', value: 'timologia' },
            ]
        },
        {
            label: 'Ekxorimena timologia',
            items: [
                { label: 'Εκχωρημένα τιμολόγια', value: 'ek_tim' },
                { label: 'ekxorimena timologia', value: 'ek_tim' },
            ]
        },
        {
            label: 'Erga Categories',
            items: [
                { label: 'Κατηγορίες Εργων', value: 'ergacat' },
                { label: 'Erga Categories', value: 'ergacat' },
            ]
        },
        {
            label: 'Daneia',
            items: [
                { label: 'Δανεια', value: 'daneia' },
                { label: 'daneia', value: 'daneia' },
            ]
        },
        {
            label: 'Tags',
            items: [
                { label: 'tags', value: 'taga' },
            ]
        },
        {
            label: 'Ypoxreoseis',
            items: [
                { label: 'Υποχρεωσεις', value: 'ypoquery' },
                { label: 'Ypoxreoseis', value: 'ypoquery' },
            ]
        },
        {
            label: 'Doseis',
            items: [
                { label: 'Δοσεις', value: 'doseis' },
                { label: 'doseis', value: 'doseis' },
            ]
        },
        {
            label: 'Budget Form',
            items: [
                { label: 'Φορμα Budget', value: 'budgetform' },
                { label: 'Budget Form', value: 'budgetform' },
            ]
        },
        {
            label: 'Statistics',
            items: [
                { label: 'Στατιστικα', value: 'statistics' },
                { label: 'statistics', value: 'statistics' },
            ]
        },
        {
            label: 'Reports',
            items: [
                { label: 'Αναφορες', value: 'reports' },
                { label: 'reports', value: 'reports' },
            ]
        },
        {
            label: 'Income',
            items: [
                { label: 'Ημερολογιο Εσοδων', value: 'dashboard' },
                { label: 'income calendar', value: 'dashboard' },
            ]
        },
        {
            label: 'Expenses',
            items: [
                { label: 'Ημερολογιο Εξοδων', value: 'expen' },
                { label: 'expenses calendar', value: 'expen' },
            ]
        },
        {
            label: 'Budget',
            items: [
                { label: 'προυπολογισμος', value: 'budget' },
                { label: 'budget', value: 'budget' },
            ]
        },
    ];

    const groupedItemTemplate = (item) => {
        return (
            <div className="flex align-items-center">
                <div>{item.label}</div>
            </div>
        );
    };

    const search = (event) => {
        let query = event.query;
        let _filteredCities = [];

        for (let country of groupedCities) {
            let filteredItems = country.items.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1);

            if (filteredItems && filteredItems.length) {
                _filteredCities.push({ ...country, ...{ items: filteredItems } });
            }
        }

        setFilteredCities(_filteredCities);
    }
    const navigation = useNavigate();
    const select =(event)=>{
        setSelectedCity(event.value)
        if(typeof(event.value)==="object"){
            //console.log("navigate value: ",event.value.value)
            navigation('/'+event.value.value);
        }
        
    }


    const centerContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }} className="p-ripple p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200">
                <i className="pi pi-home text-2xl"></i>
                <Ripple />
            </Link>
            <Link to="/users" style={{ color: 'inherit', textDecoration: 'none' }} className="p-ripple p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200">
                <i className="pi pi-user text-2xl"></i>
                <Ripple />
            </Link>
            <button className="p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200">
                <i className="pi pi-search text-2xl" onClick={(e) => op.current.toggle(e)}/>
                
                    <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable={false}>
                    <AutoComplete value={selectedCity} onChange={(e) => select(e)} suggestions={filteredCities} completeMethod={search}
                field="label" optionGroupLabel="label" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate} placeholder="Hint: type 'a'" />
                    
                     
                    </OverlayPanel>
                    
                
            </button>
        </div>
    );

    const endContent = (
        <React.Fragment>
            {/* <div className="flex align-items-center gap-2">
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                <span className="font-bold text-bluegray-50">Amy Elsner</span>
            </div> */}
            
            <div>
                <Avatar
                    image={`${apiBaseUrl}/uploads/${user?.profileImage.split('/').pop()}`}
                    shape="circle"
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                {/* <AccountCircle /> */}
                </Avatar>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >

                    <MenuItem><FaUser/><span style={{paddingLeft:"10px"}}>{user && user.name} ({user && user.role})</span></MenuItem>
                    {user && user.role ==="admin" && ( 
                    <MenuItem  component={Link} to="/users" ><FaUsersGear/><span style={{paddingLeft:"10px"}}> Διαχείριση Χρηστών</span></MenuItem>
                    )}

                    <MenuItem onClick={logout}><IoLogOut/><span style={{paddingLeft:"10px"}}> Αποσύνδεση</span></MenuItem>

                
                </Menu>
            </div>
        </React.Fragment>
    );

    return(
      
        <div className="card" ref={overlayRef}>
            <Toolbar start={startContent} center={centerContent} end={endContent} className="bg-gray-900 shadow-2" 
            style={{ borderRadius: '3rem', backgroundImage: 'linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))' }} />
        </div>
    )
}
export default Navbar