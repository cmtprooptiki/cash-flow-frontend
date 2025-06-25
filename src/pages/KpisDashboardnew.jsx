import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

import Eksoda from './Eksoda';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { IconContext } from "react-icons";
import { GiBubbles } from "react-icons/gi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import '../dashboard.css';
import '../kpisdashboard.css';
import { getColorClass2, getLimitAnnotation } from '../components/HelperComponent';
import apiBaseUrl from '../apiConfig';
import { ReactComponent as ProjectIcon } from '../icons/projecticon.svg'; // Import the SVG as a React component
import { ReactComponent as CustomerIcon } from '../icons/customericon.svg'; // Import the SVG as a React component
import { ReactComponent as DeliverablesIcon } from '../icons/deliverablesicon2.svg'; // Import the SVG as a React component
import { ReactComponent as InvoiceIcon } from '../icons/invoice.svg'; // Import the SVG as a React component
import {ReactComponent as InstallmentsIcon } from '../icons/installments.svg';
import {ReactComponent as EktimIcon } from '../icons/ektim.svg';
import {ReactComponent as LoanIcon } from '../icons/loand.svg';
import {ReactComponent as BudgetIcon } from '../icons/budget.svg';

import BudgetChart from '../components/paid_components/BudgetChart';
import BudgetChart2 from '../components/paid_components/BudgetChart2';

import { TabView, TabPanel } from 'primereact/tabview';

const KpisDashboardnew = () => {


    const [paradotea, setParadotea] = useState([]);
    
    const [erga,setErga]= useState([]);
   
   

    
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
       

    },[]);

    const formatCurrency = (value) => {
      return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (value) => {
    let date = new Date(value);
    let epochDate = new Date('1970-01-01T00:00:00Z');
    if (date.getTime() === epochDate.getTime()) 
    {
        return null;
    }
    if (!isNaN(date)) {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
    } else {
        return "Invalid date";
    }
};
  
//pie chart 












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
          horizontal: true,
        }
      },
    xaxis: {
      categories: [],
      labels: {
        show:true,
        formatter: function (value) {
          return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }+' €');
        }
      }
    },
    yaxis: {
        labels: {
          formatter: function (value) {
            return value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        }
      },
    dataLabels: {
      enabled: false,
    },
    title: {
        text: 'Εσοδα ανα Εργο',
        align: 'center',
        floating: true
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + ' €';
        }
      }
    },
    legend: {
      show: false // 👈 Disable default legend
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
          horizontal: true,
        }
      },
    xaxis: {
      categories: [],
      labels: {
        show:true,
        style: {
          fontSize: '12px', // Adjust font size
        },
        maxHeight: 70, // You can set max height to make sure the chart does not overflow
        trim: true ,// Trim the label text if it exceeds a certain length
        formatter: function (value) {
          return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }+' €');
        }
      }
     
    },
    yaxis: {
        labels: {
          formatter: function (value) {
            return value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        }
      },
    dataLabels: {
      enabled: false,
    },
    title: {
        text: 'Εσοδα ανα Παραδοτέο',
        align: 'center',
        floating: true
    },
    legend: {
      show: false // 👈 Disable default legend
    },
    tooltip: {
        y: {
          formatter: function (value) {
            return Number(value).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) + ' €';
          }
        }
      }
  });
  



     const getParadotea = async() =>{
        try {
        const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
        const paraData = response.data;
        console.log("ParaData:",paraData);
        

        // Extract names and amounts
        const parNames = paraData.map(item => item.title);
        const parAmounts = paraData.map(item => item.ammount_total);

        // Update the chart options and series
        setChartOptions3(prevOptions => ({
            ...prevOptions,
            xaxis: {
                ...prevOptions.xaxis,
                categories: parNames
            }
        }));

        setChartSeries3([{ name: 'Ποσό', data: parAmounts }]);

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
            const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
            const ergaData = response.data;


            // Extract names and amounts
            const ergaNames = ergaData.map(item => item.name);
            const ergaAmounts = ergaData.map(item => item.ammount_total);
       

            // Update the chart options and series
            setChartOptions2(prevOptions => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: ergaNames
                }
            }));
    
            setChartSeries2([{ name: 'Ποσό', data: ergaAmounts }]);

            // Set the count for unique IDs if needed
            // const uniqueIds = [...new Set(ergaData.map(item => item.id))];
            // const uniqueIdsCount = uniqueIds.length;
            // setErga(uniqueIdsCount);
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  

    




  




    
    return (
    <Layout>
        <Welcome />

        <div className="grid">


<div className="col-12 xl:col-6 lg:col-3">
<div className="card" style={{ overflowY: 'auto', maxHeight: '400px' }} >
  <ApexCharts options={chartOptions2} series={chartSeries2} type='bar' height={350} />
  </div>
  </div>


  <div className="col-12 xl:col-6 lg:col-3">
<div className="card" style={{ overflowY: 'auto', maxHeight: '400px' }}>
  <ApexCharts options={chartOptions3} series={chartSeries3} type='bar' height={350} />
  </div>
  </div>


 


  

</div>
    </Layout>
  );
  
};

export default KpisDashboardnew;
