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

import Tags from "./pages/tags_pages/Tags";
import AddTag from "./pages/tags_pages/AddTag"
import EditTags from "./pages/tags_pages/EditTags";
import ProfileTags from "./pages/tags_pages/ProfileTags";


import Doseis from "./pages/doseis_pages/Doseis";
import AddDoseis from "./pages/doseis_pages/AddDoseis"
import EditDoseis from "./pages/doseis_pages/EditDoseis"
import ProfileDoseis from "./pages/doseis_pages/ProfileDoseis"

import Ypoxreoseis from "./pages/ypoxreoseis_pages/Ypoxreoseis";
import AddYpoxreoseis from "./pages/ypoxreoseis_pages/AddYpoxreoseis";
import ProfileYpoxreoseis from "./pages/ypoxreoseis_pages/ProfileYpoxreoseis";
import EditYpoxreoseis from "./pages/ypoxreoseis_pages/EditYpoxreoseis";

import PaidView from "./pages/paid_pages/paidView";


import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button'; // Importing PrimeReact Button component

import 'primereact/resources/themes/saga-blue/theme.css';  // theme
// import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
//import 'primereact/resources/primereact.min.css';          // core css
import 'primeicons/primeicons.css';                        // icons
import 'primeflex/primeflex.css';   


import './flags.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import Tags2 from "./pages/wizard_pages/tags_pages2/Tags2";
import AddTag2 from "./pages/wizard_pages/tags_pages2/AddTag2";


import AddYpoxreoseis2 from "./pages/wizard_pages/ypoxreoseis_pages2/AddYpoxreoseis2";
import YpoxreoseisList2 from "./components/wizard_components/ypoxreoseis_components2/YpoxreoseisList2";

import AddDoseis2 from "./pages/wizard_pages/doseis_pages2/AddDoseis2"
import Doseis2 from "./pages/wizard_pages/doseis_pages2/Doseis2"

import MyStepper1 from "./pages/MyStepper1";
import MyStepper2 from "./pages/MyStepper2";

import Expenses_Display from "./pages/Expenses_Display";
import BudgetPage from './pages/BudgetPage'

import Customer2 from "./pages/wizard_pages/customer_pages2/Customer2";
import AddCustomer2 from "./pages/wizard_pages/customer_pages2/AddCustomer2";

import Erga2 from "./pages/wizard_pages/erga_pages2/Erga2";
import AddErga2 from "./pages/wizard_pages/erga_pages2/AddErga2";

import ErgaCat2 from "./pages/wizard_pages/erga_cat_pages2/ErgaCat2";
import AddErgaCat2 from "./pages/wizard_pages/erga_cat_pages2/AddErgaCat2";

import Paradotea2 from "./pages/wizard_pages/paradotea_pages2/Paradotea2";
import AddParadoteo2 from "./pages/wizard_pages/paradotea_pages2/AddParadoteo2";

import Timologia2 from "./pages/wizard_pages/timologia_pages2/Timologia2";
import AddTimologio2 from "./pages/wizard_pages/timologia_pages2/AddTimologio2";

import Ekxorimena_Timologia2 from "./pages/wizard_pages/ekxwrimeno_timologio_pages2/Ekxorimena_Timologia2";
import AddEkxorimeno_Timologio2 from "./pages/wizard_pages/ekxwrimeno_timologio_pages2/AddEkxorimeno_Timologio2";

import Stepper_Esoda1 from "./pages/Stepper_Esoda1";
import Stepper_Esoda2 from "./pages/Stepper_Esoda2";
import Stepper_Esoda3 from "./pages/Stepper_Esoda3";

import BudgetFormPage from "./pages/budget_pages/BudgetFormPage";

import KpisDashboard from "./pages/KpisDashboard";
import Reports from "./pages/report_pages/Reports";
import AddMultiDoseis from "./pages/doseis_pages/AddMultiDoseis.jsx";

function App() {
  const value = {
    ripple: true,
    
};
  return (
    <div>
      <PrimeReactProvider value={value}>
      
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

          <Route path="/tags" element={<Tags/>}></Route>

          <Route path="/tags/add" element={<AddTag/>}></Route>

          <Route path="/tags/edit/:id" element={<EditTags/>}></Route>

          <Route path="/tags/profile/:id" element={<ProfileTags/>}></Route>



          <Route path="/doseis" element={<Doseis/>}></Route>

          <Route path="/doseis/add" element={<AddDoseis/>}></Route>
          <Route path="/doseis/multiAdd" element={<AddMultiDoseis/>}></Route>

          <Route path="/doseis/edit/:id" element={<EditDoseis/>}></Route>

          <Route path="/doseis/profile/:id" element={<ProfileDoseis/>}></Route>

          <Route path="/ypoquery" element={<Ypoxreoseis/>}></Route>

          <Route path="/ypoquery/add" element={<AddYpoxreoseis/>}></Route>

          <Route path="/ypoquery/profile/:id" element={<ProfileYpoxreoseis/>}></Route>

          <Route path="/ypoquery/edit/:id" element={<EditYpoxreoseis/>}></Route>

          <Route path="/paidView" element={<PaidView/>}></Route>
          

          <Route path="/tags2" element={<Tags2/>}></Route>

          <Route path="/tags2/add" element={<AddTag2/>}></Route>

          {/* <Route path="/tags/edit/:id" element={<EditTags/>}></Route>

          <Route path="/tags/profile/:id" element={<ProfileTags/>}></Route> */}

          <Route path="/ypoquery2/add" element={<AddYpoxreoseis2/>}></Route>

          <Route path="/ypoquery2" element={<YpoxreoseisList2/>}></Route>

          <Route path="/doseis2/add" element={<AddDoseis2/>}></Route>

          <Route path="/ypoquery2" element={<YpoxreoseisList2/>}></Route>

          <Route path="/doseis2" element={<Doseis2/>}></Route>

          <Route path="/step1" element={<MyStepper1/>}></Route>

          <Route path="/step2" element={<MyStepper2/>}></Route>

          <Route path="/expen" element={<Expenses_Display/>}></Route>

          <Route path="/budget" element={<BudgetPage/>}></Route>

          <Route path="/customer2" element={<Customer2/>}></Route>

          <Route path="/customer2/add" element={<AddCustomer2/>}></Route>

          <Route path="/erga2" element={<Erga2/>}></Route>

          <Route path="/erga2/add" element={<AddErga2/>}></Route>

          <Route path="/ergacat2" element={<ErgaCat2/>}></Route>
          <Route path="/ergacat2/add" element={<AddErgaCat2/>}></Route>

          <Route path="/paradotea2" element={<Paradotea2/>}></Route>

          <Route path="/paradotea2/add" element={<AddParadoteo2/>}></Route>

          <Route path="/timologia2" element={<Timologia2/>}></Route>

          <Route path="/timologia2/add" element={<AddTimologio2/>}></Route>

          <Route path="/ek_tim2" element={<Ekxorimena_Timologia2/>}></Route>

          <Route path="/ek_tim2/add" element={<AddEkxorimeno_Timologio2/>}></Route>

          <Route path="/esoda_step1" element={<Stepper_Esoda1/>}></Route>
          <Route path="/esoda_step2" element={<Stepper_Esoda2/>}></Route>
          <Route path="/esoda_step3" element={<Stepper_Esoda3/>}></Route>
          <Route path="/statistics" element={<KpisDashboard/>}></Route>

          <Route path="/budgetForm" element={<BudgetFormPage/>}></Route>
          <Route path="/reports" element={<Reports/>}></Route>

        </Routes>
      </BrowserRouter>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
