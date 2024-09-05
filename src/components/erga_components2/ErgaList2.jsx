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


const ErgaList2 = () => {
    const [erga,setErga]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['unsigned', 'signed']);
    const [project_managers, setProjectManager]=useState([]);
    // <td>{ergo.name}</td>
    // <td>{ergo.color}</td>
    // <td>{ergo.sign_ammount_no_tax}</td>
    // <td>{ergo.sign_date}</td>
    // <td>{ergo.status}</td>
    // <td>{ergo.estimate_start_date}</td>
    // <td>{ergo.project_manager }</td>
    // <td>{ergo.customer_id}</td>
    // <td>{ergo.shortname}</td>
    // <td>{ergo.ammount}</td>
    // <td>{ergo.ammount_vat}</td>
    // <td>{ergo.ammount_total}</td>
    // <td>{ergo.estimate_payment_date}</td>
    // <td>{ergo.estimate_payment_date_2}</td>
    // <td>{ergo.estimate_payment_date_3}</td>
    // <td>{ergo.erga_cat_id}</td>

    // const columns = [
    //     {field: 'id', header: 'id'},
    //     {field: 'name', header: 'name'},
    //     {field: 'shortname', header: 'shortname'},
    //     {field: 'status', header: 'status'},
    //     {field: 'sign_date', header: 'sign_date'},
    //     {field: 'sign_ammount_no_tax', header: 'sign_ammount_no_tax'},
    //     {field:'project_manager', header:'project_manager'},
    //     {field: 'ammount', header: 'ammount'},
    //     {field:'ammount_vat', header:'ammount_vat'},
    //     {field:'ammount_total', header:'ammount_total'},
    //     {field:'estimate_payment_date', header:'estimate_payment_date'},
    //     {field:'estimate_payment_date_2', header:'estimate_payment_date_2'},
    //     {field:'estimate_payment_date_3', header:'estimate_payment_date_3'}
    // ];

    const getSeverity = (status) => {
        switch (status) {
            case 'unsigned':
                return 'danger';

            case 'signed':
                return 'success';

         
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
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            shortname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            sign_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            estimate_start_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            project_manager:  { value: null, matchMode: FilterMatchMode.IN },

            ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ammount_vat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ammount_total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            estimate_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            estimate_payment_date_2: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            estimate_payment_date_3: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            customer_id:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
            "customer.name":{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
            erga_cat_id:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
            "erga_category.name":{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]}
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


    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };


    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
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


    const signed_ammount_notaxBodyTemplate = (rowData)=> {
        return formatCurrency(rowData.sign_ammount_no_tax);
    };

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };


    const projectManagerBodyTemplate = (rowData) => {
        const project_manager = rowData.project_manager;
        console.log("rep body template: ",project_manager)
        return (
            <div className="flex align-items-center gap-2">
                <span>{project_manager}</span>
            </div>
        );
    };

    const projectManagerFilterTemplate = (options) => {
        console.log('Current projectmanager filter value:', options);

        return (<MultiSelect value={options.value} options={project_managers} itemTemplate={projectManagerItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };

    const projectManagerItemTemplate = (option) => {
        console.log("rep Item template: ",option)

        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };

    const categoriesNameTemplate = (rowData) => {
        const catName = rowData.erga_category.name;
        console.log("cat body template: ",catName)
        return (
            <div className="flex align-items-center gap-2">
                <span>{catName}</span>
            </div>
        );
    };

    const categoriesNameFilterTemplate = (options) => {
        return (<MultiSelect value={options.value} options={project_managers} itemTemplate={categoriesNameItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };

    const categoriesNameItemTemplate = (option) => {
        console.log("rep Item template: ",option)

        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };



    useEffect(()=>{
        getErga()
        setLoading(false);
        initFilters();
    },[]);

    const getErga = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/erga`);
            const ergaData = response.data;
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // .map(name => ({ name }));
            setProjectManager(uniqueProjectManager);
            // Convert sign_date to Date object for each item in ergaData
            const ergaDataWithDates = ergaData.map(item => ({
                ...item,
                sign_date: new Date(item.sign_date),
                estimate_start_date: new Date(item.estimate_start_date),
                estimate_payment_date:new Date(item.estimate_payment_date),
                estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));
    
            console.log(ergaDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setErga(ergaDataWithDates);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }


    const deleteErga = async(ergaId)=>{
        await axios.delete(`${apiBaseUrl}/erga/${ergaId}`);
        getErga();
    }

    const header = renderHeader();

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
            {user && user.role ==="admin" && (
            <span>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"  onClick={()=>deleteErga(id)} />
            </span>
            
            )}
            </div>

        );
    }

  

  return (
    <div className="card" >
    <h1 className='title'>Εργα</h1>
    {user && user.role ==="admin" && (
    <Link to={"/erga2/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Έργου" icon="pi pi-plus-circle"/></Link>
    )}
    <DataTable value={erga} paginator showGridlines rows={10} scrollable scrollHeight="400px" loading={loading} dataKey="id" 
            filters={filters} globalFilterFields={['name'
                ,'shortname','sign_ammount_no_tax'
                ,'sign_date', 'status', 'estimate_start_date'
                ,'project_manager','ammount','ammount_vat','ammount_total'
                ,'estimate_payment_date','estimate_payment_date_2','estimate_payment_date_3'
                ,'customer_id','customer.name','erga_cat_id','erga_category.name']} header={header}
            emptyMessage="No customers found.">
        <Column field="name" header="name" filter filterPlaceholder="Search by name" style={{ minWidth: '5rem' }} />
        <Column field="shortname" header="shortname" filter filterPlaceholder="Search by shortname" style={{ minWidth: '5rem' }} />
        <Column header="sign_date" filterField="sign_date" dataType="date" style={{ minWidth: '5rem' }} body={signDateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>

        <Column field="status" header="status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
        <Column header="sign_ammount_no_tax" filterField="sign_ammount_no_tax" dataType="numeric" style={{ minWidth: '10rem' }} body={signed_ammount_notaxBodyTemplate} filter filterElement={ammountFilterTemplate} />

        <Column header="ammount" filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
        <Column header="ammount_vat" filterField="ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filter filterElement={ammountFilterTemplate} />
        <Column header="ammount_total" filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate} filter filterElement={ammountFilterTemplate} />
        <Column header="estimate_start_date" filterField="estimate_start_date" dataType="date" style={{ minWidth: '5rem' }} body={estimateStartDateBodyTemplate} filter filterElement={estimateStartDateFilterTemplate} ></Column>
        <Column header="estimate_payment_date" filterField="estimate_payment_date" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate} filter filterElement={estimatePaymentDateFilterTemplate} ></Column>
        <Column header="estimate_payment_date_2" filterField="estimate_payment_date_2" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate2} filter filterElement={estimatePaymentDateFilterTemplate2} ></Column>
        <Column header="estimate_payment_date_3" filterField="estimate_payment_date_3" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate3} filter filterElement={estimatePaymentDateFilterTemplate3} ></Column>
        <Column header="project_manager" filterField="project_manager" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={projectManagerBodyTemplate} filter filterElement={projectManagerFilterTemplate} />
        
        <Column field="customer_id" header="customer_id" filter filterPlaceholder="Search by customer id" style={{ minWidth: '5rem' }}/>
        <Column field="customer.name" header="customer.name" filter filterPlaceholder="Search by customer name" style={{ minWidth: '5rem' }}/>
        <Column field="erga_cat_id" header="erga_cat_id" filter filterPlaceholder="Search by erga tag" style={{ minWidth: '5rem' }}/>
        <Column field="erga_category.name" header="erga_category" filter filterPlaceholder="Search by erga cat name" style={{ minWidth: '5rem' }} />
        <Column header="actions" field="id" body={actionsBodyTemplate}/>
        {/* <Column header="Agent" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
            body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} /> */}
        {/* <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
        <Column header="Balance" filterField="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
        <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} /> */}
    </DataTable>
</div>
  )
}

export default ErgaList2
