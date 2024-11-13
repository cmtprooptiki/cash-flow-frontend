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

import {Dialog} from 'primereact/dialog'

import FormEditErgoCat from '../erga_cat_components/FormEditErgoCat';
import { OverlayPanel } from 'primereact/overlaypanel';

const ErgaCatList = () => {
    const [ergaCat,setErgaCat]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedErgaCatId, setSelectedErgaCatId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedErgaCats, setSelectedErgaCats] = useState([])

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

    const deleteMultipleErgaCats = (ids) => {
        // Assuming you have an API call or logic for deletion
        // Example: If using a REST API for deletion, you might perform a loop or bulk deletion
        if (Array.isArray(ids)) {
            // Handle multiple deletions
            ids.forEach(async (id) => {
                // Existing logic to delete a single Dosi by id, e.g., an API call
                console.log(`Deleting ErgaCat with ID: ${id}`);
                await axios.delete(`${apiBaseUrl}/ergacat/${id}`);

                // Add your deletion logic here
            });
        } else {
            // Fallback for single ID deletion (just in case)
            console.log(`Deleting Erga cats with ID: ${ids}`);
            // Add your deletion logic here
        }
    
        // Optionally update your state after deletion to remove the deleted items from the UI
        setErgaCat((prevErgaCat) => prevErgaCat.filter((ergacat) => !ids.includes(ergacat.id)));
        setSelectedErgaCats([]); // Clear selection after deletion
    };

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
                            <Link to={`/customer/profile/${id}`}>
                                <Button icon="pi pi-eye" severity="info" aria-label="User" />
                            </Link>
                        )}
                        
                        {/* Show all action buttons for admin users */}
                        {user && user.role === "admin" && (
                            <>
                                {/* <Button 
                                className='action-button'
                                    icon="pi pi-eye"
                                    severity="info"
                                    aria-label="User"
                                    onClick={() => {
                                        setSelectedErgaCatId(id);
                                        setSelectedType('Profile');
                                        setDialogVisible(true);
                                    }}
                                /> */}
                                <Button
                                className='action-button'
                                    icon="pi pi-pen-to-square"
                                    severity="info"
                                    aria-label="Edit"
                                    onClick={() => {
                                        setSelectedErgaCatId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteErgaCat(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
               {user && user.role === "admin" && (
                    <span className='flex gap-1'>
                        {/* <Link to={`/paradotea/profile/${id}`} > */}

                            {/* <Button className='action-button' 
                            icon="pi pi-eye" 
                            severity="info" 

                            aria-label="User" 
                            onClick={() => {
                                setSelectedErgaCatId(id);
                                setSelectedType('Profile');
                                setDialogVisible(true);
                            }}
                            /> */}
                        {/* </Link> */}
                        <Button
                            className='action-button'
                            icon="pi pi-pen-to-square"
                            severity="info"
                            aria-label="Edit"
                            onClick={() => {
                                setSelectedErgaCatId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                             <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteErgaCat(id)} />
                             </span>
                        )}
            </div>
 
        );
    }


    return(


        <div className="card" >
                <h1 className='title'>Κατηγορίες Έργων</h1>
                <div className='d-flex align-items-center gap-4'>
                {user && user.role ==="admin" && (
                <Link to={"/ergacat/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέας Κατηγορίας" className='rounded' icon="pi pi-plus-circle"/></Link>
                )}

            {selectedErgaCats.length > 0 && (
            <Button 
                className='button is-primary mb-2 rounded'
                label="Delete Selected" 
                icon="pi pi-trash" 
                severity="danger" 
                onClick={() => deleteMultipleErgaCats(selectedErgaCats.map(ergacat => ergacat.id))} // Pass an array of selected IDs
            />
        )}
        </div>
        
        
        
        <DataTable value={ergaCat} paginator stripedRows 
         rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
                    filters={filters} 
                    globalFilterFields={[
                        'id',
                        'name'
                    ]}
                    header={header} 
                    emptyMessage="No categories found."
                    selection={selectedErgaCats} 
                        onSelectionChange={(e) => setSelectedErgaCats(e.value)} // Updates state when selection changes
                        selectionMode="checkbox">
                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} ></Column>
                        <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                        <Column field="name" header="'Ονομα Κατηγορίας"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
                        <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate}  alignFrozen="right" frozen headerStyle={{ backgroundColor: 'rgb(25, 81, 114)', color: '#ffffff' }} />
                </DataTable>

                <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedErgaCatId && (selectedType=='Edit') && (
            <FormEditErgoCat id={selectedErgaCatId} onHide={() => setDialogVisible(false)} />
            )}
             
        </Dialog>
                </div>
            )
        
}

export default ErgaCatList
