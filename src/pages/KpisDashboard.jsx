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
import '../kpisdashboard.css';
import { getColorClass2, getLimitAnnotation } from '../components/HelperComponent';
import apiBaseUrl from '../apiConfig';
import { ReactComponent as ProjectIcon } from '../icons/projecticon.svg'; // Import the SVG as a React component
import { ReactComponent as CustomerIcon } from '../icons/customericon.svg'; // Import the SVG as a React component
import { ReactComponent as DeliverablesIcon } from '../icons/deliverablesicon.svg'; // Import the SVG as a React component
import { ReactComponent as InvoiceIcon } from '../icons/invoiceicon.svg'; // Import the SVG as a React component

// Importing calendar library

// import moment from 'moment';



// const localizer = momentLocalizer(moment);

const KpisDashboard = () => {
 

    const [paradotea, setParadotea] = useState([]);
    const [erga,setErga]= useState([]);
    const [customer,setCustomer] = useState([]);
    const [timologia,setTimologia] = useState([]);

    const [chartSeries2, setChartSeries2] = useState([]);
    const [chartSeries3, setChartSeries3] = useState([]);



    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError} = useSelector((state=>state.auth));
  
    useEffect(()=>{
        
        dispatch(getMe());
    },[dispatch]);
  

    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    },[isError,navigate]);

    useEffect(()=>{
        getParadotea()
        getErga()
        getCustomer()
        getTimologia()
    },[]);

  // State for BarChart
  const [chartOptions2, setChartOptions2] = useState({
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: false,
        }
      },
    xaxis: {
      categories: [],
    },
    dataLabels: {
      enabled: false,
    },
    title: {
        text: 'Εσοδα ανα Εργο',
        align: 'center',
        floating: true
    },
  });


  const [chartOptions3, setChartOptions3] = useState({
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: false,
        }
      },
    xaxis: {
      categories: [],
    },
    dataLabels: {
      enabled: false,
    },
    title: {
        text: 'Εσοδα ανα Παραδοτέο',
        align: 'center',
        floating: true
    },
  });
  

     const getParadotea = async() =>{
        try {
        const response = await axios.get(`${apiBaseUrl}/paradotea`);
        const paraData = response.data;
        console.log("ParaData:",paraData);

        // Extract names and amounts
        const parNames = paraData.map(item => item.title);
        const parAmounts = paraData.map(item => item.ammount_total);

        console.log("Par Names:", parNames);
        console.log("Par Amounts:", parAmounts);

        // Update the chart options and series
        setChartOptions3(prevOptions => ({
            ...prevOptions,
            xaxis: {
                ...prevOptions.xaxis,
                categories: parNames
            }
        }));

        setChartSeries3([{ name: 'Amounts', data: parAmounts }]);

        // Extract unique ids
        const uniqueIds = [...new Set(paraData.map(item => item.id))];
        
        // Get the total count of unique ids
        const uniqueIdsCount = uniqueIds.length;
        console.log("Total Count of Unique Pardotea Ids:", uniqueIdsCount);
        setParadotea(uniqueIdsCount);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }


    const getErga = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/erga`);
            const ergaData = response.data;
    
            // Extract names and amounts
            const ergaNames = ergaData.map(item => item.name);
            const ergaAmounts = ergaData.map(item => item.ammount_total);
    
            console.log("Erga Names:", ergaNames);
            console.log("Erga Amounts:", ergaAmounts);
    
            // Update the chart options and series
            setChartOptions2(prevOptions => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: ergaNames
                }
            }));
    
            setChartSeries2([{ name: 'Amounts', data: ergaAmounts }]);
    
            // Set the count for unique IDs if needed
            const uniqueIds = [...new Set(ergaData.map(item => item.id))];
            const uniqueIdsCount = uniqueIds.length;
            setErga(uniqueIdsCount);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    };
    // const getErga = async() =>{
    //     try {
    //         const response = await axios.get(`${apiBaseUrl}/erga`);
    //         const ergaData = response.data;
    //         // Extract unique statuses
    //         //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
    //         const uniqueIds= [...new Set(ergaData.map(item => item.id))];
    //         const uniqueIdsCount = uniqueIds.length;
    //         console.log("Total Count of Unique Erga Ids:", uniqueIdsCount);
    //         setErga(uniqueIdsCount);
            
    //         setChartSeries2([{ name: ergaData.name, data: ergaData.map((item) => item.ammount_total) }]);

           
    
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         // Handle errors as needed
    //     }
    // }


    const getCustomer = async() =>{
        try {

        const response = await axios.get(`${apiBaseUrl}/customer`);
        const custData = response.data;

        const uniqueIds= [...new Set(custData.map(item => item.id))];
        const uniqueIdsCount = uniqueIds.length;

        console.log("Unique Customer names:",uniqueIdsCount);
        setCustomer(uniqueIdsCount);
    

        // Assuming you have a state setter like setErga defined somewhere
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors as needed
    }
    }

    const getTimologia = async() =>{
        // const response = await axios.get(`${apiBaseUrl}/timologia`);
        // setTimologia(response.data);

        try {
            const response = await axios.get(`${apiBaseUrl}/timologia`);
            const timData = response.data;
            const uniqueIds= [...new Set(timData.map(item => item.id))];
            const uniqueIdsCount = uniqueIds.length;
    
            console.log("Unique Customer names:",uniqueIdsCount);         
           
            setTimologia(uniqueIdsCount);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }





    }




    
    return (
    <Layout>
        <Welcome />

        <div className="grid">

        {/* <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
              <div>
                  <span className="block text-500 font-medium mb-3">Συνολικός Αριθμός Πελατών</span>
                  <div className="text-900 font-medium text-xl">{customer}</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <i className="pi pi-map-marker text-orange-500 text-xl"></i>
              </div>
          </div>
          <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">since last week</span>
      </div>
  </div> */}

<div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Πελατών</h6>
                  <h1 className="m-0 text-gray-800 ">{customer} </h1>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  {/* <i className="pi pi-map-marker text-orange-500 text-xl"></i> */}
                  <CustomerIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
  </div>

  
  <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Έργων</h6>
                  <h1 className="m-0 text-gray-800 ">{erga} </h1>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  {/* <i className="pi pi-map-marker text-orange-500 text-xl"></i> */}
                  <ProjectIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
  </div>

  <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Παραδοτέων</h6>
                  <h1 className="m-0 text-gray-800 ">{erga} </h1>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  {/* <i className="pi pi-map-marker text-orange-500 text-xl"></i> */}
                  <DeliverablesIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
  </div>

  <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Τιμολογίων</h6>
                  <h1 className="m-0 text-gray-800 ">{timologia} </h1>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  {/* <i className="pi pi-map-marker text-orange-500 text-xl"></i> */}
                  <InvoiceIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
  </div>
<div className="col-12 xl:col-6 lg:col-3">
<div className="card">
  <ApexCharts options={chartOptions2} series={chartSeries2} type='bar' height={350} />
  </div>
  </div>
  <div className="col-12 xl:col-6 lg:col-3">
<div className="card">
  <ApexCharts options={chartOptions3} series={chartSeries3} type='bar' height={350} />
  </div>
  </div>
 

</div>
    </Layout>
  );
  
};

export default KpisDashboard;
