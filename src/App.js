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

import ErgaCat from "./pages/erga_cat_pages/ErgaCat";
import AddErgaCat from "./pages/erga_cat_pages/AddErgaCat";
import EditErgoCat from "./pages/erga_cat_pages/EditErgoCat";


import Customer from "./pages/customer_pages/Customer";
import AddCustomer from "./pages/customer_pages/AddCustomer";
import EditCustomer from "./pages/customer_pages/EditCustomer";
import ProfileCustomer from "./pages/customer_pages/ProfileCustomer";

import Timologia from "./pages/timologia_pages/Timologia";
import AddTimologio from "./pages/timologia_pages/AddTimologio";
import EditTimologio from "./pages/timologia_pages/EditTimologio";
import ProfileTimologio from "./pages/timologia_pages/ProfileTimologio";

import Ekxorimena_Timologia from "./pages/ekxwrimeno_timologio_pages/Ekxorimena_Timologia";
import AddEkxorimeno_Timologio from "./pages/ekxwrimeno_timologio_pages/AddEkxorimeno_Timologio";
import EditEkxorimeno_Timologio from "./pages/ekxwrimeno_timologio_pages/EditEkxorimeno_Timologio";
import ProfileEkxorimenoTimologio from "./pages/ekxwrimeno_timologio_pages/ProfileEkxorimeno_Timologio";


import Paradotea from "./pages/paradotea_pages/Paradotea";
import AddParadoteo from "./pages/paradotea_pages/AddParadoteo";
import EditParadoteo from "./pages/paradotea_pages/EditParadoteo";
import ProfileParadoteo from "./pages/paradotea_pages/ProfileParadoteo";

import Daneia from "./pages/daneia_pages/Daneia";
import AddDaneia from "./pages/daneia_pages/AddDaneia";
import EditDaneia from "./pages/daneia_pages/EditDaneia";

import ProfileDaneia from "./pages/daneia_pages/ProfileDaneia";

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

          <Route path="/ergacat" element={<ErgaCat/>}></Route>
          <Route path="/ergacat/add" element={<AddErgaCat/>}></Route>
          <Route path="/ergacat/edit/:id" element={<EditErgoCat/>}></Route>
          

          <Route path="/customer" element={<Customer/>}></Route>

          <Route path="/customer/add" element={<AddCustomer/>}></Route>
          <Route path="/customer/edit/:id" element={<EditCustomer/>}></Route>
          <Route path="/customer/profile/:id" element={<ProfileCustomer/>}></Route>


          <Route path="/timologia" element={<Timologia/>}></Route>

          <Route path="/timologia/add" element={<AddTimologio/>}></Route>
          <Route path="/timologia/edit/:id" element={<EditTimologio/>}></Route>

          <Route path="/timologia/profile/:id" element={<ProfileTimologio/>}></Route>


          <Route path="/ek_tim" element={<Ekxorimena_Timologia/>}></Route>

          <Route path="/ek_tim/add" element={<AddEkxorimeno_Timologio/>}></Route>
          <Route path="/ek_tim/edit/:id" element={<EditEkxorimeno_Timologio/>}></Route>



          <Route path="/ek_tim/profile/:id" element={<ProfileEkxorimenoTimologio/>}></Route>



          <Route path="/paradotea" element={<Paradotea/>}></Route>

          <Route path="/paradotea/add" element={<AddParadoteo/>}></Route>

          <Route path="/paradotea/edit/:id" element={<EditParadoteo/>}></Route>

          <Route path="/paradotea/profile/:id" element={<ProfileParadoteo/>}></Route>
          
          <Route path="/daneia" element={<Daneia/>}></Route>

          <Route path="/daneia/add" element={<AddDaneia/>}></Route>

          <Route path="/daneia/edit/:id" element={<EditDaneia/>}></Route>

          <Route path="/daneia/profile/:id" element={<ProfileDaneia/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
