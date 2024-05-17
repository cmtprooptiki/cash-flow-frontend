import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

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

// Importing calendar library
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getMe());
    // fetchData(); // Fetch data from the database
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);



  const [paradotea, setParadotea] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(()=>{
      getParadotea()
  },[]);

  const getParadotea = async() =>{
      const response = await axios.get(`${apiBaseUrl}/paradotea`);
      setParadotea(response.data);

      const testData = [
        {
          id: 1,
          title: 'Event 1',
          start: new Date(2024, 4, 15, 10, 0), // Year, Month (0-based), Day, Hour, Minute
          end: new Date(2024, 4, 15, 12, 0)
        },

        {
          id: 2,
          title: 'Event 2',
          start: new Date(2024, 4, 16, 14, 0),
          end: new Date(2024, 4, 16, 16, 0)
        }
      ];

      setEvents(testData); // Set test data as events
  }




  // Function to fetch data from the database

  return (
    <Layout>
      <Welcome />
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={paradotea.map(item => ({
            id: item.id,
            title: item.ammount_total+" euros",
            start: new Date(item.estimate_payment_date),
            end: new Date(item.estimate_payment_date) // You may need to adjust this based on your data
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '20px' }}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
