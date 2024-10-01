import React, { useEffect, useState } from 'react';

import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import { UseSelector, useSelector } from 'react-redux'
import apiBaseUrl from '../apiConfig';
const LineChartComponent = (props) =>{
const buildingname=props.buildingname;
const selectedMetric = props.selectedMetric;

const [buildingMetrics, setBuildingMetrics] = useState([]);


const [buildingNames, setBuildingNames] = useState(new Set());



const getLimitAnnotation =(metricname)=>{
    switch (metricname) {
      case 'PM10':
        return{
          max: 50 
          
      };
      case 'PM2.5':
        return{
          max:20
      };
      case 'SO2':
        return{
          max: 125
      };
      case 'CO':
        return{
          max:10
      };
      case 'NO2':
        return{
          max:40 
      };
      case 'TSP':
        return {
          min:50,
          
          max:80 
      };
      case 'TEQ PCDD/Fs':
        return {
          min:42,
          max:150 
      };
      case 'TEQ PCBS':
        return {
          min:10,
          max:40 
      };
      case 'ind PCBs':
        return {
          min:60,
          max:180 
      };
      case 'NO':
        return {
          min:10,
          max:50 
      };
      case 'OC/EC':
        return {
          min:5/0.5,
          max:20/2 
      };
      // Add more cases as needed
      default:
        return { max:0}; // Default label and class name
    }
  }
  

  // State for LineChart
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      categories: [],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5],
    },
    title: {
      text: 'Διαχρονική εξέλιξη',
      align: 'left',
    },
    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>';
      },
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    },

  });

  const [chartSeries, setChartSeries] = useState([]);


//get all data
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/buildingmetrics`, {timeout: 5000});
        const apiData = response.data;

        setBuildingMetrics(apiData);

        // const uniqueNamesSet = new Set(apiData.map((item) => item.metric.name));
        // setUniqueMetricNames(uniqueNamesSet);

        // const uniqueBuildingNames = Array.from(new Set(apiData.map((item) => item.building.name)));
        setBuildingNames(buildingname);

        // const uniqueYears = Array.from(new Set(apiData.map((item) => item.year)));
        // setUniqueYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);


//line chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartData = [];

        // buildingname.forEach((buildingName) => {


          const buildingData = buildingMetrics.filter(
            (item) => item.building.name === buildingname && item.metric.name === selectedMetric
          );

          chartData.push({
            name: buildingname,
            data: buildingData.map((item) => item.value),
          });
        // });

        setChartSeries(chartData);
   
        console.log(chartData);

        const limitAnnotation = getLimitAnnotation(selectedMetric);


        const uniqueYears = Array.from(new Set(buildingMetrics.map((item) => item.year)));


        const annotations = {
          yaxis: [
            {
              y: limitAnnotation.max,
              borderColor: '#ff0000',
              label: {
                borderColor: '#ff0000',
                style: {
                  color: '#fff',
                  background: '#ff0000'
                },
                text: `Max limit: ${limitAnnotation.max}`
              }
            }
          ]
        };
  
        // Add the min limit annotation only if it exists
        if (limitAnnotation.min !== undefined) {
          annotations.yaxis.push({
            y: limitAnnotation.min,
            borderColor: '#00ff00',
            label: {
              borderColor: '#00ff00',
              style: {
                color: '#fff',
                background: '#00ff00'
              },
              text: `Min limit: ${limitAnnotation.min}`
            }
          });
        }

        setChartOptions({
          ...chartOptions,
          xaxis: {
            categories: uniqueYears,
          },
          annotations,

        });


        

      } catch (error) {
        console.error('Error fetching data for LineChart:', error.message);
      }
    };

    fetchData();
  }, [selectedMetric, buildingNames]);


     
      // Your Welcome component code here
      return (
        <div className="box">
        <h1>Data List:</h1>
        <ApexCharts options={chartOptions} series={chartSeries} type='line' height={350} />
      </div>
      )
}
export default LineChartComponent