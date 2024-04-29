import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./components/Login";
import Users from "./pages/user_pages/Users";


import AddUser from "./pages/user_pages/AddUser";
import EditUser from "./pages/user_pages/EditUser";


import Erga from "./pages/erga_pages/Erga";
import AddErga from "./pages/erga_pages/AddErga";
import ProfileErgo from "./pages/erga_pages/ProfileErgo";
import EditErgo from "./pages/erga_pages/EditErgo";



import Customer from "./pages/customer_pages/Customer";
import AddCustomer from "./pages/customer_pages/AddCustomer";
import EditCustomer from "./pages/customer_pages/EditCustomer";
import ProfileCustomer from "./pages/customer_pages/ProfileCustomer";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          {/* <Route path="/map" element={<MapPolution/>}></Route> */}

          <Route path="/users" element={<Users/>}></Route>
          <Route path="/users/add" element={<AddUser/>}></Route>
          <Route path="/users/edit/:id" element={<EditUser/>}></Route>

          <Route path="/erga" element={<Erga/>}></Route>
          <Route path="/erga/add" element={<AddErga/>}></Route>
          <Route path="/erga/edit/:id" element={<EditErgo/>}></Route>
          <Route path="/erga/profile/:id" element={<ProfileErgo/>}></Route>

          <Route path="/customer" element={<Customer/>}></Route>

          <Route path="/customer/add" element={<AddCustomer/>}></Route>
          <Route path="/customer/edit/:id" element={<EditCustomer/>}></Route>
          <Route path="/customer/profile/:id" element={<ProfileCustomer/>}></Route>

         

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
