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
    



    const {user} = useSelector((state) => state.auth);
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            timologia_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            customer_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            bank_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            bank_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {/* <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField> */}
            </div>
        );
    };
    const header = renderHeader();

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

    useEffect(()=>{
        getEkxorimena_Timologia()
        setLoading(false);
        initFilters();
    }, []);

    const getEkxorimena_Timologia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ek_tim`);
        setEkxorimena_Timologia(response.data);
    }

    const deleteEkxorimeno_Timologio = async(ek_timologioId)=>{
        await axios.delete(`${apiBaseUrl}/ek_tim/${ek_timologioId}`);
        getEkxorimena_Timologia();
    };

    return(
        <div className="card" >
        <h1 className='title'>Εκχωρημένα τιμολόγια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ek_tim/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Εκχωρημένου Τιμολογίου" icon="pi pi-plus-circle"/></Link>
        )}
        <DataTable value={EkxwrimenoTimologio} paginator showGridlines rows={10} scrollable scrollHeight="400px" loading={loading} dataKey="id" 
                filters={filters} globalFilterFields={['id'
                    ,'timologia_id','bank_ammount'
                    ,'bank_estimated_date', 'bank_date', 'customer_ammount'
                    ,'cust_estimated_date','cust_date']} header={header}
                emptyMessage="No customers found.">
                <Column field="id" header="id" filter filterPlaceholder="Search by name" style={{ minWidth: '5rem' }} />
                <Column field="timologia_id" header="timologia_id" filter filterPlaceholder="Search by timologia_id" style={{ minWidth: '5rem' }} />

           </DataTable>
    </div>
    );
}

export default EkxwrimenoTimologioList;