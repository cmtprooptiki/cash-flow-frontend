import React from 'react';
import Navbar from '../components/Navbar';
import { SidebarNew } from '../components/SidebarNew';
import HeadlessDemo from '../components/HeadlessDemo';
const Layout = ({children}) => {
  return (
    <React.Fragment>
        <Navbar/>
        <div className="columns mt-6 " style={{minHeight:"100vh",backgroundColor:"#fff"}}>
            {/* <div className="column is-one-fifth"> */}
                {/* <Sidebar/> */}
                {/* <SidebarNew/> */}
                {/* <HeadlessDemo/> */}

            {/* </div> */}
            <div className="column has-background-light">
                <main>{children}</main>
            </div>
        </div>
    </React.Fragment>
  )
}

export default Layout