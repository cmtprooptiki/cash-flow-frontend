import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
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

const DoseisList = () => {
    const [doseis, setDoseis] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [ypoxreoseis, setYpoxreoseis]=useState([]);
    const {user} = useSelector((state) => state.auth)
    const [statuses] = useState(['yes', 'no']);
    

    useEffect(()=>{
        getDoseis();
        setLoading(false);
        initFilters();
    },[]);

    const getDoseis = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/doseis`);
            const doseis_data = response.data;
            console.log("ParaData:",doseis_data);

            const uniqueYpoxreoseis= [...new Set(doseis_data.map(item => item.ypoxreosei?.provider || 'N/A'))];
            setYpoxreoseis(uniqueYpoxreoseis);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            // console.log("Unique Timologia:",uniqueTimologia);
            // setTimologio(uniqueTimologia);

            // const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            // setErgo(uniqueErga);

            // Convert sign_date to Date object for each item in ergaData
            const doseisDataWithDates = doseis_data.map(item => ({
                ...item,
                ypoxreoseis:
                {
                    ...item.ypoxreoseis,
                    provider: item.ypoxreoseis?.provider || 'N/A'
                },
                // erga: {
                //     ...item.erga,
                //     name: item.erga?.name || 'N/A'
                // },
                // timologia: {
                //     ...item.timologia,
                //     invoice_number: item.timologia?.invoice_number || 'N/A'
                // },
                actual_payment_date: new Date(item.actual_payment_date),
                estimate_payment_date: new Date(item.estimate_payment_date)
            }));
    
            console.log(doseisDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setDoseis(doseisDataWithDates);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }

    const deleteDoseis = async(doseisId)=>{
        await axios.delete(`${apiBaseUrl}/doseis/${doseisId}`);
        getDoseis();
    }

    const onGlobalFilterChange = (e) => {
        
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };



    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () =>
        {
            setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            actual_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            estimate_payment_date	: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            // ammount_no_tax: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            
            // ammount_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
           
            // ammount_of_income_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
            

            // status_paid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'ypoxreoseis.provider':{ value: null, matchMode: FilterMatchMode.IN },
            

        });
        setGlobalFilterValue('');
        }

        

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

        const ammountBodyTemplate= (rowData) => {
        return formatCurrency(rowData.ammount);
    };
    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
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
   

    const formatDate = (value) => {
        let date = new Date(value);
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

       //delivery Date
 const estimate_payment_dateDateBodyTemplate = (rowData) => {
    return formatDate(rowData.estimate_payment_date);
};

const estimate_payment_dateDateFilterTemplate = (options) => {
    // console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};

    const ProviderBodyTemplate = (rowData) => {
        
        const provider = rowData.ypoxreosei?.provider || 'N/A';        // console.log("repsBodytempl",timologio)
        // console.log("timologio",ergo," type ",typeof(ergo));
        // console.log("rep body template: ",ergo)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{provider}</span>
        </div>
        );
    };

    const ProviderFilterTemplate = (options) => {
        console.log('Current provider filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={ypoxreoseis} itemTemplate={ProviderItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
        };

        const ProviderItemTemplate = (option) => {
            // console.log("itemTemplate",option)
            console.log("rep Item template: ",option)
            console.log("rep Item type: ",typeof(option))
        
            return (
                <div className="flex align-items-center gap-2">
                    {/* <img alt={option} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" /> */}
                    <span>{option}</span>
                </div>
            );
        };

    

     //delivery Date
     const actual_payment_dateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.actual_payment_date);
    };
    
    const actual_payment_dateDateFilterTemplate = (options) => {
        // console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
    };
    const formatCurrency = (value) => {
        // return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const header = renderHeader();

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/doseis/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/doseis/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/doseis/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteDoseis(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }

     return(


<div className="card" >
        <h1 className='title'>Δόσεις</h1>
        {user && user.role ==="admin" && (
        <Link to={"/doseis/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεας Δόσης" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={doseis} paginator 
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'id',
                'ypoxreosei.provider', 
                'ammount', 
                'actual_payment_date',
                'estimate_payment_date',
                'ammount_no_tax',
                'status'
                ]} 
            header={header} 
            emptyMessage="No doseis found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column header="ypoxreoseis" filterField="ypoxreoseis.provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={ProviderBodyTemplate} filter filterElement={ProviderFilterTemplate} />  
               <Column header="ammount" filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
               <Column header="actual_payment_date" filterField="actual_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={actual_payment_dateDateBodyTemplate} filter filterElement={actual_payment_dateDateFilterTemplate} ></Column>
                <Column header="estimate_payment_date" filterField="estimate_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={estimate_payment_dateDateBodyTemplate} filter filterElement={estimate_payment_dateDateFilterTemplate} ></Column>

                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}     

            <Column field="status" header="status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />

            {/* <Column field="status_paid" header="status_paid"  filter filterPlaceholder="Search by status_paid"  style={{ minWidth: '12rem' }}></Column> */}

        
               
                <Column header="actions" field="id" body={actionsBodyTemplate}/>

 </DataTable>
       
    </div>
     )
}

export default DoseisList;
