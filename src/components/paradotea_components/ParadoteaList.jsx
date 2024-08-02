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
    const [timologia, setTimologio]=useState([]);
    const [erga, setErgo]=useState([]);

    useEffect(()=>{
        getParadotea()
        setLoading(false);
        initFilters();
    },[]);

    const getParadotea = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/paradotea`);
            const paraData = response.data;
            console.log("ParaData:",paraData);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            console.log("Unique Timologia:",uniqueTimologia);
            setTimologio(uniqueTimologia);

            const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            setErgo(uniqueErga);

            // Convert sign_date to Date object for each item in ergaData
            const parDataWithDates = paraData.map(item => ({
                ...item,
                erga: {
                    ...item.erga,
                    name: item.erga?.name || 'N/A'
                },
                timologia: {
                    ...item.timologia,
                    invoice_number: item.timologia?.invoice_number || 'N/A'
                },
                delivery_date: new Date(item.delivery_date),
                estimate_payment_date: new Date(item.estimate_payment_date),
                estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));
    
            console.log(parDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setParadotea(parDataWithDates);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }


    const deleteParadotea = async(ParadoteoId)=>{
        await axios.delete(`${apiBaseUrl}/paradotea/${ParadoteoId}`);
        getParadotea();
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
            part_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            percentage: { value: null, matchMode: FilterMatchMode.IN },
            delivery_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            
            ammount_vat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ammount_total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            estimate_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            estimate_payment_date_2: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            estimate_payment_date_3: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            
            'erga.name':{ value: null, matchMode: FilterMatchMode.IN },
            'timologia.invoice_number':  { value: null, matchMode: FilterMatchMode.IN },
            

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
    

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
    };





    const ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount);
    };

    const ammount_vatBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_vat);
    };

    const ammount_totalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_total);
    };

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };


  

 //delivery Date
 const deliveryDateBodyTemplate = (rowData) => {
    return formatDate(rowData.delivery_date);
};

const deliveryDateFilterTemplate = (options) => {
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
}


//erga

const ergaBodyTemplate = (rowData) => {
        
    const ergo = rowData.erga?.name || 'N/A';        // console.log("repsBodytempl",timologio)
    console.log("timologio",ergo," type ",typeof(ergo));
    console.log("rep body template: ",ergo)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{ergo}</span>
        </div>
    );
};

const ergaFilterTemplate = (options) => {
    console.log('Current timologia filter value:', options.value);

        return (<MultiSelect value={options.value} options={erga} itemTemplate={ergaItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };


const ergaItemTemplate = (option) => {
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





const timologiaBodyTemplate = (rowData) => {
        
    const timologio = rowData.timologia?.invoice_number || 'N/A';        // console.log("repsBodytempl",timologio)
    console.log("timologio",timologio," type ",typeof(timologio));
    console.log("rep body template: ",timologio)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{timologio}</span>
        </div>
    );
};

const timologiaFilterTemplate = (options) => {
    console.log('Current timologia filter value:', options.value);

        return (<MultiSelect value={options.value} options={timologia} itemTemplate={timologiaItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };


const timologiaItemTemplate = (option) => {
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


    const footer = `In total there are ${paradotea ? paradotea.length : 0} paradotea.`;

    const header = renderHeader();


    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/paradotea/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/paradotea/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/paradotea/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteParadotea(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }

    return(
        <div className="card" >
        <h1 className='title'>Παραδοτέα</h1>
        {user && user.role ==="admin" && (
        <Link to={"/paradotea/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Παραδοτέου" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={paradotea} paginator 
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={['id', 'part_number', 
                'title','delivery_date', 'percentage',
                'ammount','ammount_vat','ammount_total',
                'estimate_payment_date',
                'estimate_payment_date_2',
                'estimate_payment_date_3',
                'erga.name',
                'timologia.invoice_number'
                ]} 
            header={header} 
            emptyMessage="No customers found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column field="part_number"  header="part_number"  filter filterPlaceholder="Search by part number" style={{ minWidth: '12rem' }}></Column>
                <Column field="title" header="title"  filter filterPlaceholder="Search by title"  style={{ minWidth: '12rem' }}></Column>
                <Column header="delivery_date" filterField="delivery_date" dataType="date" style={{ minWidth: '5rem' }} body={deliveryDateBodyTemplate} filter filterElement={deliveryDateFilterTemplate} ></Column>

                <Column field="percentage" header="percentage"  style={{ minWidth: '12rem' }}></Column>
                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}

                <Column header="ammount" filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="ammount_vat" filterField="ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="ammount_total" filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate} filter filterElement={ammountFilterTemplate} />
       
                <Column header="estimate_payment_date" filterField="estimate_payment_date" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate} filter filterElement={estimatePaymentDateFilterTemplate} ></Column>
                <Column header="estimate_payment_date_2" filterField="estimate_payment_date_2" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate2} filter filterElement={estimatePaymentDateFilterTemplate2} ></Column>
                <Column header="estimate_payment_date_3" filterField="estimate_payment_date_3" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate3} filter filterElement={estimatePaymentDateFilterTemplate3} ></Column>
                {/* <Column  field="delivery_date" header="delivery_date" dataType="date" style={{ minWidth: '10rem' }} ></Column> */}
                {/* <Column field="erga_id" header="erga_id" dataType="numeric"  sortable style={{ minWidth: '2rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate}  ></Column> */}
                {/* <Column header="erga.name" filterField="erga.name" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                   ></Column>
                 */}

            <Column header="erga" filterField="erga.name" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={ergaBodyTemplate} filter filterElement={ergaFilterTemplate} />  

             <Column header="timologia" filterField="timologia.invoice_number" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={timologiaBodyTemplate} filter filterElement={timologiaFilterTemplate} />
                <Column header="actions" field="id" body={actionsBodyTemplate}/>

 </DataTable>
       
    </div>
    )
}

export default ParadoteaList;