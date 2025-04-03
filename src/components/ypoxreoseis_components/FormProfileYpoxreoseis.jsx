import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';


import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';
import { Provider } from 'react-redux';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';
import Chart from 'react-apexcharts';
import { ReactComponent as InvoiceIcon } from '../../icons/invoice.svg'
//'../icons/invoice.svg'; // Import the SVG as a React component

const FormProfileYpoxreoseis = ({ id, onHide }) =>
{
    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[total_owed_ammount,setTotal_Owed_Ammount]=useState("");
    const[erga_id,setErga_Id]=useState("");
    const[provider, setProvider]=useState("");

    const [doseis,setDoseis] = useState([])

    const [tags,setTags] = useState([])

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    useEffect(()=>
    {
        const getdoseisByYpoxreoseisId = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/ypoquery/${id}`, {timeout: 5000});
                setProvider(response.data.ypoxreoseis.provider)
                setErga_Id(response.data.ypoxreoseis.erga_id)
                setInvoice_date(response.data.ypoxreoseis.invoice_date);
                setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
                setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);
                setTags(response.data.tags)
            }
            catch(error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getdoseisByYpoxreoseisId();
    }, [id])

    useEffect(()=>{
        const getYpoxreoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/doseis_by_ypo/${id}`, {timeout: 5000});
                setDoseis(response.data); // ✅ Save doseis list
            }
            catch(error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getYpoxreoseisById();
    }, [id]);

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // ✅ Count completed and not completed doseis
    const completedCount = doseis.filter(d => d.status === 'yes').length;
    const notCompletedCount = doseis.filter(d => d.status !== 'yes').length;
    const totalCompletedCount = doseis.filter(d => (d.status === 'yes')).reduce((sum, d) => sum + (parseFloat(d.ammount) || 0), 0); // Replace 'amount' if needed
    const totalNotCompletedCount = doseis.filter(d => (d.status === 'no')).reduce((sum, d) => sum + (parseFloat(d.ammount) || 0), 0); // Replace 'amount' if needed
    
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Ολοκληρωμένες Δόσεις', 'Μη Ολοκληρωμένες Δόσεις'],
        colors: ['#00e396', '#ff4560'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toLocaleString('el-GR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2,
                    });
                }
            }
        },
        dataLabels: {
            formatter: function (val, opts) {
                const amount = opts.w.config.series[opts.seriesIndex];
                return amount.toLocaleString('el-GR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                });
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chartColorPalette = [
        '#FF4560', 
        '#FEB019', 
        '#008FFB', 
        '#D7263D', 
        '#00E396'
    ]


    const unpaidDoseis = doseis.filter(d => d.status === 'no' && d.estimate_payment_date);

    const groupedByYear = {};
    const yearlyUnpaidSums = {};

    unpaidDoseis.forEach(dosi => {
        const date = new Date(dosi.estimate_payment_date);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0 = Jan
        const ammount = parseFloat(dosi.ammount) || 0;

        if (!groupedByYear[year]) {
            groupedByYear[year] = new Array(12).fill(0);
        }

        groupedByYear[year][month] += ammount;

        if (!yearlyUnpaidSums[year]) {
            yearlyUnpaidSums[year] = 0;
        }
    
        yearlyUnpaidSums[year] += ammount;
    });

    const sortedYears = Object.keys(groupedByYear)
  .map(Number)
  .sort((a, b) => a - b); // e.g. [2024, 2025, 2026, ...]

    const yearColorMap = {};
    sortedYears.forEach((year, index) => {
    yearColorMap[year] = chartColorPalette[index % chartColorPalette.length]; // wrap if > colors
    });
    const yearlyLabels = Object.keys(yearlyUnpaidSums).sort();

    
    const yearlyData = yearlyLabels.map(year => yearlyUnpaidSums[year]);

    console.log("Yearly Data", yearlyLabels)


    const horizontalBarOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            labels: {
                formatter: (val) => val.toLocaleString('el-GR', {
                    style: 'currency',
                    currency: 'EUR'
                })
            },
            title: {
                text: 'Σύνολο Ποσού (€)'
            }
        },
        yaxis: {
            categories: yearlyLabels
        },
        tooltip: {
            x: {
                show: false
            },
            y: {
                formatter: (val) => val.toLocaleString('el-GR', {
                    style: 'currency',
                    currency: 'EUR'
                })
            }
        },
        title: {
            text: 'Μη Ολοκληρωμένες Δόσεις ανά Έτος',
            align: 'center'
        },
        colors: ['#FF4560', '#FEB019', '#008FFB', '#D7263D', '#00E396']
    };
    
    const horizontalBarSeries = [{
        name: 'Σύνολο Δόσεων',
        data: yearlyLabels.map(year => ({
            x: year,                    // Year label on Y-axis
            y: yearlyUnpaidSums[year], // Amount value
            fillColor: yearColorMap[year]  
        }))
        
    }];


    console.log("Xronies, ", horizontalBarSeries)



    const monthLabels = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];

    const stackedBarSeries = sortedYears.map(year => ({
        name: year.toString(),
        data: groupedByYear[year]
      }));

    const stackedBarOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: { show: true }
        },
        xaxis: {
            categories: monthLabels
        },
        yaxis: {
            labels: {
                formatter: (val) => val.toLocaleString('el-GR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0
                })
            },
            title: {
                text: 'Ποσό (€)'
            }
        },
        tooltip: {
            y: {
                formatter: (val) => val.toLocaleString('el-GR', {
                    style: 'currency',
                    currency: 'EUR'
                })
            }
        },
        title: {
            text: 'Μη Ολοκληρωμένες Δόσεις ανά Μήνα και Έτος',
            align: 'center'
        },
        legend: {
            position: 'bottom'
        },
        colors: sortedYears.map(year => yearColorMap[year]),
    };

    const chartSeries = [totalCompletedCount, totalNotCompletedCount]

    return(
<div>
    <div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Υποχρέωση</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Προμηθευτής-έξοδο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{provider}</div>
           
        </li>

 

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία τιμολογίου</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Chip label={invoice_date || 'N/A'} className="mr-2" />

            {/* <Calendar value={new Date(invoice_date)} inline showWeek /> */}


            </div>

           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ετικέτα:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={tags} className="mr-2" />
                
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ανήκει στο Έργο:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={erga_id ? erga_id : 'Δεν σχετίζεται με καποιο εργο η συγκεκριμένη υποχρέωση'} className="mr-2"   style={{ color: erga_id ? '' : 'red' }}  />
                
            </div>
            
        </li>
   
    

     
    </ul>
</div>
<Divider />

<div className="grid">
  
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό (σύνολο)</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(total_owed_ammount)} </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό ΦΠΑ</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(ammount_vat)} </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

   

 

</div>

    {/* ApexChart Section */}
    {doseis.length > 0 && (
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round mt-4">
            <div className="col-12 md:col-6 lg:col-3">
                  <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                      <div className="flex justify-content-between mb-5" style = {{width: '7rem', height: '7rem'}}>
                          <div>
                              <h6 className="m-0 mb-1 text-500 text-gray-800">Σύνολο Δόσεων</h6>
                              <h1 className="m-0 text-gray-800 ">{completedCount + notCompletedCount} </h1>
                              <h6 className="m-0 mb-1 text-500 text-green-600">Πληρωμένες:{completedCount}</h6>
                              <h6 className="m-0 mb-1 text-500 text-red-600">Απλήρωτες:{notCompletedCount}</h6>
            
                          </div>
                          <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                              <InvoiceIcon style={{ width: '6.5em', height: '6.5em' ,fill:'black'}}  className="" /> 
                          </div>
                      </div>
                      
                  </div>
              </div>
            
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round mt-4">
            <div className="font-medium text-xl mb-2">Κατάσταση Δόσεων </div>
            <Chart options={chartOptions} series={chartSeries} type="donut" width="400" />
        </div>

        <div className="grid mt-5">
        {/* Left side: Horizontal bar */}
        <div className="col-12 md:col-5">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <Chart options={horizontalBarOptions} series={horizontalBarSeries} type="bar" height={400} />
            </div>
        </div>

        {/* Right side: Stacked month-year bar */}
        <div className="col-12 md:col-7">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <Chart options={stackedBarOptions} series={stackedBarSeries} type="bar" height={400} />
            </div>
        </div>
    </div>
        </div>
        
    )}


</div>
    )


}

export default FormProfileYpoxreoseis