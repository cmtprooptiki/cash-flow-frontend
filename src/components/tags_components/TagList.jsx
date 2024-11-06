import React,{useState,useEffect, useRef} from 'react'
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

import { Dialog } from 'primereact/dialog';
import FormProfileTags from './FormProfileTags';
import FormEditTags from './FormEditTags';
import { OverlayPanel } from 'primereact/overlaypanel';

const TagList = ()=>
{
    const [tags, setTags] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);


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
            <div className="header-container flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                  {/* Responsive Search Field */}
               <div className="responsive-search-field">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Keyword Search"
                        />
                    </IconField>
                </div>
            </div>
        );
    };
    const header = renderHeader();
    
    // const actionsBodyTemplate=(rowData)=>{
    //     const id=rowData.id
    //     return(
    //         <div className=" flex flex-wrap justify-content-center gap-3">
               
    //         {user && user.role!=="admin" &&(
    //             <div>
    //                 <Link to={`/tags/profile/${id}`} ><Button className='action-button'  severity="info" label="Προφίλ" text raised /></Link>
    //             </div>
    //         )}
    //         {user && user.role ==="admin" && (
    //         <span className='flex gap-1'>
    //             <Link to={`/tags/profile/${id}`} ><Button className='action-button'  icon="pi pi-eye" severity="info" aria-label="User" />
    //             </Link>
    //             <Link to={`/tags/edit/${id}`}><Button className='action-button'  icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
    //             <Button className='action-button'  icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteTags(id)} />
    //             {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
    //        </span>
           
    //         )}
    //         </div>
 
    //     );
    // }

    const ActionsBodyTemplate = (rowData) => {
        const id = rowData.id;
        const op = useRef(null);
        const [hideTimeout, setHideTimeout] = useState(null);
    
        // Show overlay on mouse over
        const handleMouseEnter = (e) => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                setHideTimeout(null);
            }
            op.current.show(e);
        };
    
        // Hide overlay with delay on mouse leave
        const handleMouseLeave = () => {
            const timeout = setTimeout(() => {
                op.current.hide();
            }, 100); // Adjust delay as needed
            setHideTimeout(timeout);
        };
    
        return (
            <div className="actions-container">
                {/* Three dots button */}
                <Button 
                    icon="pi pi-ellipsis-v" 
                    className="p-button-text"
                    aria-label="Actions"
                    onMouseEnter={handleMouseEnter} // Show overlay on hover
                    onMouseLeave={handleMouseLeave} // Start hide timeout on mouse leave
                />
    
                {/* OverlayPanel containing action buttons in a row */}
                <OverlayPanel 
                    ref={op} 
                    onClick={() => op.current.hide()} 
                    dismissable 
                    onMouseLeave={handleMouseLeave} // Hide on overlay mouse leave
                    onMouseEnter={() => {
                        if (hideTimeout) clearTimeout(hideTimeout);
                    }} // Clear hide timeout on overlay mouse enter
                >
                    <div className="flex flex-row gap-2">
                        {/* Only show the Profile button for non-admin users */}
                        {user && user.role !== "admin" && (
                            <Link to={`/tags/profile/${id}`}>
                                <Button icon="pi pi-eye" severity="info" aria-label="User" />
                            </Link>
                        )}
                        
                        {/* Show all action buttons for admin users */}
                        {user && user.role === "admin" && (
                            <>
                                <Button 
                                className='action-button'
                                    icon="pi pi-eye"
                                    severity="info"
                                    aria-label="User"
                                    onClick={() => {
                                        setSelectedTagId(id);
                                        setSelectedType('Profile');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-pen-to-square"
                                    severity="info"
                                    aria-label="Edit"
                                    onClick={() => {
                                        setSelectedTagId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteTags(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
            </div>
        );
    };



    const actionsBodyTemplate = (rowData) => {
        const id = rowData.id;
        return (
            <div className="flex flex-wrap justify-content-center gap-3">
                {user && user.role !== "admin" && (
                    <div>
                        <Link to={`/tags/profile/${id}`} >
                            <Button severity="info" label="Προφίλ" text raised />
                        </Link>
                    </div>
                )}
                {user && user.role === "admin" && (
                    <span className='flex gap-1'>
                        {/* <Link to={`/paradotea/profile/${id}`} > */}

                            <Button className='action-button' 
                            icon="pi pi-eye" 
                            severity="info" 

                            aria-label="User" 
                            onClick={() => {
                                setSelectedTagId(id);
                                setSelectedType('Profile');
                                setDialogVisible(true);
                            }}
                            />
                        {/* </Link> */}
                        <Button
                            className='action-button'
                            icon="pi pi-pen-to-square"
                            severity="info"
                            aria-label="Edit"
                            onClick={() => {
                                setSelectedTagId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                        <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteTags(id)} />
                    </span>
                )}
            </div>
        );
    };
    
    return(


<div className="card" >
        <h1 className='title'>Tags</h1>
        {user && user.role ==="admin" && (
        <Link to={"/tags/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Tag" icon="pi pi-plus-circle"/></Link>
        )}



        <DataTable value={tags} paginator stripedRows
        rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
                    filters={filters} 
                    globalFilterFields={[
                        'id',
                        'name'
                    ]}
                    header={header} 
                    emptyMessage="No doseis found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column field="name" header="Όνομα Ετικέτας"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
                <Column header="Ένέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen/>
        </DataTable>

        <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedTagId && (selectedType=='Edit') && (
            <FormEditTags id={selectedTagId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedTagId && (selectedType=='Profile') && (
            <FormProfileTags id={selectedTagId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>
        
        

        </div>

        
    )
}

export default TagList;