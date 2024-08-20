import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import Esoda from './Esoda';
import Eksoda from './Eksoda';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
// import BuildingMetricsTable from '../components/BuildingMetricsTable';
import { IconContext } from "react-icons";
import { GiBubbles } from "react-icons/gi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import '../dashboard.css';
import { getColorClass2, getLimitAnnotation } from '../components/HelperComponent';
import apiBaseUrl from '../apiConfig';
import WeeksTableBudget from '../components/WeeksTableBudget';
import WeeksTableBudget_Est2 from '../components/WeeksTableBudget_Est2';
import WeeksTableBudget_Est3 from '../components/WeeksTableBudget_Est3';
import PaidView from './paid_pages/paidView';
import EsodaNew from './EsodaNew';
// Importing calendar library
import { Calendar, momentLocalizer,DateLocalizer ,DnDCalendar} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Modal, Button } from 'react-bootstrap';

import InfoBox from '../components/InfoBox';

import WeeksTable from '../components/WeeksTable'; // Import the WeeksTable component
import Esoda_ippos from './Esoda_ippos'
import PaidList from '../components/paid_components/PaidLists';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Dashboard = () => {
 
  const [selectedTable, setSelectedTable] = useState('table1');
  return (
    <Layout>
        <Welcome />
        {/* <Esoda />
        <Esoda_ippos></Esoda_ippos> */}
        <EsodaNew/>
        
        
        {/* <Eksoda/> */}
        {/* <div className="boxclass">
        <div className="button-group">
        <button className = "Filters" style = {{margin: "10px"}} onClick={() => setSelectedTable('table1')}>ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Best-case Scenario</button>
        <button className = "Filters" style = {{margin: "10px"}} onClick={() => setSelectedTable('table2')}>ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Medium-case Scenario</button>
        <button className = "Filters" style = {{margin: "10px"}} onClick={() => setSelectedTable('table3')}>ΠΡΟΥΠΟΛΟΓΙΣΜΟΣ Worst-case Scenario</button>
      </div>

      {selectedTable === 'table1' && <WeeksTableBudget />}
      {selectedTable === 'table2' && <WeeksTableBudget_Est2 />}
      {selectedTable === 'table3' && <WeeksTableBudget_Est3 />}
      </div> */}
    </Layout>
  );
  
};

export default Dashboard;
