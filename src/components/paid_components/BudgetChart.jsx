import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
import { DataTable } from 'primereact/datatable';
import ApexCharts from 'react-apexcharts';

import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

const BudgetChart = (props) => {
    const [paradotea, setIncomeParadotea] = useState([]);
    const [ekxorimena, setEkxorimena] = useState([]);
    const [incomeTim, setIncomeTim] = useState([]);
    const [daneia,setDaneia]=useState([])
    const [doseis,setDoseis]=useState([])
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Bank', 'Customer','Paradotea','Timologia']);
    const [totalIncome, setTotalIncome] = useState(0);
    const [filtercalled,setfiltercalled]=useState(false)
    const [combinedData,setCombinedData]=useState([])

    const scenario =props.scenario

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchData();
        setLoading(false);
        initFilters();
    }, []);

    const fetchData = async () => {
        await getDoseis();
        await getEkxorimena();
        await getIncomePar();
        await getIncomeTim();
        await getDaneia();
    };
    const getDoseis = async () =>{
        const response = await axios.get(`${apiBaseUrl}/doseis`)
        setDoseis(response.data)
    }

    const getEkxorimena = async () => {
        const response = await axios.get(`${apiBaseUrl}/ek_tim`);
        setEkxorimena(response.data);
    };

    const getIncomePar = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_par`);
        setIncomeParadotea(response.data);
    };

    const getIncomeTim = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_tim`);
        const data = response.data;

        // Filter to ensure unique timologia.id values
        const uniqueTimologia = [];
        const seenTimologiaIds = new Set();

        data.forEach(item => {
            if (!seenTimologiaIds.has(item.timologia.id)) {
                seenTimologiaIds.add(item.timologia.id);
                uniqueTimologia.push(item);
            }
        });
        setIncomeTim(uniqueTimologia);
    };
    const getDaneia = async () =>{
        const response = await axios.get(`${apiBaseUrl}/daneia`)
        setDaneia(response.data);
    }

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            income: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

        });
        setGlobalFilterValue('');
    };

    const formatDate = (value) => {
        let date = new Date(value);
        // console.log("invalid date is: ",date)
        if (!isNaN(date)) {
            // console.log("show date ",date.toLocaleDateString('en-US', {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: 'numeric'
            // }))
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else {
            
            return "Invalid date";
        }
    };

  //Sign Date
  const DateBodyTemplate = (rowData) => {
    // console.log("date data: ",rowData)
    return formatDate(rowData.date);
};

const dateFilterTemplate = (options) => {
    // console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};


const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
};

const ammountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.income);
};


const ammountFilterTemplate = (options) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
};


const getSeverity = (status) => {
    switch (status) {
        case 'Bank':
            return 'danger';
        case 'Customer':
            return 'danger';
        case 'Paradotea':
            return 'info';
        case 'Timologia':
            return 'success';
        case 'Daneia':
            return 'warning';
     
    }
};

const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.type} severity={getSeverity(rowData.type)} />;
};

const statusFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
};

const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
};



    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => acc + item.income, 0);
    };
    

    
    // useEffect(()=>{
    //     if(scenario==="estimate_payment_date"){
    //     const combinedData2 = [
    //         ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //         ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
    //         ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
    //         ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
    //         ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //     ];
    //     setCombinedData(combinedData2)
    //     }else if(scenario==="estimate_payment_date_2"){
    //         const combinedData2 = [
    //             ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //             ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
    //             ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_2), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
    //             ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
    //             ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //         ];
    //         setCombinedData(combinedData2)
    //     }else if(scenario==="estimate_payment_date_3"){
    //         const combinedData2 = [
    //             ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //             ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
    //             ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_3), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
    //             ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
    //             ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //         ];
    //         setCombinedData(combinedData2)
    //     }

    // },[paradotea,ekxorimena,incomeTim,daneia,scenario])
    

    useEffect(()=>{
        console.log("scenario ",scenario)
        // if(scenario==="table1"){
            const combinedData2 = [
                ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
                ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
                ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
                ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
                ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
                ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: item.ammount , type: 'doseis', id: item.id }))
            ];
            setCombinedData(combinedData2)
        // }else if(scenario==="table2"){
        //     const combinedData2 = [
        //         ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
        //         ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
        //         ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_2), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
        //         ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
        //         ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
        //         ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: (-1)*item.ammount , type: 'doseis', id: item.id }))
        //     ];
        //     setCombinedData(combinedData2)
        // }else if(scenario==="table3"){
        //     const combinedData2 = [
        //         ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
        //         ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
        //         ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_3), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
        //         ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id })),
        //         ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
        //         ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: (-1)*item.ammount , type: 'doseis', id: item.id }))
        //     ];
        //     setCombinedData(combinedData2)
        //}
        
        

    },[paradotea,ekxorimena,incomeTim,daneia,doseis,scenario])




    const data = [
        { date: new Date('Sun Jun 30 2024 03:00:00 GMT+0300'), income: 12698.6, type: 'Paradotea', id: 7 },
        { date: new Date('Wed Jun 12 2024 03:00:00 GMT+0300'), income: 17185.5, type: 'Timologia', id: 8 },
        { date: new Date('Thu Jun 05 2024 03:00:00 GMT+0300'), income: 1500, type: 'doseis', id: 10 },
        { date: new Date('Thu Jun 05 2024 03:00:00 GMT+0300'), income: 96.09, type: 'doseis', id: 11 },
        { date: new Date('Sat Jun 05 2024 03:00:00 GMT+0300'), income: 96.09, type: 'doseis', id: 12 },
        { date: new Date('Fri Jun 30 2024 03:00:00 GMT+0300'), income: 310, type: 'doseis', id: 14 },
        { date: new Date('Wed Jun 14 2024 03:00:00 GMT+0300'), income: 3720, type: 'doseis', id: 15 }
      ];
    // Create a map to aggregate data by month/year
    const aggregatedData = {};

    combinedData.forEach(item => {
    const monthYear = item.date.toLocaleString('default', { year: 'numeric', month: 'long' });
    if (!aggregatedData[monthYear]) {
        aggregatedData[monthYear] = { x: monthYear, y: 0, goals: [{ name: 'Έξοδα', value: 0, strokeHeight: 2, strokeDashArray: 2, strokeColor: 'red' }] };
    }
    
    if (item.type !== 'doseis') {
        aggregatedData[monthYear].y += item.income;
    } else {
        aggregatedData[monthYear].goals[0].value += item.income;
    }
    });

    // Convert aggregated data map to an array
    const result = Object.values(aggregatedData);

    console.log(JSON.stringify(result, null, 2));
    


    const final = {
        series: [
          {
            name: 'Έσοδα',
            data: result
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'bar'
          },
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          },
          title: {
            text: 'Μηνιαίος Προϋπολογισμός',
            align: 'center',
            floating: true
        },
          colors: ['#00E396'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Έσοδα', 'Έξοδα'],
            markers: {
              fillColors: ['#00E396', 'red']
            }
          }
        },
      };
    


    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome(combinedData)));
        }
        
    }, [combinedData]);

    // const handleFilter = (filteredData) => {
    //     console.log("filtered data: ",filteredData)
    //     setTotalIncome(calculateTotalIncome(filteredData));
    // };

    //console.log(combinedData)

    // const thisYearTotal = (filter) => {
    //     console.log("filter data",filter)
    //     console.log("filter filters",filter.props.filters)
    //     let total2=0;
        ///check if filters have been applied
        ///if applied
        /*
        if(filter.props.filters!=null){
            for(let typeFilter of filter.props.filters.type.constraints){
                ///check for each filter of type column if it has value (if the values is null then this type of filter has not been applied)
                if(typeFilter.value){
                    if(typeFilter.matchMode=="equals"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(sale.type==typeFilter.value){
                                total2 += sale.income;
                            }  
                        }                        
                    }   
                }
            }
            for(let typeFilter of filter.props.filters.date.constraints){
                ///check for each filter of type column if it has value (if the values is null then this type of filter has not been applied)
                if(typeFilter.value){ 
                    if(typeFilter.matchMode=="dateAfter"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(new Date(sale.date)>=new Date(typeFilter.value)){
                                total2 += sale.income;
                            }  
                        }                        
                    }  
                    if(typeFilter.matchMode=="dateBefore"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(new Date(sale.date)<=new Date(typeFilter.value)){
                                total2 += sale.income;
                            }  
                        }                        
                    }    
                }
            }
            

            return formatCurrency(total2); 
        }
        ///if not applied
        let total = 0;
        for(let sale of combinedData) {
            total += sale.income;
        }

        return formatCurrency(total); */
    //}

    // const handelAllFilters=(filters)=>{
    //     console.log("Type filter: ",filters.type.constraints)
    // }
    const handleValueChange = (e) => {
        const visibleRows = e;
        // console.log("visisble rows:",e);
        if(e.length>0){
            setfiltercalled(true)
        }

        // // Calculate total income for the visible rows
        const incomeSum = visibleRows.reduce((sum, row) => sum + (row.income || 0), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
    };

    const header = renderHeader();

    return (
        <div>
            {/* <DataTable value={combinedData} paginator rows={10} 
            header={header} 
            filters={filters} 
            filterDisplay="menu" loading={loading} 
            responsiveLayout="scroll" 
            globalFilterFields={['date', 'income', 'type','id']}
            // onFilter={(e) => handleFilter(e.filteredValue)}
            onFilter={(e)=>setFilters(e.filters)}
            onValueChange={handleValueChange}
            
            > */}
                {/* {console.log("combined data: ",combinedData)} */}
                {/* <Column filterField="date" header="date" dataType="date" style={{ minWidth: '5rem' }} body={DateBodyTemplate} filter filterElement={dateFilterTemplate} sortable sortField="date" ></Column> */}
                {/* <Column filterField="income" header="income" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={formatCurrency(totalIncome)}></Column> */}
                {/* <Column filterField="income" header="income" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalIncome} ></Column>
                <Column field="type" header="Type" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />

                <Column field="id" header="Id" filter ></Column>

            </DataTable> */}
            {/* <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} /> */}
            <ApexCharts options={final.options} series={final.series} type='bar' height={350} />

            {console.log("comb data ",combinedData)}
        </div>
    );
};

export default BudgetChart;
