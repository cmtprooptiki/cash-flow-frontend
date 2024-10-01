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

const TagList2 = ()=>
{
    const [tags, setTags] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {user} = useSelector((state) => state.auth)
    useEffect(()=>{
        getTags();
        setLoading(false);
        initFilters();
    },[]);

    const getTags = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/tags`, {timeout: 5000});
            const tags_data = response.data;
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            // console.log("Unique Timologia:",uniqueTimologia);
            // setTimologio(uniqueTimologia);

            // const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            // setErgo(uniqueErga);

           

    
            // Assuming you have a state setter like setErga defined somewhere
            setTags(tags_data);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }
    const deleteTags = async(tagsId)=>{
        await axios.delete(`${apiBaseUrl}/tags/${tagsId}`);
        getTags();
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
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/tags2/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteTags(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }

    return(


<div className="card" >
        <h1 className='title'>Tags</h1>
        
        {user && user.role ==="admin" && (
        <Link to={"/tags2/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Tag" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={tags} paginator 
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'id',
                'name'
            ]}
            header={header} 
            emptyMessage="No Tags found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column field="name" header="name"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
                <Column header="actions" field="id" body={actionsBodyTemplate}/>
        </DataTable>
        
        </div>
    )
}

export default TagList2;