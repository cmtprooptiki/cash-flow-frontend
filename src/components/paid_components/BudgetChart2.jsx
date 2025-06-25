import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
import ApexCharts from 'react-apexcharts';

const BudgetChart2 = (props) => {
    const [paradotea, setIncomeParadotea] = useState([]);
    const [ekxorimena, setEkxorimena] = useState([]);
    const [incomeTim, setIncomeTim] = useState([]);
    const [daneia, setDaneia] = useState([]);
    const [doseis, setDoseis] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [chartData, setChartData] = useState({ categories: [], incomeSeries: [], goalsSeries: [] });

    const scenario = props.scenario;
    const year = props.selected_year

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await getDoseis();
        await getEkxorimena();
        await getIncomePar();
        await getIncomeTim();
        await getDaneia();
    };

    const getDoseis = async () => {
        const response = await axios.get(`${apiBaseUrl}/doseis`, { timeout: 5000 });
        setDoseis(response.data);
    };

    const getEkxorimena = async () => {
        const response = await axios.get(`${apiBaseUrl}/ek_tim`, { timeout: 5000 });
        setEkxorimena(response.data);
    };

    const getIncomePar = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_par`, { timeout: 5000 });
        setIncomeParadotea(response.data);
    };

    const getIncomeTim = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_tim`, { timeout: 5000 });
        const data = response.data;

        const uniqueTimologia = [];
        const seenTimologiaIds = new Set();

        data.forEach((item) => {
            if (!seenTimologiaIds.has(item.timologia.id)) {
                seenTimologiaIds.add(item.timologia.id);
                uniqueTimologia.push(item);
            }
        });
        setIncomeTim(uniqueTimologia);
    };

    const getDaneia = async () => {
        const response = await axios.get(`${apiBaseUrl}/daneia`, { timeout: 5000 });
        setDaneia(response.data);
    };
    const filterByYear = (data, year) => {
        return data.filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === year;
        });
      };

    useEffect(() => {
        let combinedData2 = [
            ...ekxorimena
                .filter((item) => item.status_bank_paid === 'no')
                .map((item) => ({ date: new Date(item.bank_estimated_date), income: Number(item.bank_ammount), type: 'Bank', id: item.id })),
            ...ekxorimena
                .filter((item) => item.status_customer_paid === 'no')
                .map((item) => ({ date: new Date(item.cust_estimated_date), income: Number(item.customer_ammount), type: 'Customer', id: item.id })),
            ...paradotea.map((item) => ({ date: new Date(item.paradotea.estimate_payment_date), income: Number(item.paradotea.ammount_total), type: 'Paradotea', id: item.id })),
            ...incomeTim
                .filter((item) => item.timologia.status_paid === 'no')
                .map((item) => ({ date: new Date(item.timologia.actual_payment_date), income: Number(item.timologia.ammount_of_income_tax_incl), type: 'Timologia', id: item.id })),
            ...daneia
                .filter((item) => item.status === 'no')
                .map((item) => ({ date: new Date(item.payment_date), income: Number(item.ammount), type: 'Daneia', id: item.id })),
            ...doseis
                .filter((item) => item.status === 'no')
                .map((item) => ({ date: new Date(item.estimate_payment_date), income: Number(item.ammount), type: 'doseis', id: item.id })),
        ];

        // setCombinedData(combinedData2);
        // console.log("year,",combinedData2)
        combinedData2 = filterByYear(combinedData2, year);
        // setCombinedData(combinedData2);
        console.log("Filtered for year 2025:", combinedData2);

        // Prepare chart data
        const aggregatedData = {};

        combinedData2.forEach((item) => {
            const monthYear = item.date.toLocaleString('default', { year: 'numeric', month: 'short' });
            if (!aggregatedData[monthYear]) {
                aggregatedData[monthYear] = {
                    income: 0,
                    goals: 0,
                };
            }

            if (item.type !== 'doseis') {
                aggregatedData[monthYear].income += item.income;
            } else {
                aggregatedData[monthYear].goals += item.income;
            }
        });

        const sortedKeys = Object.keys(aggregatedData).sort((a, b) => new Date(a) - new Date(b));
        const categories = sortedKeys;
        const incomeSeries = sortedKeys.map((key) => aggregatedData[key].income);
        const goalsSeries = sortedKeys.map((key) => aggregatedData[key].goals);

        setChartData({
            categories,
            incomeSeries,
            goalsSeries,
        });
    }, [paradotea, ekxorimena, incomeTim, daneia, doseis, scenario]);

    // Calculate differences between income and expenses
    const differences = chartData.categories.map((month, index) => {
        const income = chartData.incomeSeries[index] || 0;
        const goals = chartData.goalsSeries[index] || 0;
        let difference = Number(income - goals);
    
        // Format the difference to include '+' for positive values and '-' for negative values
        const formattedDifference = (difference > 0 ? '+' : '') + 
        Number(difference).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' €'; // Format the difference with 2 decimal places and add "€"
    
        // Set color based on the difference: green for positive, red for negative
        const labelColor = difference > 0 ? 'green' : (difference < 0 ? 'red' : '#000'); // Green for positive, Red for negative, Black for zero
    
        return {
            x: month, // Position of the label on the X-axis (category name)
            y: (income + goals) / 2, // Position between the two bars on the Y-axis
            label: {
                text: `${formattedDifference}`, // Display the formatted difference
                style: {
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: [labelColor], // Set the color dynamically based on the difference
                },
            },
            marker: {
                size: 0, // Invisible marker (no point displayed)
            },
        };
    });

    // Updated chart options and series configuration
    const state = {
        series: [
            {
                name: 'Έσοδα',
                data: chartData.incomeSeries,
            },
            {
                name: 'Έξοδα',
                data: chartData.goalsSeries,
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 430,
            },
            colors: ['#28a745', '#ff4d4f'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                },
            },
            title: {
                text: 'Μηνιαίος Προϋπολογισμός',
                align: 'center',
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['#fff'],
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            xaxis: {
                categories: chartData.categories,
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return Number(value).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }) + ' €';
                    },
                },
            },
            annotations: {
                points: differences, // Display the differences as annotations
            },
        },
    };

    return (
        <div>
            <ApexCharts options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default BudgetChart2;