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



const ErgaCatList = () => {
    const [ergaCat,setErgaCat]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {user} = useSelector((state)=>state.auth)
    useEffect(()=>{
        getErgaCat()
        setLoading(false);
        initFilters();
    },[]);

    const getErgaCat = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ergacat`, {timeout: 5000});
        setErgaCat(response.data);
    }
    const deleteErgaCat = async(ergaId)=>{
        await axios.delete(`${apiBaseUrl}/ergacat/${ergaId}`);
        getErgaCat();
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

            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
            

        });
        setGlobalFilterValue('');
        }
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
    const header = renderHeader();

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/ergacat/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteErgaCat(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }


    return(


        <div className="card" >
                <h1 className='title'>Κατηγορίες Έργων</h1>
                {user && user.role ==="admin" && (
                <Link to={"/ergacat/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέας Κατηγορίας" icon="pi pi-plus-circle"/></Link>
                )}
        
        
        
        <DataTable value={ergaCat} paginator stripedRows 
         rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
                    filters={filters} 
                    globalFilterFields={[
                        'id',
                        'name'
                    ]}
                    header={header} 
                    emptyMessage="No categories found.">
                        <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                        <Column field="name" header="'Ονομα Κατηγορίας"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
                        <Column header="Ενέργειες" field="id" body={actionsBodyTemplate}  alignFrozen="right" frozen headerStyle={{ backgroundColor: 'rgb(25, 81, 114)', color: '#ffffff' }} />
                </DataTable>
                </div>
            )
        
}

export default ErgaCatList
