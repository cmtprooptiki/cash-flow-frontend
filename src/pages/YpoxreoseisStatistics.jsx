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


const YpoxreoseisStatistics = () =>
{
    const [chartSeries2, setChartSeries2] = useState([]);
    const [chartSeries3, setChartSeries3] = useState([]);
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const [tags, setTags] = useState([])
    const [chartOptions4, setChartOptions4] = useState([])
    const [chartSeries4, setChartSeries4] = useState([])

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError} = useSelector((state=>state.auth));

    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' }); // "April"
    const currentYear = now.getFullYear();

    const currentMonthAndYear = `${monthName} of ${currentYear}`; // "April of 2025"


    useEffect(()=>{
            
        dispatch(getMe());
        },[dispatch]);
      
    
        useEffect(()=>{
            if(isError){
                navigate("/");
            }
        },[isError,navigate]);

         useEffect(()=>{
                getYpoxreoseis()
                getTags()
            },[]);

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    
    const [paidVsUnpaidSeries, setPaidVsUnpaidSeries] = useState([]);
    const [paidVsUnpaidOptions, setPaidVsUnpaidOptions] = useState({
        chart: {
            type: 'pie',
            width: 380,
                    height: 350,
                },
                labels: ['Πληρωμένα', 'Απλήρωτα'],
                colors: ['#28a745', '#dc3545'], // Green for paid, Red for unpaid
                title: {
                    text: 'Ποσοστό Πληρωμένων Δόσεων',
                    align: 'center',
                    style: {
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (value) {
                            return value.toLocaleString('el-GR', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            });

        const [tagPercentageOptions, setTagPercentageOptions] = useState({});
        const [tagPercentageSeries, setTagPercentageSeries] = useState([]);
        const [tagOwedOptions, setTagOwedOptions] = useState({});
        const [tagOwedSeries, setTagOwedSeries] = useState([]);

        const getTags = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/ypoquery`, { timeout: 5000 });
                const tags_data = response.data;
        
                const tagCounts = {};
                const tagAmounts = {};
                let totalTagsUsed = 0;
        
                tags_data.forEach(item => {
                    const totalOwed = Number(item.ypoxreoseis.total_owed_ammount || 0);
                    item.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                        tagAmounts[tag] = (tagAmounts[tag] || 0) + totalOwed;
                        totalTagsUsed++;
                    });
                });
        
                // Step 1: Combine and sort tag data by owed amount descending
                const tagDataArray = Object.keys(tagCounts).map(tag => ({
                    tag,
                    percentage: (tagCounts[tag] / totalTagsUsed) * 100,
                    owed: tagAmounts[tag]
                }));
        
                tagDataArray.sort((a, b) => b.owed - a.owed); // Sort descending by owed amount

                const tagDataArray2 = Object.keys(tagCounts).map(tag => ({
                    tag,
                    percentage: (tagCounts[tag] / totalTagsUsed) * 100,
                    owed: tagAmounts[tag]
                }));
        
                tagDataArray2.sort((a, b) => b.percentage - a.percentage); // Sort descending by owed amount
        
                // Step 2: Extract sorted arrays
                const labels = tagDataArray.map(item => item.tag);
                const labels2 = tagDataArray.map(item => item.tag);
                const formattedPercents = tagDataArray2.map(item => parseFloat(item.percentage.toFixed(2)));
                const owedAmounts = tagDataArray.map(item => parseFloat(item.owed.toFixed(2)));
        
                // Chart height scaling
                const chartHeight = labels.length * 25;
        
                // Chart 1 – Percentage Usage
                setTagPercentageOptions({
                    chart: {
                        type: 'bar',
                        height: chartHeight,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            borderRadius: 4,
                            distributed: true,
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: val => val.toFixed(1) + '%'
                    },
                    xaxis: {
                        categories: labels,
                        labels: {
                            formatter: val => val.toFixed(1) + '%'
                        }
                    },
                    title: {
                        text: 'Ποσοστά χρήσης Tags στις Υποχρεώσεις',
                        align: 'center',
                        style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    tooltip: {
                        y: {
                            formatter: val => val.toFixed(2) + '%'
                        }
                    },
                    colors: ['#00B8A9', '#F6416C', '#FFDE7D', '#928A97', '#6A2C70']
                });
                setTagPercentageSeries([{ name: 'Χρήση (%)', data: formattedPercents }]);
        
                // Chart 2 – Total Amounts per Tag
                setTagOwedOptions({
                    chart: {
                        type: 'bar',
                        height: chartHeight,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            borderRadius: 4,
                            distributed: true,
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: val =>
                            val.toLocaleString('el-GR', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0
                            })
                    },
                    xaxis: {
                        categories: labels,
                        labels: {
                            formatter: val =>
                                val.toLocaleString('el-GR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0
                                })
                        }
                    },
                    title: {
                        text: 'Σύνολο Οφειλών ανά Tag',
                        align: 'center',
                        style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    tooltip: {
                        y: {
                            formatter: val =>
                                val.toLocaleString('el-GR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0
                                })
                        }
                    },
                    colors: ['#00B8A9', '#F6416C', '#FFDE7D', '#928A97', '#6A2C70']
                });
                setTagOwedSeries([{ name: 'Οφειλές (€)', data: owedAmounts }]);
        
            } catch (error) {
                console.error('Error fetching tag data:', error);
            }
        };

        const [stackedBarSeries, setStackedBarSeries] = useState([]);
        const [stackedBarOptions, setStackedBarOptions] = useState({});

        
        const getYpoxreoseis = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/ypoquery`, { timeout: 5000 });
                const timData = response.data;
        
                setYpoxreoseis([...new Set(timData.map(item => item.id))].length);
        
                // For pie chart
                const paid = timData.reduce((sum, item) => sum + Number(item.ypoxreoseis.Paid_doseis_ammount || 0), 0);
                const total = timData.reduce((sum, item) => sum + Number(item.ypoxreoseis.total_owed_ammount || 0), 0);
                const unpaid = total - paid;
                setPaidVsUnpaidSeries([paid, unpaid]);
        
                // --- Build stacked bar data ---
                const providerMap = {};
        
                timData.forEach(item => {
                    const provider = item.ypoxreoseis.provider || 'Χωρίς Όνομα';
                    const totalOwed = Number(item.ypoxreoseis.total_owed_ammount || 0);
                    const paid = Number(item.ypoxreoseis.Paid_doseis_ammount || 0);
                    const unpaid = Number(item.ypoxreoseis.NotPaid_doseis_ammount || 0);
        
                    if (!providerMap[provider]) {
                        providerMap[provider] = { paid: 0, unpaid: 0 };
                    }
        
                    providerMap[provider].paid += paid;
                    providerMap[provider].unpaid += unpaid;
                });
        
                const providerNames = Object.keys(providerMap);
                const paidPercentages = [];
                const unpaidPercentages = [];

                const paidList = []
                const unpaidList = []
                
                providerNames.forEach(provider => {
                    const data = providerMap[provider];
                    const total = data.paid + data.unpaid;
                    const paidPct = total > 0 ? (data.paid / total) * 100 : 0;
                    const unpaidPct = total > 0 ? (data.unpaid / total) * 100 : 0;
        
                    paidPercentages.push(parseFloat(paidPct.toFixed(2)));
                    unpaidPercentages.push(parseFloat(unpaidPct.toFixed(2)));
                    paidList.push(data.paid)
                    unpaidList.push(data.unpaid)
                });
        
                setStackedBarOptions({
                    chart: {
                        type: 'bar',
                        stacked: true,
                        height: providerNames.length * 40,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: '50%',
                        }
                    },
                    xaxis: {
                        categories: providerNames,
                        max: 100, // <- Force max to 100%
                        title: {
                            text: 'Ποσοστό Οφειλών (%)'
                        },
                        labels: {
                            formatter: val => val.toFixed(0) + '%'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function (val, { seriesIndex, dataPointIndex }) {
                                const amount =
                                    seriesIndex === 0
                                        ? paidList[dataPointIndex]
                                        : unpaidList[dataPointIndex];
                    
                                return amount.toLocaleString('el-GR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: val => val.toFixed(1) + '%'
                    },
                    title: {
                        text: 'Οφειλές ανά Προμηθευτή εως τον μήνα '+currentMonthAndYear,
                        align: 'center'
                    },
                    colors: ['#28a745', '#dc3545'],
                    legend: {
                        position: 'top'
                    }
                });
        
                setStackedBarSeries([
                    {
                        name: 'Πληρωμένα',
                        data: paidPercentages
                    },
                    {
                        name: 'Απλήρωτα',
                        data: unpaidPercentages
                    }
                ]);
        
            } catch (error) {
                console.error('Error fetching ypoxreoseis data:', error);
            }
        };

        return (
            <Layout>
              <Welcome />
          
              <div className="grid">
                {/* Top Row - Card 1 */}
                <div className="col-12 xl:col-6 lg:col-6">
                  <div className="card">
                    <ApexCharts
                      options={paidVsUnpaidOptions}
                      series={paidVsUnpaidSeries}
                      type="pie"
                      height={350}
                    />
                  </div>
                </div>
          
                {/* Top Row - Card 2 */}
                <div className="col-12 xl:col-6 lg:col-6">
                  <div className="card" style={{ maxHeight: '410px', overflowY: 'auto', minWidth: '700px' }}>
                    {stackedBarOptions?.chart ? (
                      <ApexCharts
                        options={stackedBarOptions}
                        series={stackedBarSeries}
                        type="bar"
                        height={stackedBarOptions.chart.height}
                      />
                    ) : (
                      <p>Φόρτωση δεδομένων...</p>
                    )}
                  </div>
                </div>
          
                {/* Bottom Row - Card 3 */}
                <div className="col-12 xl:col-6 lg:col-6">
                  <div className="card">
                    {tagPercentageOptions?.chart ? (
                      <ApexCharts
                        options={tagPercentageOptions}
                        series={tagPercentageSeries}
                        type="bar"
                        height={tagPercentageOptions.chart.height}
                      />
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
          
                {/* Bottom Row - Card 4 */}
                <div className="col-12 xl:col-6 lg:col-6">
                  <div className="card" style={{ minWidth: '700px' }}>
                    {tagOwedOptions?.chart ? (
                      <ApexCharts
                        options={tagOwedOptions}
                        series={tagOwedSeries}
                        type="bar"
                        height={tagOwedOptions.chart.height}
                      />
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              </div>
            </Layout>
          );
        

}

export default YpoxreoseisStatistics;
