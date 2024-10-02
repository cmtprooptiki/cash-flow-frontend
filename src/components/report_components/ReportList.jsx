import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig'; // Update the path accordingly

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';


const ReportList = () => {
    const [reportData,setReportData]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Σχεδίαση','Ολοκληρωμένο','Αποπληρωμένο','Υπογεγραμμένο','Ακυρωμένο']);
    // const [project_managers, setProjectManager]=useState([]);
   

    const getSeverity = (status) => {
        switch (status) {
            case 'Σχεδίαση':
                return 'info';

            case 'Υπογεγραμμένο':
                return 'success';
            
            case 'Ολοκληρωμένο':
                return 'secondary';

            case 'Αποπληρωμένο':
                return 'contrast';

            case 'Ακυρωμένο':
                return 'danger';

           

         
        }
    };

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
            erga_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            customer_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            sign_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ammount_total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            totalparadotea: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            difference: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    };

    const {user} = useSelector((state)=>state.auth)


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

    const headerTemplate = (data) => {
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={data.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${data.representative.image}`} width="32" /> */}
                <span className="font-bold" style={{color:'black'}}>{data.customer_name}</span>
            </div>
        );
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="5">
                    <div className="flex justify-content-end font-bold w-full">Total Customers: {calculateCustomerTotal(data.customer_name)}</div>
                </td>
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total++;
                }
            }
        }

        return total;
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
    const imageBodyTemplate = (rowData) => {
        return <img src={`${apiBaseUrl}/${rowData.logoImage}`} alt={rowData.logoImage} className="w-6rem shadow-2 border-round" />;
    };

    

    //Sign Date
    const signDateBodyTemplate = (rowData) => {
        return formatDate(rowData.sign_date);
    };

    const dateFilterTemplate = (options) => {
        console.log('Current filter value:', options);

        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };


    //Estimate_Startdate
    const estimateStartDateBodyTemplate = (rowData) => {
        return formatDate(rowData.estimate_start_date);
    };

    const estimateStartDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);

        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //Estimate Payment 
    const estimatePaymentDateBodyTemplate = (rowData) => {
        return formatDate(rowData.estimate_payment_date);
    };

    const estimatePaymentDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);

        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //Estimate Payment 2
    const estimatePaymentDateBodyTemplate2 = (rowData) => {
        return formatDate(rowData.estimate_payment_date_2);
    };

    const estimatePaymentDateFilterTemplate2 = (options) => {
        console.log('Current filter value:', options);

        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };


//Estimate Payment 3
const estimatePaymentDateBodyTemplate3= (rowData) => {
    return formatDate(rowData.estimate_payment_date_3);
};

const estimatePaymentDateFilterTemplate3= (options) => {
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};




    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const ammount_totalParadoteaTemplate = (rowData) => {
        return formatCurrency(rowData.totalparadotea);
    };

    const ammount_differenceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.difference);
    };

    const ammount_totalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_total);
    };


  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };


    
   

 



    useEffect(()=>{
        getReportData()
        setLoading(false);
        initFilters();
    },[]);

    const getReportData= async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/getGroupTableParadotea`, {timeout: 5000});
            const reportData = response.data;
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueProjectManager = [...new Set(reportData.map(item => item.project_manager))];
            // .map(name => ({ name }));
            // setProjectManager(uniqueProjectManager);
            // Convert sign_date to Date object for each item in ergaData
            const ergaDataWithDates = reportData.map(item => ({
                ...item
                // sign_date: new Date(item.sign_date)
                // estimate_start_date: new Date(item.estimate_start_date),
                // estimate_payment_date:new Date(item.estimate_payment_date),
                // estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                // estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));
    
            // console.log(ergaDataWithDates); 
            // Assuming you have a state setter like setErga defined somewhere
            // setErga(ergaDataWithDates);


                // Sort ergaDataWithDates by sign_date in ascending order
        // const sortedErgaData = ergaDataWithDates.sort((a, b) => a.sign_date - b.sign_date);

        console.log(ergaDataWithDates); // Optionally log the sorted data

        // Assuming you have a state setter like setErga defined somewhere
        setReportData(ergaDataWithDates);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }


    // const deleteErga = async(ergaId)=>{
    //     await axios.delete(`${apiBaseUrl}/erga/${ergaId}`);
    //     getErga();
    // }

    const header = renderHeader();

    

  

  return (
    <div className="card" >
    <h1 className='title'>Report</h1>
    {user && user.role ==="admin" && (
    <Link to={"/erga/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Έργου" icon="pi pi-plus-circle"/></Link>
    )}
   <DataTable value={reportData} rowGroupMode="subheader" groupRowsBy="customer_name" sortMode="single" sortField="customer_name"
                    sortOrder={1} scrollable scrollHeight="400px" rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate} tableStyle={{ minWidth: '50rem' }}>
                <Column field="erga_name" header="Name" style={{ minWidth: '200px' }}></Column>
                <Column header="ammount_total" filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Κατάσταση έργου" field="status"  filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column field="sign_date" header="sign_date" style={{ minWidth: '200px' }}></Column>
                <Column header="totalparadotea" filterField="totalparadotea" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalParadoteaTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="difference" filterField="difference" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_differenceBodyTemplate} filter filterElement={ammountFilterTemplate} />
                
            </DataTable>
</div>
  )
}

export default ReportList
