import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

import axios from 'axios';

import '../dashboard.css';
import '../kpisdashboard.css';
import apiBaseUrl from '../apiConfig';

import { ChartBudget, ChartErga, ChartErgabyCat, ChartErgabyStatus, ChartParByErgo, ChartYpoByTag, KpisCards } from '../components/Charts';

const Statistics = () => {




    
    const [chartSeries2, setChartSeries2] = useState([]);


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
        
        <KpisCards/>

        <div className="grid">


{/* <div className="col-12 xl:col-6 lg:col-3">
<div className="card" style={{ overflowY: 'auto', maxHeight: '400px' }} >
  <ApexCharts options={chartOptions2} series={chartSeries2} type='bar' height={350} />
  </div>
  </div> */}

  <div className="col-12 xl:col-6 lg:col-3">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '500px' }} >
        <ChartErga/>
    </div>
  </div>

  <div className="col-12 xl:col-6 lg:col-3">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '500px' }} >
        <ChartYpoByTag/>
    </div>
  </div>

  
  

  <div className="col-12 xl:col-6 lg:col-3">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '400px' }} >
        <ChartErgabyCat/>
    </div>
  </div>

  <div className="col-12 xl:col-6 lg:col-3">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '400px' }} >
        <ChartErgabyStatus/>
    </div>
  </div>

  
  <div className="col-12 xl:col-12 lg:col-12">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '700px' }} >
        <ChartParByErgo/>
    </div>
  </div>

  <div className="col-12 xl:col-12 lg:col-12">
    <div className="card" style={{ overflowY: 'auto', maxHeight: '700px' }} >
        <ChartBudget/>
    </div>
  </div>

  




  
  
  

</div>
    </Layout>
  );
  
};



export default Statistics;
