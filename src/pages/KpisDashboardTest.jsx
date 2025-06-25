import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import apiBaseUrl from '../apiConfig';
import { ChartParByErgo } from '../components/Charts';

const KpisDashboardTest = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
          chart: {
            type: 'bar',
            height: 430,
            stacked: true,
            toolbar: { show: false }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '30%', // try 25%, 20%, etc.
              dataLabels: {
                position: 'top',
              },
            }
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['#fff'],
            },
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
          },
          xaxis: {
            categories: [],
            title: {
              text: 'Έργα (erga.name)',
            },
          },
          yaxis: {
            title: {
              text: 'Ποσό με ΦΠΑ (€)',
            },
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
            show:false,
            position: 'bottom',
            labels: {
              colors: '#000',
            },
          },
        },
      });
    




     useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/paradotea`, { timeout: 5000 });
      const data = response.data;

      // Step 1: Get unique project names
      const projectNames = [...new Set(data.map(item => item.erga.name))];

      // Step 2: Get all deliverables
      const deliverables = data.map(item => ({
        title: `${item.title} [${item.id}]`,
        ergaName: item.erga.name,
        amount: parseFloat(item.ammount_total)
      }));

      // Step 3: Build a series for each deliverable
      const series = deliverables.map(deliv => {
        const dataRow = projectNames.map(name =>
          name === deliv.ergaName ? deliv.amount : null
        );
        return {
          name: deliv.title,
          data: dataRow
        };
      });

      setChartData(prev => ({
        ...prev,
        series: series,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: projectNames // ✅ one per project only!
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }) {
              const value = series[seriesIndex][dataPointIndex];
              const deliv = deliverables[seriesIndex];
              return `
                <div style="padding:8px">
                  <strong>Έργο:</strong> ${deliv.ergaName}<br/>
                  <strong>Παραδοτέο:</strong> ${deliv.title}<br/>
                  <strong>Ποσό:</strong> ${value?.toLocaleString()} €
                </div>
              `;
            }
          }
        }
      }));
    } catch (error) {
      console.error('Failed to fetch and process paradotea:', error);
    }
  };

  fetchData();
}, []);
    
      return (


        <div className="card"  style={{ maxHeight: '600px', overflowY: 'auto' }} >
          <h3>Κατανομή Παραδοτέων ανά Έργο</h3>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={chartData.series.length * 50} // less aggressive multiplier
            />

            <ChartParByErgo />
        </div>


      );
    };
    
export default KpisDashboardTest;
