import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import React,{useState,useEffect} from 'react'
import {NavLink} from "react-router-dom"
import {IoPerson,IoPricetag,IoHome,IoLogOut} from "react-icons/io5";
import { FaMap } from "react-icons/fa";
import { GiBubbles } from "react-icons/gi";
import { MdScience } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LogOut, LoginUser,reset} from "../features/authSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import '../sidebar.css'
import Expander from './ExpanderComponent';
import apiBaseUrl from '../apiConfig';
import { HiLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import cmt from "../logocmt.png";

export const SidebarNew = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state)=>state.auth)
    const [erga,setErga]=useState([]);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to manage submenu open/close
    
    const logout = ()=>{
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };

    useEffect(()=>{
        getErga()
        console.log(isSubMenuOpen)
    },[]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/erga`);
        setErga(response.data);
    }
    const changeMenu=() =>{
        setIsSubMenuOpen(true);
        console.log("hello")
    }
    return(
      <div className="sidebar">
                <aside className="menu pl-2 has-shadow">

        {/* <div style={{ display: "block", height: "100vh" }}> */}
      <Sidebar className="app" backgroundColor="#06603a">
        <Menu backgroundColor="#06603a" renderMenuItemStyles={() => ({
      '.menu-anchor': {
            backgroundColor: 'red',
            '&:hover': {
              backgroundColor: 'green',
            },
        },
      })}><br/>
        <div className="field is-flex is-justify-content-center">
        
          <img 
            src={cmt}
            width="120" 
            height="80"
            alt="logo"
          />
          </div>
          <MenuItem  component={<Link to="/dashboard"/>}><AiFillDashboard/> Επισκόπηση</MenuItem>
          <SubMenu  label="Εργα">
          {erga.map((ergo, index) => (
                     
                    <MenuItem  component={<Link to={`/erga/profile/${ergo.id}`}/>}><HiOutlineLocationMarker/> {ergo.name} </MenuItem>
                ))}  
            
          </SubMenu>
          {user && user.role ==="admin" && (
            <SubMenu  label="Διαχειριστής" defaultOpen={isSubMenuOpen}>
                
                <MenuItem  onChange={() =>setIsSubMenuOpen(true)} component={<Link to="/users"/>}><IoPerson/> Χρήστες</MenuItem>
                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/customer"/>}> <HiOutlineLocationMarker/> Διαχείριση Πελατών</MenuItem>
                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/erga"/>}> <HiOutlineLocationMarker/> Διαχείριση Εργων</MenuItem>
                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/ergacat"/>}> <HiOutlineLocationMarker/> Διαχείριση Κατηγοριών Εργων</MenuItem>
                
                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/timologia"/>}> <HiOutlineLocationMarker/> Διαχείριση Τιμολογίων</MenuItem>

                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/ek_tim"/>}> <HiOutlineLocationMarker/> Διαχείριση Εκχωριμένων Τιμολογίων</MenuItem>

                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/paradotea"/>}> <HiOutlineLocationMarker/> Διαχείριση Παραδοτέων</MenuItem>

                <MenuItem  onChange={() => setIsSubMenuOpen(true)} component={<Link to="/daneia"/>}> <HiOutlineLocationMarker/> Διαχείριση Δανείων</MenuItem>

            </SubMenu>
            )}
          
          {/* <MenuItem> <button onClick={logout} className='button-logout'><IoLogOut/> Αποσύνδεση</button></MenuItem> */}
          {/* <MenuItem> <NavLink  onClick={logout}><AiFillDashboard/> Dashboard</NavLink></MenuItem> */}
          <MenuItem onClick={logout} ><IoLogOut/> Αποσύνδεση</MenuItem>
        </Menu>
      </Sidebar>
      
    {/* </div> */}
    </aside>
    </div>
    );
};

