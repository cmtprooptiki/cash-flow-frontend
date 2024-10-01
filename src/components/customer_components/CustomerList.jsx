import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig'; // Update the path accordingly
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { PrimeIcons } from 'primereact/api';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Tab } from 'react-bootstrap';


const CustomerList = () => {
    const [customer,setCustomer]=useState([]);

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [customernames, setCustomerNames]=useState([]);

    const {user} = useSelector((state)=>state.auth)
    
    useEffect(()=>{
        getCustomer()
        setLoading(false);

        initFilters();

    },[]);

    const getCustomer = async() =>{
        const response = await axios.get(`${apiBaseUrl}/customer`, {timeout: 5000});
        const paraData = response.data;

        const uniqueNames = [...new Set(paraData.map(item => item.name || 'N/A'))];
        console.log("Unique names:",uniqueNames);
        setCustomerNames(uniqueNames);
        // setCustomer(response.data);

        const parDataWithDates = paraData.map(item => ({
            ...item,
            customernames: {
                ...item.customernames,
                name: item.name || 'N/A'
            }
            
        }));

        console.log(parDataWithDates); // Optionally log the transformed data

        // Assuming you have a state setter like setErga defined somewhere
        setCustomer(parDataWithDates);

    }
    const deleteCustomer = async(customerId)=>{
        await axios.delete(`${apiBaseUrl}/customer/${customerId}`);
        getCustomer();
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

            name: { value: null, matchMode: FilterMatchMode.IN },
            afm: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            doy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            epagelma: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            postal_code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            website: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            
        });
        setGlobalFilterValue('');
    };



//customer

const imageBodyTemplate = (rowData) => {
    return <img src={`${apiBaseUrl}/${rowData.logoImage}`} alt={rowData.logoImage} className="w-6rem shadow-2 border-round" />;
};
const websiteBodyTemplate = (rowData) => {
    return <a href={`${rowData.website}`} alt={rowData.logoImage} >{`${rowData.website}`}</a>;
};
const socialBodyTemplate = (rowData) => {
    return (
        <div>
            <a href={`${rowData.facebookUrl}`} alt={rowData.facebookUrl} ><i className="pi pi-facebook"></i></a> &nbsp; 
            <a href={`${rowData.twitterUrl}`} alt={rowData.twitterUrl} ><i className="pi pi-twitter"></i></a> &nbsp; 
            <a href={`${rowData.linkedInUrl}`} alt={rowData.linkedInUrl} ><i className="pi pi-linkedin"></i></a> &nbsp; 
            <a href={`${rowData.instagramUrl}`} alt={rowData.instagramUrl} ><i className="pi pi-instagram"></i></a> &nbsp; 
        
        </div>
        
        
    );
};

const customerBodyTemplate = (rowData) => {
        
    const customer = rowData.name || 'N/A';        // console.log("repsBodytempl",timologio)
    console.log("customer",customer," type ",typeof(customer));
    console.log("rep body template: ",customer)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{customer}</span>
        </div>
    );
};

const customerFilterTemplate = (options) => {
    console.log('Current timologia filter value:', options.value);

        return (<MultiSelect value={options.value} options={customernames} itemTemplate={customerItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };


const customerItemTemplate = (option) => {
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
                    <Link to={`/customer/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/customer/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/customer/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteCustomer(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }

  return (
     <div className="card" >
        <h1 className='title'>Πελάτες</h1>
        {user && user.role ==="admin" && (
        <Link to={"/customer/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Πελάτη" icon="pi pi-plus-circle"/></Link>
        )}

<DataTable value={customer} paginator 
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={['id', 'name', 
                'afm','doy','epagelma','phone', 'email',
                'address','postal_code','website'
                ]} 
            header={header} 
            emptyMessage="No customers found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column field="logoImage" header="Λογότυπο"  body={imageBodyTemplate}></Column>
                {/* <Column field="name"  header="name"  filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }}></Column> */}
                <Column header="Πελάτης" filterField="name" 
                showFilterMatchModes={false} 
                  filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={customerBodyTemplate} 
                    filter filterElement={customerFilterTemplate} />  
              
                <Column field="afm" header="ΑΦΜ"  filter filterPlaceholder="Search by afm"  style={{ minWidth: '12rem' }}></Column>
                <Column field="doy" header="Δ.Ο.Υ."  filter filterPlaceholder="Search by doy"  style={{ minWidth: '12rem' }}></Column>
                <Column field="epagelma" header="Επάγγελμα"  filter filterPlaceholder="Search by epagelma"  style={{ minWidth: '12rem' }}></Column>
                <Column field="phone"  header="Τηλέφωνο"  filter filterPlaceholder="Search by phone" style={{ minWidth: '12rem' }}></Column>
                <Column field="email" header="email"  filter filterPlaceholder="Search by email"  style={{ minWidth: '12rem' }}></Column>
                <Column field="address"  header="Διεύθυνση"  filter filterPlaceholder="Search by address" style={{ minWidth: '12rem' }}></Column>
                <Column field="postal_code" header="Ταχυδρομικός κωδικός"  filter filterPlaceholder="Search by postal_code"  style={{ minWidth: '12rem' }}></Column>
                <Column field="website" header="Ιστοσελίδα"  filter filterPlaceholder="Search by website" body={websiteBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                <Column field="social-media" header="Social"  body={socialBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                
                


                <Column header="Ενέργειες" field="id" body={actionsBodyTemplate}/>

 </DataTable>


   
                        {/* <td>
                            <Link to={`/customer/profile/${customer.id}`} className='button is-small is-info'>Προφίλ</Link>
                             {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/customer/edit/${customer.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteCustomer(customer.id)} className='button is-small is-danger'>Διαγραφή</button>
                            </div>
                            )}
                            
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table> */}
    </div>
  )
}

export default CustomerList
