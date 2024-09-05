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

const EkxwrimenoTimologioList = () => 
{
    const [EkxwrimenoTimologio, setEkxorimena_Timologia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    
    const [statuses] = useState(['yes', 'no']);






    useEffect(()=>{
        getEkxorimena_Timologia()
        setLoading(false);
        initFilters();
    }, []);

    const getEkxorimena_Timologia = async() =>{

        try {
            const response = await axios.get(`${apiBaseUrl}/ek_tim`);
            const paraData = response.data;
            console.log("ParaData:",paraData);
           
            const parDataWithDates = paraData.map(item => ({
                ...item,
                // erga: {
                //     ...item.erga,
                //     name: item.erga?.name || 'N/A'
                // },
                // timologia: {
                //     ...item.timologia,
                //     invoice_number: item.timologia?.invoice_number || 'N/A'
                // },
                bank_date: new Date(item.bank_date),
                cust_date: new Date(item.cust_date),
                cust_estimated_date: new Date(item.cust_estimated_date),
                bank_estimated_date: new Date(item.bank_estimated_date),
            }));
    
            console.log(parDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setEkxorimena_Timologia(parDataWithDates);

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }


    }

    const deleteEkxorimeno_Timologio = async(ek_timologioId)=>{
        await axios.delete(`${apiBaseUrl}/ek_tim/${ek_timologioId}`);
        getEkxorimena_Timologia();
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
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            timologia_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            bank_estimated_date:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]},
            customer_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            bank_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            status_bank_paid:{ operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            bank_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_estimated_date:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]},
            status_customer_paid:{ operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    };



    const {user} = useSelector((state) => state.auth);


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
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else {
            return "Invalid date";
        }
    };
    

    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
    };


    //bank date
    const bank_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.bank_date);
    };
    
    const bank_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //estimate bankdate
    const bank_estimated_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.bank_estimated_date);
    };
    
    const bank_estimated_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //custdate

    const cust_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.cust_date);
    };
    
    const cust_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };


    //estimate custdate
    const cust_estimated_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.cust_estimated_date);
    };
    
    const cust_estimated_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };



    const bank_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.bank_ammount);
    };

    const customer_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.customer_ammount);
    };

  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };


  
        

    const statusBankPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_bank_paid} severity={getSeverity(rowData.status_bank_paid)} />;
    };

    
    const statusCustomerPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_customer_paid} severity={getSeverity(rowData.status_customer_paid)} />;
    };

    

    const statusPaidFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusPaidItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusPaidItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };




    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });    };





    const footer = `In total there are ${EkxwrimenoTimologio ? EkxwrimenoTimologio.length : 0} paradotea.`;

    const header = renderHeader();


    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/ek_tim/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/ek_tim/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/ek_tim/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteEkxorimeno_Timologio(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }



    return(
        <div className="card" >
        <h1 className='title'>Εκχωρημένα τιμολόγια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ek_tim/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Εκχωρημένου Τιμολογίου" icon="pi pi-plus-circle"/></Link>
        )}
        <DataTable value={EkxwrimenoTimologio} paginator showGridlines rows={10} scrollable scrollHeight="400px" loading={loading} dataKey="id" 
                filters={filters} globalFilterFields={[
                    'id',
                    'timologia_id',
                    'bank_ammount',
                    'bank_estimated_date', 
                    'bank_date', 
                    'customer_ammount',
                    'cust_estimated_date',
                    'cust_date',
                    'status_bank_paid',
                    'status_customer_paid'
                ]} header={header}
                emptyMessage="Δεν βρέθηκαν εκχωριμένα τιμολόγια.">
                <Column field="id" header="id" filter filterPlaceholder="Search by name" style={{ minWidth: '5rem' }} />
                <Column header="bank_ammount" filterField="bank_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={bank_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="customer_ammount" filterField="customer_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={customer_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="bank_estimated_date" filterField="bank_estimated_date" dataType="date" style={{ minWidth: '5rem' }} body={bank_estimated_dateDateBodyFilterTemplate} filter filterElement={bank_estimated_dateDateFilterTemplate} ></Column>
                <Column header="bank_date" filterField="bank_date" dataType="date" style={{ minWidth: '5rem' }} body={bank_dateDateBodyFilterTemplate} filter filterElement={bank_dateDateFilterTemplate} ></Column>

                <Column header="cust_estimated_date" filterField="cust_estimated_date" dataType="date" style={{ minWidth: '5rem' }} body={cust_estimated_dateDateBodyFilterTemplate} filter filterElement={cust_estimated_dateDateFilterTemplate} ></Column>
                <Column header="cust_date" filterField="cust_date" dataType="date" style={{ minWidth: '5rem' }} body={cust_dateDateBodyFilterTemplate} filter filterElement={cust_dateDateFilterTemplate} ></Column>

                <Column field="timologia_id" header="timologia_id" filter filterPlaceholder="Search by timologia_id" style={{ minWidth: '5rem' }} />
                <Column field="status_bank_paid" header="status_bank_paid" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBankPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
                <Column field="status_customer_paid" header="status_customer_paid" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusCustomerPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
                <Column header="actions" field="id" body={actionsBodyTemplate}/>

           </DataTable>
    </div>
    );
}

export default EkxwrimenoTimologioList;