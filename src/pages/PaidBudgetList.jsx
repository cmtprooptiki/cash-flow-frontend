import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../buildinglist.css';
import apiBaseUrl from '../apiConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import apiBaseFrontUrl from '../apiFrontConfig';
import { Calendar } from 'primereact/calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Divider } from 'primereact/divider';
import {ReactComponent as IncomeIcon } from '../icons/income_icon.svg';
import {ReactComponent as CostIcon } from '../icons/cost_icon.svg';
import { MultiSelect } from 'primereact/multiselect';
import robotoData from '../components/report_components/robotoBase64.json'
import { jsPDF } from "jspdf";




const PaidBudgetList = (props) => {
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Bank', 'Customer','Paradotea','Timologia','doseis','Daneia']);
    const [totalIncome, setTotalIncome] = useState(0);
    const [filtercalled,setfiltercalled]=useState(false);
    const [filteredData, setFilteredData] = useState([])

    const budget = props.budget
    const combinedData3=props.combinedData3
    

    // console.log("combined prop: ",combinedData3)

    const[selectedIdType,setSelectedIdType]=useState([])

    const [visible, setVisible] = useState(false); // State to control the visibility of the popup
    const [selectedRowData, setSelectedRowData] = useState(null); // State to store the row data to display

    const ergo = props.Ergo
    const customer = props.Customer
    const provider = props.Provider
    // const uniqueErga= [...new Set(combinedData3.map(item => item.ergo || 'N/A'))];
    // setErgo(uniqueErga);
    //     const uniqueCustomers = [...new Set(combinedData3.map(item => item?.customer || 'N/A'))]
    //     setCustomer(uniqueCustomers)


    

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setFilteredData(combinedData3)
        // fetchData();
        setLoading(false);
        initFilters();
    }, []);

    const getParadoteoId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/paradotea/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getTimologioId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/timologia/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getDaneioId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/daneia/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getDosiId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/doseis/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getEkxId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/ek_tim/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
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
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            income: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ergo: { value: null, matchMode: FilterMatchMode.IN },
            customer: { value: null, matchMode: FilterMatchMode.IN },
            provider: { value: null, matchMode: FilterMatchMode.IN }
        });
        setGlobalFilterValue('');
    };

    const formatDate = (value) => {
        if(value===null || value===''){
            return ''
        }
        let date = new Date(value);
        if (!isNaN(date)) {
            return date.toLocaleDateString('en-UK', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              
            });
        } else {
            
            return "Invalid date";
        }
    };

  //Sign Date
  const DateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
};


    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;
    
    const cols = [
        { field: 'date', header: 'Ημερομηνία' },
        { field: 'income', header: 'Εισροές/Εκροές' },
        { field: 'type', header: 'Τύπος Εισροής/Εκροής' },    
        { field: 'ergo', header: 'Έργο' },
        { field: 'customer', header: 'Πελάτης' },
        { field: 'provider', header: 'Προμηθευτής-έξοδο' },
        { field: 'id', header: 'Id' },
        ];
    
        const callAddFont = function () {
          this.addFileToVFS('Roboto-Regular-normal.ttf', robotoBase64);
          this.addFont('Roboto-Regular-normal.ttf', 'Roboto-Regular', 'normal');
        };
        
        // Step 2: Register the font adding event
        jsPDF.API.events.push(['addFonts', callAddFont]);
        
        const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

        const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            // Create the headers based on the 'cols' array
            const headers = cols.map(col => col.header);
    
            // Create data rows with headers first
            const data = [
                headers,  // First row with headers
                ...filteredData.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'ammount' or any other amount field that needs formatting
                        if (col.field === 'income') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'ammount'
                        }
                        
                        
                        return product[col.field];  // Return the value as is for other fields
                    })
                )
            ];
    
            // Convert data to Excel worksheet
            const worksheet = xlsx.utils.aoa_to_sheet(data);  // 'aoa_to_sheet' takes 2D array with headers
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    
            // Generate Excel file and save it
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
    
            saveAsExcelFile(excelBuffer, 'Budget_Calendar_Table');
        });
    };
    



    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const formatCurrencyReport = (value) => {
        return Number(value);
    };




const dateFilterTemplate = (options) => {

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="dd/mm/yyyy" mask="99/99/9999" />;
};


const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ammountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.income);
};


const ammountFilterTemplate = (options) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
};


const getSeverity = (status) => {
    switch (status) {
        case 'Bank':
            return 'danger';
        case 'Customer':
            return 'danger';
        case 'Paradotea':
            return 'info';
        case 'Timologia':
            return 'success';
        case 'Daneia':
            return 'warning';
        default :
            return 'info';
    }
};

const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.type} severity={getSeverity(rowData.type)} />;
};

const statusFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
};

const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
};

const handleRowData = (rowData) => {
    setSelectedRowData(rowData);
    setSelectedIdType(rowData.type)
    if(rowData.type ==="Paradotea"){
        getParadoteoId(rowData.id)
    }else if(rowData.type ==="Timologia"){
        getTimologioId(rowData.id)
    }else if(rowData.type ==="Daneia"){
        getDaneioId(rowData.id)
    }else if(rowData.type ==="doseis"){
        getDosiId(rowData.id)
    }else if(rowData.type ==="Bank" || rowData.type==="Customer"){
        getEkxId(rowData.id)
    }
    
    setVisible(true);
};
const idBodyTemplate = (rowData) => {
    return (
        <Button label={rowData.id} onClick={() => handleRowData(rowData)} />
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
                <Button className='action-button'  type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            </div>
        );
    };

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        const final= data.reduce((acc, item) => Number(acc) + Number(item.income), 0);
        // return data.reduce((acc, item) => acc + item.income, 0);
        // console.log("type: ",typeof(final)," final: ",final)
        return parseFloat(final)+parseFloat(budget);
    };

    const ErgoBodyTemplate = (rowData) => {
        return (
        <div className="flex align-items-center gap-2">
            <span>{rowData.ergo}</span>
        </div>
    );
    };


    const ProviderBodyTemplate = (rowData) => {
        return (
        <div className="flex align-items-center gap-2">
            <span>{rowData.provider}</span>
        </div>
    );
    };

    const ProviderFilterTemplate = (options) => {
            console.log('Current timologia filter value:', options.value);
        
                return (<MultiSelect value={options.value} options={provider} itemTemplate={ProviderItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
        
            };
        
        
        const ProviderItemTemplate = (option) => {
            console.log("rep Item template: ",option)
            console.log("rep Item type: ",typeof(option))
        
            return (
                <div className="flex align-items-center gap-2">
                    <span>{option}</span>
                </div>
            );
        };

    const CustomerBodyTemplate = (rowData) => {
        return (
        <div className="flex align-items-center gap-2">
            <span>{rowData.customer}</span>
        </div>
    );
    };


     const ergaFilterTemplate = (options) => {
            console.log('Current timologia filter value:', options.value);
        
                return (<MultiSelect value={options.value} options={ergo} itemTemplate={ergaItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
        
            };
        
        
        const ergaItemTemplate = (option) => {
            console.log("rep Item template: ",option)
            console.log("rep Item type: ",typeof(option))
        
            return (
                <div className="flex align-items-center gap-2">
                    <span>{option}</span>
                </div>
            );
        };
    
        const CustomerFilterTemplate = (options) => {
            console.log('Current timologia filter value:', options.value);
        
                return (<MultiSelect value={options.value} options={customer} itemTemplate={CustomerItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
        
            };
        
        
        const CustomerItemTemplate = (option) => {
            console.log("rep Item template: ",option)
            console.log("rep Item type: ",typeof(option))
        
            return (
                <div className="flex align-items-center gap-2">
                    <span>{option}</span>
                </div>
            );
        };
    

    
    // useEffect(()=>{
    //     console.log("scenario ",scenario)
    //     if(scenario==="table1"){
    //         const combinedData2 = [
    //             ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //             ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id})),
    //             ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.paradotea_id })),
    //             ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.timologia_id })),
    //             ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //             ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: (-1)*item.ammount , type: 'doseis', id: item.id }))
    //         ];
    //         setCombinedData(combinedData2)
    //     }else if(scenario==="table2"){
    //         const combinedData2 = [
    //             ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //             ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
    //             ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_2), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.paradotea_id })),
    //             ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.timologia_id})),
    //             ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //             ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: (-1)*item.ammount , type: 'doseis', id: item.id }))
    //         ];
    //         setCombinedData(combinedData2)
    //     }else if(scenario==="table3"){
    //         const combinedData2 = [
    //             ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
    //             ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
    //             ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_3), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.paradotea_id })),
    //             ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.timologia_id })),
    //             ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: item.ammount, type: 'Daneia', id: item.id })),
    //             ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: (-1)*item.ammount , type: 'doseis', id: item.id }))
    //         ];
    //         setCombinedData(combinedData2)
    //     }

        
        
        

    // },[paradotea,ekxorimena,incomeTim,daneia,doseis,scenario])
    





    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome( combinedData3)));
        }
        
    }, [combinedData3,budget,filtercalled]);


    const handleValueChange = (e) => {
        const visibleRows = e;
        // console.log("visisble rows:",e);
        if(e.length>0){
            setfiltercalled(true)
        }

        // // Calculate total income for the visible rows
        const incomeSum = parseFloat(budget)+ visibleRows.reduce((sum, row) => sum + Number((row.income || 0)), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
    };

    const header = renderHeader();

    

    return (
        <div>
            
           
              <br></br>

            <DataTable value={combinedData3} paginator rows={10} 
            header={header} 
            filters={filters} 
            filterDisplay="menu" loading={loading} 
            responsiveLayout="scroll" 
            globalFilterFields={['date', 'income', 'type','ergo','customer', 'provider','id']}
            // onFilter={(e) => handleFilter(e.filteredValue)}
            onFilter={(e)=>setFilters(e.filters)}
            onValueChange = {(comb) => { setFilteredData(comb); handleValueChange(comb); }}            
            >
                <Column filterField="date" header="Ημερομηνία" dataType="date" style={{ minWidth: '5rem' }} body={DateBodyTemplate} filter filterElement={dateFilterTemplate} sortable sortField="date" ></Column>
                <Column filterField="income" header="Εισροές/Εκροές" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalIncome} ></Column>
                <Column field="type" header="Τύπος εισροής/εκροής" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column header="Εργο" filterField="ergo" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body = {ErgoBodyTemplate} filter filterElement = {ergaFilterTemplate}/>
                
                <Column header="Πελάτης" filterField="customer" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body = {CustomerBodyTemplate} filter filterElement = {CustomerFilterTemplate}/>

                <Column header="Υποχρέωση" filterField="provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body = {ProviderBodyTemplate} filter filterElement = {ProviderFilterTemplate}/>

                <Column field="id" header="Id" body={idBodyTemplate} filter ></Column>

            </DataTable>


            <Dialog header="Πληροφορίες" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                {selectedRowData && selectedIdType==="Paradotea" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}>
                        <h3>Παραδοτέο</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Τίτλος παραδοτέου:</strong> {selectedRowData.title}</p>
                        <p><strong>Παραδοτέο (Αριθμός): </strong>{selectedRowData.part_number}</p>
                        <p><strong>Ημερομηνία υποβολής: </strong>{formatDate(selectedRowData.delivery_date)}</p>
                        <p><strong>Ποσοστό σύμβασης: </strong>{selectedRowData.percentage} %</p>
                        <p><strong>Ποσό  (καθαρή αξία): </strong>{formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ποσό ΦΠΑ: </strong>{formatCurrency(selectedRowData.ammount_vat)}</p>
                        <p><strong>Σύνολο: </strong>{formatCurrency(selectedRowData.ammount_total)}</p>
                        <p><strong>Ημερομηνία πληρωμής (εκτίμηση): </strong>{formatDate(selectedRowData.estimate_payment_date)}</p>
                        <p><strong>Ημερομηνία πληρωμής  (εκτίμηση 2): </strong>{formatDate(selectedRowData.estimate_payment_date_2)}</p>
                        <p><strong>Ημερομηνία πληρωμής  (εκτίμηση 3): </strong>{formatDate(selectedRowData.estimate_payment_date_3)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/edit/${selectedRowData.id}`}>Επεξεργασία παραδοτέου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/profile/${selectedRowData.id}`}>Πληροφορίες παραδοτέου</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="Timologia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}><h3>Τιμολόγιο</h3>  
                            <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Αρ. τιμολογίου:</strong> {selectedRowData.invoice_number}</p>
                        <p><strong>Ημερομηνία έκδοσης τιμολογίου:</strong> {formatDate(selectedRowData.invoice_date)}</p>
                        <p><strong>Ποσό τιμολογίου  (καθαρή αξία):</strong> {formatCurrency(selectedRowData.ammount_no_tax)}</p>
                        <p><strong>Ποσό ΦΠΑ:</strong>{formatCurrency(selectedRowData.ammount_tax_incl)}</p>
                        <p><strong>Πληρωτέο:</strong>{formatCurrency(selectedRowData.ammount_of_income_tax_incl)}</p>
                        <p><strong>Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)</strong> {formatDate(selectedRowData.actual_payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/edit/${selectedRowData.id}`}>Επεξεργασία τιμολογίου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/profile/${selectedRowData.id}`}>Πληροφορίες τιμολογίου</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="doseis" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}>
                            <h3>Δόση</h3>

                            <CostIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Ποσό:</strong> {formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Πραγματική ημερομηνία πληρωμής:</strong> {formatDate(selectedRowData.actual_payment_date)}</p>
                        <p><strong>Εκτιμώμενη ημερομηνία πληρωμής:</strong> {formatDate(selectedRowData.estimate_payment_date)}</p>
                        <p><strong>Κατάσταση:</strong> {selectedRowData.status}</p>
                        <p><strong>id υποχρεωσης:</strong> {selectedRowData.ypoxreoseis_id}</p>
                        <p><strong>Προμηθευτής-έξοδο:</strong> {selectedRowData.ypoxreosei?.provider}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/doseis/edit/${selectedRowData.id}`}>Επεξεργασία δόσης</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/doseis/profile/${selectedRowData.id}`}>Πληροφορίες δόσης</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="Daneia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}} >

                        <h3>Δάνειο</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Περιγραφή:</strong> {selectedRowData.name}</p>
                        <p><strong>Ποσό:</strong> {formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής δανείου(εκτίμηση):</strong> {formatDate(selectedRowData.payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/edit/${selectedRowData.id}`}>Επεξεργασία δανείου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/profile/${selectedRowData.id}`}>Πληροφορίες δανείου</a></strong></p>
                    </div>
                )}
                {selectedRowData && (selectedIdType==="Bank" || selectedIdType==="Customer") && (
                    
                    <div>
                        {console.log("Kantoooo", selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}>  

                        <h3>Εκχώρηση</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Συσχέτιση με τιμολόγιο Id:</strong> {selectedRowData.timologia_id}</p>
                        <p><strong>Εκχώρηση (€): </strong>{formatCurrency(selectedRowData.bank_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από τράπεζα (εκτίμηση): </strong>{formatDate(selectedRowData.bank_estimated_date)}</p>
                        <p><strong>Υπόλοιπο από πελάτη (€): </strong>{formatCurrency(selectedRowData.customer_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από πελάτη (εκτίμηση): </strong>{formatDate(selectedRowData.cust_estimated_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/edit/${selectedRowData.id}`}>Επεξεργασία εκχώρησης</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/profile/${selectedRowData.id}`}>Πληροφορίες εκχώρησης</a></strong></p>
                    </div>
                )}
            </Dialog>



        </div>
    );
};

export default PaidBudgetList;
