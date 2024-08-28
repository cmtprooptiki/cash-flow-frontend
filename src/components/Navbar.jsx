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
import Toolbar from '@mui/material/Toolbar';
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
    const [visible, setVisible] = useState(true);

    return(
        <div>
            <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
              
            <Box sx={{ flexGrow: 1 }}>
     

                  <Toolbar>
                  
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      
                    <NavLink className="navbar-item" to="/dashboard">
                              
                          </NavLink>
                    </Typography>
                      <div>
                        <Button icon="p-button-icon p-c pi pi-bars" onClick={() => setVisible(true)} />
                        <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                
                content={({ closeIconRef, hide }) => (
                    <div className="min-h-screen flex relative lg:static surface-ground">
                        <div id="app-sidebar-2" className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '280px' }}>
                            <div className="flex flex-column h-full">
                                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                                    <img 
                                      src={cmt}
                                      width="180" 
                                      alt="logo"
                                    />
                                    <span>
                                        <Button type="button" ref={closeIconRef} onClick={(e) => hide(e)} icon="pi pi-times" rounded outlined className="h-2rem w-2rem"></Button>
                                    </span>
                                </div>
                                <div className="overflow-y-auto">
                                    <ul className="list-none p-3 m-0">
                                        <li>
                                            <StyleClass nodeRef={btnRef1} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                                    <span className="font-medium">FAVORITES</span>
                                                    <i className="pi pi-chevron-down"></i>
                                                    <Ripple />
                                                </div>
                                            </StyleClass>
                                            <ul className="list-none p-0 m-0 overflow-hidden">
                                                <li><Link to="/dashboard"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-home mr-2"></i>
                                                        <span className="font-medium">Dashboard</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-bookmark mr-2"></i>
                                                        <span className="font-medium">Bookmarks</span>
                                                        <Ripple />
                                                    </a>
                                                </li>

                                                <li>
                                                <Link to="/step1"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-cart-arrow-down"></i>
                                                            <span className="font-medium">Διαχείριση Εξόδων</span>
                                                            <Ripple />
                                                        </a>
                                                    </Link>
                                                </li>

                                                <li>
                                                <Link to="/esoda_step1"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-chart-line mr-2"></i>
                                                            <span className="font-medium">Διαχείριση Εσόδων</span>
                                                            <Ripple />
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <StyleClass nodeRef={btnRef2} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                        <a ref={btnRef2} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                            <i className="pi pi-chart-line mr-2"></i>
                                                            <span className="font-medium">Reports</span>
                                                            <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                                            <Ripple />
                                                        </a>
                                                    </StyleClass>
                                                    <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                        <li>
                                                            <StyleClass nodeRef={btnRef3} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                                <a ref={btnRef3} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                    <i className="pi pi-chart-line mr-2"></i>
                                                                    <span className="font-medium">Revenue</span>
                                                                    <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                                                    <Ripple />
                                                                </a>
                                                            </StyleClass>
                                                            <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                                <li>
                                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                        <i className="pi pi-table mr-2"></i>
                                                                        <span className="font-medium">View</span>
                                                                        <Ripple />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                        <i className="pi pi-search mr-2"></i>
                                                                        <span className="font-medium">Search</span>
                                                                        <Ripple />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                <i className="pi pi-chart-line mr-2"></i>
                                                                <span className="font-medium">Expenses</span>
                                                                <Ripple />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-users mr-2"></i>
                                                        <span className="font-medium">Team</span>
                                                        <Ripple />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-comments mr-2"></i>
                                                        <span className="font-medium">Messages</span>
                                                        <span className="inline-flex align-items-center justify-content-center ml-auto bg-blue-500 text-0 border-circle" style={{ minWidth: '1.5rem', height: '1.5rem' }}>
                                                            3
                                                        </span>
                                                        <Ripple />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-calendar mr-2"></i>
                                                        <span className="font-medium">Calendar</span>
                                                        <Ripple />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-cog mr-2"></i>
                                                        <span className="font-medium">Settings</span>
                                                        <Ripple />
                                                    </a>
                                                </li>

                                                <li><Link to="/expen" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-users mr-2"></i>
                                                        <span className="font-medium">Expenses Calendar</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>

                                                <li><Link to="/budget" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-cog mr-2"></i>
                                                        <span className="font-medium">Budget</span>
                                                        <Ripple />
                                                    </a>
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
                                                    <i className="pi pi-chevron-down"></i>
                                                    <Ripple />
                                                </div>
                                            </StyleClass>
                                            <ul className="list-none p-0 m-0 overflow-hidden">
                                                <li><Link to="/customer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-users mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Πελατών</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/erga"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Εργων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/ergacat"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Κατηγοριών Εργων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/timologia"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Τιμολογίων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/ek_tim"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Εκχωριμένων Τιμολογίων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/paradotea"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Παραδοτέων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/daneia"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Δανείων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/tags"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Tags</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li><Link to="/doseis"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                        <i className="pi pi-folder mr-2"></i>
                                                        <span className="font-medium">Διαχείριση Δόσεων</span>
                                                        <Ripple />
                                                    </a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/ypoquery"  style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        <a  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                            <i className="pi pi-folder mr-2"></i>
                                                            <span className="font-medium">Διαχείριση Υποχρεώσεων</span>
                                                            <Ripple />
                                                        </a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-auto">
                                    <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                                    <a v-ripple className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                                        <span className="font-bold">Amy Elsner</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            ></Sidebar>
                      </div>
                      <div>
                        <IconButton
                          size="large"
                          aria-label="account of current user"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleMenu}
                          color="inherit"
                        >
                          <AccountCircle />
                        </IconButton>
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
                
                  </Toolbar>
              </Box>
            </nav>
        </div>
    )
}
export default Navbar