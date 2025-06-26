import React, { useEffect, useState ,useRef} from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import apiBaseUrl from '../apiConfig';
// import ApexCharts from 'apexcharts';
import { TabView,TabPanel } from 'primereact/tabview';
import BudgetChart from './paid_components/BudgetChart';
import BudgetChart2 from './paid_components/BudgetChart2';
import { Calendar } from 'primereact/calendar';

import { ReactComponent as ProjectIcon } from '../icons/projecticon.svg'; // Import the SVG as a React component
import { ReactComponent as CustomerIcon } from '../icons/customericon.svg'; // Import the SVG as a React component
import { ReactComponent as DeliverablesIcon } from '../icons/deliverablesicon2.svg'; // Import the SVG as a React component
import { ReactComponent as InvoiceIcon } from '../icons/invoice.svg'; // Import the SVG as a React component
import {ReactComponent as InstallmentsIcon } from '../icons/installments.svg';
import {ReactComponent as EktimIcon } from '../icons/ektim.svg';
import {ReactComponent as LoanIcon } from '../icons/loand.svg';
import {ReactComponent as BudgetIcon } from '../icons/budget.svg';





export const ChartParByErgo = () => {
    const [allData, setAllData] = useState({ categories: [], series: [] });
  const [visibleCount, setVisibleCount] = useState(10);
  const titleMapRef = useRef({});
  const chartRef = useRef();
  const ITEMS_PER_BATCH = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/erga-paradotea`);
        const groupedData = res.data;

        const categories = groupedData.map(e => e.name);

        const allTitles = [...new Set(
          groupedData.flatMap(e =>
            e.deliverables.map(d => `${d.title} [${d.id}]`)
          )
        )];

        const series = allTitles.map(title => ({
          name: title,
          data: groupedData.map(ergo => {
            const match = ergo.deliverables.find(
              d => `${d.title} [${d.id}]` === title
            );
            return match ? parseFloat(match.ammount_total) : 0;
          })
        }));

        // Build titleMap for tooltips
        const titleMap = {};
        allTitles.forEach((title) => {
          titleMap[title] = {};
          groupedData.forEach(ergo => {
            const match = ergo.deliverables.find(
              d => `${d.title} [${d.id}]` === title
            );
            if (match) {
              titleMap[title][ergo.name] = match;
            }
          });
        });

        titleMapRef.current = titleMap;
        setAllData({ categories, series });
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = chartRef.current;
      if (
        container &&
        container.scrollTop + container.clientHeight >= container.scrollHeight - 100
      ) {
        setVisibleCount(prev =>
          Math.min(prev + ITEMS_PER_BATCH, allData.categories.length)
        );
      }
    };

    const container = chartRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [allData.categories.length]);

  const slicedCategories = allData.categories.slice(0, visibleCount);
  const slicedSeries = allData.series.map(s => ({
    name: s.name,
    data: s.data.slice(0, visibleCount)
  }));

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      animations: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '30%'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: slicedCategories,
      title: { text: 'Έργα' }
    },
    yaxis: {
      title: { text: 'Ποσό με ΦΠΑ (€)' }
    },
tooltip: {
  shared: false,
  intersect: true,
  custom: function({ seriesIndex, dataPointIndex, w }) {
    try {
      const projectName = w.config.xaxis.categories[dataPointIndex]; // ✅ use exact slice
      const deliverableKey = w.globals.seriesNames[seriesIndex];     // series name (e.g., "Παραδοτέο 1 [42]")
      const value = w.globals.series[seriesIndex][dataPointIndex];   // number (ammount_total)

      const deliverable = titleMapRef.current?.[deliverableKey]?.[projectName];

      return `
        <div style="padding:8px">
          <strong>Έργο:</strong> ${projectName}<br/>
          <strong>Παραδοτέο:</strong> ${deliverable?.title || '-'}<br/>
          <strong>Ποσό:</strong> ${(value || 0).toLocaleString('el-GR')} €
        </div>
      `;
    } catch (err) {
      console.error("Tooltip error:", err);
      return `<div style="padding:8px">Σφάλμα στην εμφάνιση του tooltip</div>`;
    }
  }
},
    legend: { show: false }
  };

  return (
    <div>
      <h3>Κατανομή Παραδοτέων ανά Έργο</h3>
      <div
        ref={chartRef}
        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}
      >
        <ReactApexChart
          options={options}
          series={slicedSeries}
          type="bar"
          height={Math.max(500, slicedCategories.length * 30)}
        />
        {visibleCount < allData.categories.length && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <em>Φόρτωση περισσότερων...</em>
          </div>
        )}
      </div>
    </div>
  );
};






// export const ChartParByErgo = () => {
//     const [chartData, setChartData] = useState({
//         series: [],
//         options: {
//           chart: {
//             type: 'bar',
//             height: 430,
//             stacked: true,
//             toolbar: { show: false }
//           },
//           plotOptions: {
//             bar: {
//               horizontal: true,
//               barHeight: '30%', // try 25%, 20%, etc.
//               dataLabels: {
//                 position: 'top',
//               },
//             }
//           },
//           dataLabels: {
//             enabled: true,
//             offsetX: -6,
//             style: {
//               fontSize: '12px',
//               colors: ['#fff'],
//             },
//           },
//           stroke: {
//             show: true,
//             width: 1,
//             colors: ['#fff'],
//           },
//           xaxis: {
//             categories: [],
//             title: {
//               text: 'Έργα (erga.name)',
//             },
//           },
//           yaxis: {
//             title: {
//               text: 'Ποσό με ΦΠΑ (€)',
//             },
//           },

//           tooltip: {
//             y: {
//               formatter: function (value) {
//                 return Number(value).toLocaleString('en-US', {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2
//                 }) + ' €';
//               }
//             }
//           },
//           legend: {
//             show:false,
//             position: 'bottom',
//             labels: {
//               colors: '#000',
//             },
//           },
//         },
//       });
    




//      useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${apiBaseUrl}/paradotea`, { timeout: 5000 });
//       const data = response.data;
      

//       // Step 1: Get unique project names
//       const projectNames = [...new Set(data.map(item => item.erga.name))];

//       // Step 2: Get all deliverables
//       const deliverables = data.map(item => ({
//         title: `${item.title} [${item.id}]`,
//         ergaName: item.erga.name,
//         amount: parseFloat(item.ammount_total)
//       }));

//       // Step 3: Build a series for each deliverable
//       const series = deliverables.map(deliv => {
//         const dataRow = projectNames.map(name =>
//           name === deliv.ergaName ? deliv.amount : null
//         );
//         return {
//           name: deliv.title,
//           data: dataRow
//         };
//       });

//       setChartData(prev => ({
//         ...prev,
//         series: series,
//         options: {
//           ...prev.options,
//           xaxis: {
//             ...prev.options.xaxis,
//             categories: projectNames // ✅ one per project only!
//           },
//           tooltip: {
//             custom: function ({ series, seriesIndex, dataPointIndex }) {
//               const value = series[seriesIndex][dataPointIndex];
//               const deliv = deliverables[seriesIndex];
//               return `
//                 <div style="padding:8px">
//                   <strong>Έργο:</strong> ${deliv.ergaName}<br/>
//                   <strong>Παραδοτέο:</strong> ${deliv.title}<br/>
//                   <strong>Ποσό:</strong> ${value?.toLocaleString()} €
//                 </div>
//               `;
//             }
//           }
//         }
//       }));
//     } catch (error) {
//       console.error('Failed to fetch and process paradotea:', error);
//     }
//   };

//   fetchData();
// }, []);
    
//       return (


//         <div  >
//           <h3>Κατανομή Παραδοτέων ανά Έργο</h3>
//           <ReactApexChart
//             options={chartData.options}
//             series={chartData.series}
//             type="bar"
//             height={chartData.series.length * 50} // less aggressive multiplier
//             />
//         </div>


//       );
//     };








    export const ChartErga = () => {

        const [chartSeries2,setChartSeries2] = useState([]);

        useEffect(()=>{
            getErga()

        },[]);
    
        const formatCurrency = (value) => {
          return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
    

    //pie chart 

      // State for BarChart
      const [chartOptions2, setChartOptions2] = useState({
        chart: {
            type: 'bar',
            height: 450,
            toolbar: { show: false },
          },
          plotOptions: {
            bar: {
              barHeight: '80%',
              distributed: true,
              borderRadius: 4,
              borderRadiusApplication: 'end',
              horizontal: true,
            },
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
            },
            style: {
                fontSize: '11px',
              },
              trim: false,
          }
        },
        yaxis: {
            labels: {
              formatter: function (value) {
                return value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              },
              style: {
                fontSize: '12px',
              },
              trim: false,
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
          const response = await axios.get(`${apiBaseUrl}/erga`, { timeout: 5000 });
          const ergaData = response.data;
      
          // Sort the data in descending order by 'ammount_total'
          const sortedErga = ergaData.sort((a, b) => b.ammount_total - a.ammount_total);
      
          // Extract names and amounts
          const ergaNames = sortedErga.map(item => item.name);
          const ergaAmounts = sortedErga.map(item => item.ammount_total);
      
          // Update the chart options and series
          setChartOptions2(prevOptions => ({
            ...prevOptions,
            xaxis: {
              ...prevOptions.xaxis,
              categories: ergaNames
            }
          }));
      
          setChartSeries2([{ name: 'Ποσό', data: ergaAmounts }]);
      
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
    
      

        return (
  
    
            <div >

                <ReactApexChart options={chartOptions2} series={chartSeries2} type='bar'  height={Math.max(450, chartSeries2[0]?.data.length * 30)} />

            </div>
      );
      
    };

    export const ChartErgabyCat = ()=>{

        const [chartSeries, setChartSeries] = useState([]);
        

        const [chartOptions, setChartOptions] = useState({
            chart: {
              type: 'pie',
              width: 380,
              height:350,
            },
            labels: [],
            title: {
                text: 'Πλήθος Έργων ανά κατηγορία', // Title of the chart
                align: 'center', // Aligning the title to the center
                style: {
                  fontFamily:'Helvetica, Arial, sans-serif',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                },
              },
           
          });

          useEffect(()=>{
            getErga();

          },[])


          const getErga = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
                const ergaData = response.data;
    
    
        // Count the number of projects for each erga_category.name
        //Pie categories
        const categoryCounts = ergaData.reduce((acc, item) => {
            const categoryName = item.erga_category ? item.erga_category.name : 'Χωρίς Κατηγορία';
            if (!acc[categoryName]) {
              acc[categoryName] = 0;
            }
            acc[categoryName] += 1; // Increment count for each project in the category
            return acc;
          }, {});
    
          // Prepare data for the chart
          const ergaNames2 = Object.keys(categoryCounts); // erga_category.name as labels
          const ergaCounts2 = Object.values(categoryCounts); // count of projects as data
    
          // console.log("Erga Categories:", ergaNames2);
          // console.log("Project Counts:", ergaCounts2);
    
          // Update the chart options and series
          setChartOptions(prevOptions => ({
            ...prevOptions,
            labels: ergaNames2
          }));
    
          setChartSeries(ergaCounts2);    
        
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        return(<>
            <ReactApexChart
                options={chartOptions} 
                series={chartSeries} 
                type="pie" 
                height={350} 
            /> 
        
        </>);
    };
    
    export const ChartErgabyStatus = ()=>{
        const [chartSeries_p1, setChartSeriesP1] = useState([]);
        

        const [chartOptionsP1, setChartOptionsP1] = useState({
            chart: {
              type: 'pie',
              width: 380,
              height:350,
            },
            labels: [],
            title: {
                text: 'Πλήθος Έργων ανα Κατάσταση', // Title of the chart
                align: 'center', // Aligning the title to the center
                style: {
                  fontFamily:'Helvetica, Arial, sans-serif',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                },
              },
           
          });

        useEffect(()=>{
            getErga();
        },[])

        const getErga = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
                const ergaData = response.data;
    
          
          //Pie data for status count erga
    
           // Count the number of projects for each erga_category.name
            const categoryCountsStatus = ergaData.reduce((acc, item) => {
            const categoryNameStatus = item.status ? item.status : 'Χωρίς Κατάσταση';
            if (!acc[categoryNameStatus]) {
                acc[categoryNameStatus] = 0;
            }
            acc[categoryNameStatus] += 1; // Increment count for each project in the category
            return acc;
            }, {});
    
            // Prepare data for the chart
            const ergaNamesStatus = Object.keys(categoryCountsStatus); // erga_category.name as labels
            const ergaCountsStatus = Object.values(categoryCountsStatus); // count of projects as data
        
            // console.log("Erga Categories:", ergaNamesStatus);
            // console.log("Project Counts:", ergaCountsStatus);
        
            // Update the chart options and series
            setChartOptionsP1(prevOptions => ({
            ...prevOptions,
            labels: ergaNamesStatus
            }));
        
            setChartSeriesP1(ergaCountsStatus);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        return(<>
            <ReactApexChart
                options={chartOptionsP1} 
                series={chartSeries_p1} 
                type="pie" 
                height={350} 
            />
        </>)
    }

    export const ChartYpoByTag = () => {
        const [chartSeries4, setChartSeries4] = useState([]);
      
        const [chartOptions4, setChartOptions4] = useState({
          chart: {
            type: 'bar',
            height: 450,
            toolbar: { show: false },
          },
          plotOptions: {
            bar: {
              barHeight: '80%',
              distributed: true,
              borderRadius: 4,
              borderRadiusApplication: 'end',
              horizontal: true,
            },
          },
          xaxis: {
            categories: [], // this controls Y-axis labels when horizontal: true
            labels: {
              style: {
                fontSize: '11px',
              },
              trim: false,
            },
          },
          yaxis: {
            labels: {
              show: true,
              style: {
                fontSize: '12px',
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          title: {
            text: 'Σύνολο Υποχρεώσεων ανα Tag',
            align: 'center',
            floating: true,
          },
          tooltip: {
            enabled: true,
            y: {
              formatter: (val) => `${val} υποχρεώσεις`,
            },
          },
        });
      
        useEffect(() => {
          getTags();
        }, []);
      
        const getTags = async () => {
            try {
              const response = await axios.get(`${apiBaseUrl}/ypoquery`, { timeout: 5000 });
              const tags_data = response.data;
          
              const tagCounts = {};
          
              tags_data.forEach(item => {
                item.tags.forEach(tag => {
                  tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
              });
          
              // Convert to array and sort descending
              const sortedEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
          
              const labels = sortedEntries.map(([tag]) => tag);
              const counts = sortedEntries.map(([_, count]) => count);
          
              setChartOptions4(prev => ({
                ...prev,
                xaxis: {
                  ...prev.xaxis,
                  categories: labels,
                },
              }));
          
              setChartSeries4([{ name: 'Πλήθος', data: counts }]);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
          
      
        return (
          <>
            <ReactApexChart
              options={chartOptions4}
              series={chartSeries4}
              type="bar"
              height={Math.max(450, chartSeries4[0]?.data.length * 30)}
            />
          </>
        );
      };



export const ChartBudget = () =>{
    const [date, setDate] = useState(new Date().getFullYear());

    // useEffect(()=>{

    // },[date])

    return(<>

        <div className=" flex justify-content-center">
        <Calendar
            value={new Date(date, 0)} // Convert year back to Date for the Calendar
            onChange={(e) => setDate(e.value.getFullYear())}
            view="year"
            dateFormat="yy"
            />
        </div>
        <TabView>
        <TabPanel header="Προβολή 1">
            <BudgetChart key={date} selected_year={date}/>
        </TabPanel>
        <TabPanel header = "Προβολή 2">
            <BudgetChart2 key={date} selected_year={date}></BudgetChart2>
        </TabPanel>
        </TabView>
    </>)
}

export const KpisCards =()=>{

    const[budget, setBudget] = useState(0.0);
    const[budgetDate, setBudgetDate] = useState(null);
    
    const [paradotea, setParadotea] = useState([]);
    const [timPar,setTimologimenPar]= useState([]);
    
    const [erga,setErga]= useState([]);
    const [customer,setCustomer] = useState([]);
    const [timologia,setTimologia] = useState([]);
    const [ektim,setEkxorimena] = useState([]);

    const [daneia,setDaneia]=useState([]);
    const [daneiareceived,setReceived]= useState([]);
    const [daneiaunreceived,setUnreceived]=useState([]);


    const [doseis,setDoseis] = useState([]);
    const [doseisTotal,setTotalDoseisAmmount] = useState([]);


    const [paidCount,setPaidTimologia]= useState([]);
    const [unpaidCount,setUnpaidTimologia]=useState([]);

    useEffect(()=>{
        getBudget()
        getParadotea()
        getErga()
        getCustomer()
        getTimologia()
        getEkxorimenaTimologia()
        getDaneia()
        getDoseis()
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


        const getBudget = async() =>{
            try {
        
            const response = await axios.get(`${apiBaseUrl}/budget`, {timeout: 5000});
            const budgetData = response.data;
        
            
        
            setBudget(budgetData[0].ammount);
            setBudgetDate(budgetData[0].date);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        }

        const getParadotea = async() =>{
            try {
            const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
            const paraData = response.data;
            // console.log("ParaData:",paraData);
            
            const timPar = paraData.filter(item => item.timologia_id !== null).length;
    
            // Extract unique ids
            const uniqueIds = [...new Set(paraData.map(item => item.id))];
            
            // Get the total count of unique ids
            const uniqueIdsCount = uniqueIds.length;
            // console.log("Total Count of Unique Pardotea Ids:", uniqueIdsCount);
            setParadotea(uniqueIdsCount);
            setTimologimenPar(timPar);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }


        const getErga = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
                const ergaData = response.data;
    
                // Set the count for unique IDs if needed
                const uniqueIds = [...new Set(ergaData.map(item => item.id))];
                const uniqueIdsCount = uniqueIds.length;
                setErga(uniqueIdsCount);
        
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getCustomer = async() =>{
            try {
    
            const response = await axios.get(`${apiBaseUrl}/customer`, {timeout: 5000});
            const custData = response.data;
    
            const uniqueIds= [...new Set(custData.map(item => item.id))];
            const uniqueIdsCount = uniqueIds.length;
    
            // console.log("Unique Customer names:",uniqueIdsCount);
            setCustomer(uniqueIdsCount);
        
    
            // Assuming you have a state setter like setErga defined somewhere
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }

        const getTimologia = async() =>{
    
            try {
                const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
                const timData = response.data;
                const uniqueIds= [...new Set(timData.map(item => item.id))];
                const uniqueIdsCount = uniqueIds.length;
    
    
                // Count records where status_paid == 'yes'
                const paidCount = timData.filter(item => item.status_paid === 'yes').length;
    
                // Count records where status_paid == 'no'
                const unpaidCount = timData.filter(item => item.status_paid === 'no').length;
        
                // console.log("Unique Customer names:",uniqueIdsCount);         
               
                setTimologia(uniqueIdsCount);
                setPaidTimologia(paidCount);  // Set paid invoices count
                setUnpaidTimologia(unpaidCount); // Set unpaid invoices count
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }

        const getEkxorimenaTimologia = async() =>{
            try {
      
            const response = await axios.get(`${apiBaseUrl}/ek_tim`, {timeout: 5000});
            const ektimData = response.data;
      
            const uniqueIds= [...new Set(ektimData.map(item => item.id))];
            const uniqueIdsCount = uniqueIds.length;
      
            // console.log("Unique ektimi names:",uniqueIdsCount);
            setEkxorimena(uniqueIdsCount);
        
      
            // Assuming you have a state setter like setErga defined somewhere
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }

        const getDaneia = async() =>{
            try {
        
            const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000});
            const daneiaData = response.data;
        
            const uniqueIds= [...new Set(daneiaData.map(item => item.id))];
            const uniqueIdsCount = uniqueIds.length;
        
            // console.log("Unique daneiaData names:",uniqueIdsCount);
        
            const unreiceived=daneiaData.filter(item => item.status === 'no').length
            const reiceived=daneiaData.filter(item => item.status === 'yes').length
        
            setDaneia(uniqueIdsCount);
            setUnreceived(unreiceived);  // Set paid invoices count
            setReceived(reiceived); // Set unpaid invoices count
        
            // Assuming you have a state setter like setErga defined somewhere
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }

        const getDoseis = async() =>{
            try {
                const response = await axios.get(`${apiBaseUrl}/doseis`, {timeout: 5000});
                const doseis_data = response.data;
                const doseisCount = doseis_data.filter(item => item.status === 'no').length;
                const filteredDoseis=doseis_data.filter(item => item.status === 'no')
                const totalAmount = filteredDoseis.reduce((sum, item) => sum + Number(item.ammount || 0), 0);
                // console.log("total doseis ammounbt",totalAmount)
                setDoseis(doseisCount);
                setTotalDoseisAmmount(totalAmount);
        
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors as needed
            }
        }


    return(
    <div className='grid'>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-5">
                    <div>
                        <h6 className="m-0 mb-1 text-500 text-gray-800">Τραπεζικά Διαθέσιμα</h6>
                        <h1 className="m-0 text-gray-800 ">{formatCurrency(budget)}</h1>
                        <small className="m-0 text-gray-800 ">Τελευταία Ενημέρωση: {formatDate(budgetDate)}</small>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <BudgetIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
                    </div>
                </div>
                
            </div>
        </div>

        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-5">
                    <div>
                        <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Πελατών</h6>
                        <h1 className="m-0 text-gray-800 ">{customer} </h1>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
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
                        <h1 className="m-0 text-gray-800 ">{paradotea} </h1>
                        <h6 className="m-0 mb-1 text-500 text-green-600">Εχουν τιμολογηθεί:{timPar}</h6>

                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <DeliverablesIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 
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
                        <h6 className="m-0 mb-1 text-500 text-green-600">Πληρωμένα:{paidCount}</h6>
                        <h6 className="m-0 mb-1 text-500 text-red-600">Απλήρωτα:{unpaidCount}</h6>

                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <InvoiceIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 
                    </div>
                </div>
                
            </div>
        </div>

        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-5">
                    <div>
                        <h6 className="m-0 mb-1 text-500 text-gray-800">Δοσεις που Εκκρεμούν</h6>
                        <h1 className="m-0 text-red-600">{doseis} </h1>
                        <h6 className="m-0 text-red-600">Συννολικό Ποσό Οφειλής: {formatCurrency(doseisTotal)} </h6>

                    

                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <InstallmentsIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 

                    </div>
                </div>
                
            </div>
        </div>


        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-5">
                    <div>
                        <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Εκχωρημένων Τιμολογίων</h6>
                        <h1 className="m-0 text-gray-800 ">{ektim} </h1>
            

                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <EktimIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 
                    </div>
                </div>
                
            </div>
        </div>

        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-5">
                    <div>
                        <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Δανείων</h6>
                        <h1 className="m-0 text-gray-800 ">{daneia} </h1>
                        <h6 className="m-0 mb-1 text-500 text-green-600">Εχουν παραληφθεί:{daneiareceived}</h6>
                        <h6 className="m-0 mb-1 text-500 text-red-600">Δεν εχουν παραληφθεί:{daneiaunreceived}</h6>
            

                    </div>
                    <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                        <LoanIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 
                    </div>
                </div>
                
            </div>
        </div>
        
    
    </div>
    )

}
      
      
      