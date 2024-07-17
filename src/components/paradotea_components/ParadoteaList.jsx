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

const ParadoteaList = () => {
    const [paradotea, setParadotea] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [representatives] = useState([
                                {erga_id:"1"},
                                {erga_id:"3"}
                            ]);


    const [timologia] = useState([
        {timologia_id:4},
        {timologia_id:5}
    ]);                        

    const columns = [
        {field: 'id', header: 'id'},
        {field: 'part_number', header: 'part_number'},
        {field: 'title', header: 'title'},
        {field: 'percentage', header: 'percentage'},
        {field: 'ammount', header: 'ammount'},
        {field:'delivery_date', header:'delivery_date'},
        {field: 'erga_id', header: 'erga_id'},
        {field:'timologia_id', header:'timologia_id'}
       
    ];



    useEffect(()=>{
        getParadotea()
        setLoading(false);
        
        // initFilters();

    },[]);

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
            part_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            percentage: { value: null, matchMode: FilterMatchMode.IN },
            delivery_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS },
            representative:{ value: null, matchMode: FilterMatchMode.IN },
            timologia_id:{ value: null, matchMode: FilterMatchMode.IN },

        });
        setGlobalFilterValue('');
    };


 

    const {user} = useSelector((state)=>state.auth)
    
  

   

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };

    const priceBodyTemplate = (paradotea) => {
        return formatCurrency(paradotea.ammount);
    };
    const formatDate = (value) => {
        // console.log(value);
        const date = new Date(value.replace(' ', 'T'));
        // console.log("after ",date)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.delivery_date);
    };

    const dateFilterTemplate = (options) => {
        // console.log(options);
     

        return (
        
        <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />);
    };

   
    
    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount);
    };


    const getParadotea = async() =>{
        const response = await axios.get(`${apiBaseUrl}/paradotea`);
        setParadotea(response.data);
    }
    const deleteParadotea = async(ParadoteoId)=>{
        await axios.delete(`${apiBaseUrl}/paradotea/${ParadoteoId}`);
        getParadotea();
    }


    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.erga_id;
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
                <span>{representative}</span>
            </div>
        );
    };

    const representativeFilterTemplate = (options) => {
        // console.log("the option value is:",options)
        return <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value,options.index)} optionLabel="erga_id" placeholder="Any" className="p-column-filter" />;
   
    };

    const representativesItemTemplate = (option) => {
        // console.log("itemTemplate",option)
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={option} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" /> */}
                <span>{option.erga_id}</span>
            </div>
        );
    };





    const timologiaBodyTemplate = (rowData) => {
        const timologio = rowData.timologia_id;
        // console.log("repsBodytempl",timologio)
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
                <span>{timologio}</span>
            </div>
        );
    };

    const timologiaFilterTemplate = (options) => {
        // console.log("the option value is:",options)
        return <MultiSelect value={options.value} options={timologia} itemTemplate={timologiaItemTemplate} onChange={(e) => options.filterCallback(e.value,options.index)} optionLabel="timologia_id" placeholder="Any" className="p-column-filter" />;
   
    };

    const timologiaItemTemplate = (option) => {
        // console.log("itemTemplate",option)
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={option} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" /> */}
                <span>{option.timologia_id}</span>
            </div>
        );
    };






    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    // const header = (
    //     <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //         <span className="text-xl text-900 font-bold">Παραδοτέα</span>
    //         <Button icon="pi pi-refresh" rounded raised />
    //     </div>
    // );
    const footer = `In total there are ${paradotea ? paradotea.length : 0} paradotea.`;

    const header = renderHeader();

    return(
        <div className="card" >
        <h1 className='title'>Παραδοτέα</h1>
        {user && user.role ==="admin" && (
        <Link to={"/paradotea/add"} className='button is-primary mb-2'>Προσθήκη Νεου Παραδοτέου</Link>
        )}

{/* <DataTable value={paradotea} tableStyle={{ minWidth: '50rem' }}>
    {columns.map((col, i) => (
        <Column key={col.field} field={col.field} header={col.header} />
    ))}
</DataTable> */}

{/* <DataTable value={paradotea} header={header} footer={footer} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort   tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="id" sortable style={{ width: '25%' }} ></Column>
                <Column field="part_number" header="part_number" sortable style={{ width: '25%' }}></Column>
                <Column field="title" header="title" sortable style={{ width: '25%' }}></Column>
                <Column field="percentage" header="percentage" sortable style={{ width: '25%' }}></Column>
                <Column field="ammount" header="ammount" sortable style={{ width: '25%' }} body={priceBodyTemplate}></Column>

 </DataTable> */}

 <DataTable value={paradotea} paginator showGridlines rows={10} loading={loading} dataKey="id" 
            filters={filters} globalFilterFields={['id', 'part_number', 'title', 'percentage','ammount','delivery_date','erga_id','timologia_id']} 
            header={header} 
            emptyMessage="No customers found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column field="part_number"  header="part_number"  filter filterPlaceholder="Search by part number" style={{ minWidth: '12rem' }}></Column>
                <Column field="title" header="title"  filter filterPlaceholder="Search by title"  style={{ minWidth: '12rem' }}></Column>
                <Column field="percentage" header="percentage"  style={{ minWidth: '12rem' }}></Column>
                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}
                <Column header="ammount" filterField="ammount" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />

                {/* <Column  field="delivery_date" header="delivery_date" dataType="date" style={{ minWidth: '10rem' }} ></Column> */}
                <Column header="delivery_date" filterField="delivery_date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                {/* <Column field="erga_id" header="erga_id" dataType="numeric"  sortable style={{ minWidth: '2rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate}  ></Column> */}
                <Column header="erga_id" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} ></Column>
                
                
                <Column header="timologia_id" filterField="timologia_id" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={timologiaBodyTemplate} filter filterElement={timologiaFilterTemplate} ></Column>
 </DataTable>
       
    </div>
    )
}

export default ParadoteaList;