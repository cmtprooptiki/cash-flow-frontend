import React,{useEffect,useState} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
// import YpoxreoseisList from '../../components/ypoxreoseis_components/YpoxreoseisList'

import { Button } from 'primereact/button';

import { Knob } from 'primereact/knob';

import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { CustomerService } from './service/CustomerService';
import PaidList from '../../components/paid_components/PaidLists'
import { Ripple } from 'primereact/ripple';
import BudgetChart from '../../components/paid_components/BudgetChart'

///////////////////////
//import { classNames } from 'primereact/utils';
//import { FilterMatchMode, FilterOperator } from 'primereact/api';
//import { DataTable } from 'primereact/datatable';
//import { Column } from 'primereact/column';
//import { InputText } from 'primereact/inputtext';
//import { IconField } from 'primereact/iconfield';
//import { InputIcon } from 'primereact/inputicon';
//import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
//import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
//import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
//import { Tag } from 'primereact/tag';
//import { TriStateCheckbox } from 'primereact/tristatecheckbox';
//import { CustomerService } from './service/CustomerService';

import axios from 'axios'
import apiBaseUrl from '../../apiConfig';
///////////////////////

const PaidView = () =>
{
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError} = useSelector((state=>state.auth));

  useEffect(()=>{
      dispatch(getMe());
  },[dispatch]);

  useEffect(()=>{
      if(isError){
          navigate("/");
      }
  },[isError,navigate]);

  const [value, setValue] = useState(0);

  //////////////////////////////////////////////
//   const [customers, setCustomers] = useState(null);
  
//     const [filters, setFilters] = useState({
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         status: { value: null, matchMode: FilterMatchMode.EQUALS },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     });
//     const [loading, setLoading] = useState(true);
//     const [globalFilterValue, setGlobalFilterValue] = useState('');
//     const [representatives] = useState([
//         { name: 'Amy Elsner', image: 'amyelsner.png' },
//         { name: 'Anna Fali', image: 'annafali.png' },
//         { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//         { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//         { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//         { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//         { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//         { name: 'Onyama Limba', image: 'onyamalimba.png' },
//         { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//         { name: 'XuXue Feng', image: 'xuxuefeng.png' }
//     ]);
//     const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

//     const getSeverity = (status) => {
//         switch (status) {
//             case 'unqualified':
//                 return 'danger';

//             case 'qualified':
//                 return 'success';

//             case 'new':
//                 return 'info';

//             case 'negotiation':
//                 return 'warning';

//             case 'renewal':
//                 return null;
//         }
//     };

//     useEffect(() => {
//         CustomerService.getCustomersMedium().then((data) => {
//             setCustomers(getCustomers(data));
//             setLoading(false);
//         });
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const getCustomers = (data) => {
//         return [...(data || [])].map((d) => {
//             d.date = new Date(d.date);

//             return d;
//         });
//     };

//     const onGlobalFilterChange = (e) => {
//         const value = e.target.value;
//         let _filters = { ...filters };

//         _filters['global'].value = value;

//         setFilters(_filters);
//         setGlobalFilterValue(value);
//     };

//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <IconField iconPosition="left">
//                     <InputIcon className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//                 </IconField>
//             </div>
//         );
//     };

//     const countryBodyTemplate = (rowData) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//                 <span>{rowData.country.name}</span>
//             </div>
//         );
//     };

//     const representativeBodyTemplate = (rowData) => {
//         const representative = rowData.representative;

//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
//                 <span>{representative.name}</span>
//                 {console.log("type of representative ",representative.name," is:",typeof(representative.name))}
//             </div>
//         );
//     };

//     const representativesItemTemplate = (option) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
//                 <span>{option.name}</span>
                
//             </div>
//         );
//     };

//     const statusBodyTemplate = (rowData) => {
//         return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
//     };

//     const statusItemTemplate = (option) => {
//         return <Tag value={option} severity={getSeverity(option)} />;
//     };

//     const verifiedBodyTemplate = (rowData) => {
//         return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
//     };

//     const representativeRowFilterTemplate = (options) => {
//         console.log("Representative typeof: ",typeof(representatives))
//         console.log("show option.value: ",options.value)
//         console.log("show option.value typeof: ",typeof(options.value))
//         return (
//             <MultiSelect
//                 value={options.value}
//                 options={representatives}
//                 itemTemplate={representativesItemTemplate}
//                 onChange={(e) => options.filterApplyCallback(e.value)}
//                 optionLabel="name"
//                 placeholder="Any"
//                 className="p-column-filter"
//                 maxSelectedLabels={1}
//                 style={{ minWidth: '14rem' }}
//             />
//         );
//     };

//     const statusRowFilterTemplate = (options) => {
//         return (
//             <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
//         );
//     };

//     const verifiedRowFilterTemplate = (options) => {
//         return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
//     };

//     const header = renderHeader();
    //////////////////////////////////////////////////////////////////////
    const[erga,setErga]=useState(null)
    // const [representatives, setProjectManager]=useState(null);


    const getErga = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/erga`);
            const ergaData = response.data;
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // .map(name => ({ name }));

            // setProjectManager(uniqueProjectManager);
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
            setRepresentatives(uniqueProjectManager)
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }




    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [representatives, setRepresentatives]=useState([]);

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => {
            getErga()
            setCustomers(getCustomers(data));
            setLoading(false);
        });
        initFilters();
    }, []);

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
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
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            project_manager: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
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

    
    const representativeBodyTemplate = (rowData) => {
        const project_manager = rowData.project_manager;
        console.log("rep body template: ",project_manager)
        return (
            <div className="flex align-items-center gap-2">
                <span>{project_manager}</span>
            </div>
        );
    };

    const representativeFilterTemplate = (options) => {
        return (<MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    };

    const representativesItemTemplate = (option) => {
        console.log("rep Item template: ",option)

        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };



    const header = renderHeader();
    /////////////////////////////////////////////////////////////////////
  return (
    // <Layout>
    //     {/* <YpoxreoseisList/> */}
    //     <Button label="PrimeReact" />
    //     <div className="card flex justify-content-center">
    //         <Button label="Check" icon="pi pi-check" />
    //     </div>
    //     <div className="card flex justify-content-center">
    //         <Knob value={value} onChange={(e) => setValue(e.value)} />
    //     </div>
    //     <div className="card">
    //         <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
    //                 globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No customers found.">
    //             <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
    //             <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
    //             <Column header="Agent" filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
    //                 body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
    //             <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
    //             <Column field="verified" header="Verified" dataType="boolean" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
    //         </DataTable>
    //     </div>

        
    // </Layout>
    // <div className="card">
    //         <DataTable value={erga} paginator showGridlines rows={10} loading={loading} dataKey="id" 
    //                 filters={filters} 
    //                 globalFilterFields={[ 'project_manager']} 
    //                 header={header}
    //                 emptyMessage="No customers found.">
                
    //             <Column header="Agent" filterField="project_manager" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
    //                 body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} />
                
    //         </DataTable>
    //     </div>
    <div><Layout>
        <PaidList/>
        <BudgetChart></BudgetChart>
    
    
    </Layout></div>
  )
}

export default PaidView