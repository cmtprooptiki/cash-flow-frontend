import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import apiBaseFrontUrl from '../../apiFrontConfig';

const PaidList = (props) => {
    const [paradotea, setIncomeParadotea] = useState([]);
    const [ekxorimena, setEkxorimena] = useState([]);
    const [incomeTim, setIncomeTim] = useState([]);
    const [daneia,setDaneia]=useState([])
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Bank', 'Customer','Paradotea','Timologia', 'Daneia']);
    const [totalIncome, setTotalIncome] = useState(0);
    const [filtercalled,setfiltercalled]=useState(false)
    const [combinedData,setCombinedData]=useState([])

    const scenario =props.scenario

    const[selectedIdType,setSelectedIdType]=useState([])
    const [visible, setVisible] = useState(false); // State to control the visibility of the popup
    const [selectedRowData, setSelectedRowData] = useState(null); // State to store the row data to display

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchData();
        setLoading(false);
        initFilters();
    }, []);

    const fetchData = async () => {
        await getEkxorimena();
        await getIncomePar();
        await getIncomeTim();
        await getDaneia();
    };


    const getEkxorimena = async () => {
        const response = await axios.get(`${apiBaseUrl}/ek_tim`, {timeout: 5000});
        setEkxorimena(response.data);
    };

    const getIncomePar = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_par`, {timeout: 5000});
        setIncomeParadotea(response.data);
    };

    const getIncomeTim = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_tim`, {timeout: 5000});
        const data = response.data;

        // Filter to ensure unique timologia.id values
        const uniqueTimologia = [];
        const seenTimologiaIds = new Set();

        data.forEach(item => {
            if (!seenTimologiaIds.has(item.timologia.id)) {
                seenTimologiaIds.add(item.timologia.id);
                uniqueTimologia.push(item);
            }
        });
        setIncomeTim(uniqueTimologia);
    };
    const getDaneia = async () =>{
        const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000})
        setDaneia(response.data);
    }

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

        });
        setGlobalFilterValue('');
    };

    const formatDate = (value) => {
        if (value===null || value===""){
            return ""
        } 
        let date = new Date(value);
        // console.log("invalid date is: ",date)
        if (!isNaN(date)) {
            // console.log("show date ",date.toLocaleDateString('en-US', {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: 'numeric'
            // }))
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
    // console.log("date data: ",rowData)
    return formatDate(rowData.date);
};

const dateFilterTemplate = (options) => {
    // console.log('Current filter value:', options);
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};


const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ammountBodyTemplate = (rowData) => {
    const incomeDecimal = parseFloat(rowData.income).toFixed(2);
    console.log("here is the converted value",incomeDecimal)
    return formatCurrency(incomeDecimal);
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
            </div>
        );
    };

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => Number(acc) + Number(item.income), 0);
    };
    

    
    useEffect(()=>{
        if(scenario==="estimate_payment_date"){
        const combinedData2 = [
            ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: Number(item.bank_ammount), type: 'Bank', id: item.id })),
            ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: Number(item.customer_ammount), type: 'Customer', id: item.id })),
            ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: Number(item.paradotea.ammount_total), type: 'Paradotea', id: item.paradotea_id })),
            ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: Number(item.timologia.ammount_of_income_tax_incl), type: 'Timologia', id: item.timologia_id })),
            ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: Number(item.ammount), type: 'Daneia', id: item.id })),
        ];
        setCombinedData(combinedData2)
        }else if(scenario==="estimate_payment_date_2"){
            const combinedData2 = [
                ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: Number(item.bank_ammount), type: 'Bank', id: item.id })),
                ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: Number(item.customer_ammount), type: 'Customer', id: item.id })),
                ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_2), income: Number(item.paradotea.ammount_total), type: 'Paradotea', id: item.paradotea_id })),
                ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: Number(item.timologia.ammount_of_income_tax_incl), type: 'Timologia', id: item.timologia_id })),
                ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: Number(item.ammount), type: 'Daneia', id: item.id })),
            ];
            setCombinedData(combinedData2)
        }else if(scenario==="estimate_payment_date_3"){
            const combinedData2 = [
                ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: Number(item.bank_ammount), type: 'Bank', id: item.id })),
                ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: Number(item.customer_ammount), type: 'Customer', id: item.id })),
                ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date_3), income: Number(item.paradotea.ammount_total), type: 'Paradotea', id: item.paradotea_id})),
                ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: Number(item.timologia.ammount_of_income_tax_incl), type: 'Timologia', id: item.timologia_id })),
                ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: Number(item.ammount), type: 'Daneia', id: item.id })),
            ];
            setCombinedData(combinedData2)
        }

    },[paradotea,ekxorimena,incomeTim,daneia,scenario])
    





    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome(combinedData)));
        }
        
    }, [combinedData]);


    const handleValueChange = (e) => {
        const visibleRows = e;
        // console.log("visisble rows:",e);
        if(e.length>0){
            setfiltercalled(true)
        }

        // // Calculate total income for the visible rows
        const incomeSum = visibleRows.reduce((sum, row) => sum + Number(row.income || 0), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
    };

    const header = renderHeader();

    return (
        <div>
            <DataTable value={combinedData} paginator rows={10} 
            header={header} 
            filters={filters} 
            filterDisplay="menu" loading={loading} 
            responsiveLayout="scroll" 
            globalFilterFields={['date', 'income', 'type','id']}
            // onFilter={(e) => handleFilter(e.filteredValue)}
            onFilter={(e)=>setFilters(e.filters)}
            onValueChange={handleValueChange}
            
            >
                {/* {console.log("combined data: ",combinedData)} */}
                <Column filterField="date" header="Ημερομηνία" dataType="date" style={{ minWidth: '5rem' }} body={DateBodyTemplate} filter filterElement={dateFilterTemplate} sortable sortField="date" ></Column>
                {/* <Column filterField="income" header="income" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={formatCurrency(totalIncome)}></Column> */}
                <Column filterField="income" header="Εισροές" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalIncome} ></Column>
                <Column field="type" header="Τύπος Εισροής" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />

                <Column field="id" header="Id" body={idBodyTemplate} filter ></Column>

            </DataTable>
            {console.log("Kantoooo", selectedRowData)}

            <Dialog header="Λεπτομέρειες" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                {selectedRowData && selectedIdType==="Paradotea" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        {/* <p><strong>Date:</strong> {formatDate(selectedRowData.date)}</p> */}
                        <p><strong>Τίτλος παραδοτέου:</strong> {selectedRowData.title}</p>
                        <p><strong>Παραδοτέο (Αριθμός):</strong>{selectedRowData.part_number}</p>
                        <p><strong>Ημερομηνία υποβολής: </strong>{formatDate(selectedRowData.delivery_date)}</p>
                        <p><strong>Ποσοστό σύμβασης: </strong>{selectedRowData.percentage} %</p>
                        <p><strong>Ποσό (καθαρή αξία): </strong>{formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ποσό ΦΠΑ: </strong>{formatCurrency(selectedRowData.ammount_vat)}</p>
                        <p><strong>Σύνολο: </strong>{formatCurrency(selectedRowData.ammount_total)}</p>
                        <p><strong>Ημερομηνία πληρωμής (εκτίμηση): </strong>{formatDate(selectedRowData.estimate_payment_date)}</p>
                        <p><strong>Ημερομηνία πληρωμής (εκτίμηση 2): </strong>{formatDate(selectedRowData.estimate_payment_date_2)}</p>
                        <p><strong>Ημερομηνία πληρωμής (εκτίμηση 3): </strong>{formatDate(selectedRowData.estimate_payment_date_3)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/edit/${selectedRowData.id}`}>Επεξεργασία Παραδοτέου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/profile/${selectedRowData.id}`}>Πληροφορίες Παραδοτέου</a></strong></p>
                        {/* <p><strong>Erga: </strong>{selectedRowData.erga.name.value}</p> */}
                        {/* <p><strong>Type:</strong> {selectedRowData.type}</p> */}
                        {/* Render other fields as needed */}
                    </div>
                )}
                {selectedRowData && selectedIdType==="Timologia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        {/* <p><strong>Date:</strong> {formatDate(selectedRowData.date)}</p> */}
                        <p><strong>Αρ. τιμολογίου:</strong> {selectedRowData.invoice_number}</p>
                        <p><strong>Ημερομηνία έκδοσης τιμολογίου:</strong> {formatDate(selectedRowData.invoice_date)}</p>
                        <p><strong>Ποσό τιμολογίου  (καθαρή αξία):</strong> {formatCurrency(selectedRowData.ammount_no_tax)}</p>
                        <p><strong>Ποσό ΦΠΑ:</strong>{formatCurrency(selectedRowData.ammount_tax_incl)}</p>
                        <p><strong>Πληρωτέο:</strong>{formatCurrency(selectedRowData.ammount_of_income_tax_incl)}</p>
                        <p><strong>Ημερομηνία πληρωμής τιμολογίου (εκτίμηση):</strong> {formatDate(selectedRowData.actual_payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/edit/${selectedRowData.id}`}>Επεξεργασία Τιμολογίου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/profile/${selectedRowData.id}`}>Πληροφορίες Τιμολογίου</a></strong></p>
                        {/* <p><strong>Type:</strong> {selectedRowData.type}</p> */}
                        {/* Render other fields as needed */}
                    </div>
                )}
                {selectedRowData && selectedIdType==="Daneia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <p><strong>Id:</strong> {selectedRowData.id}</p>
                        {/* <p><strong>Date:</strong> {formatDate(selectedRowData.date)}</p> */}
                        <p><strong>Περιγραφή:</strong> {selectedRowData.name}</p>
                        <p><strong>Ποσό:</strong> {formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής δανείου (εκτίμηση):</strong> {formatDate(selectedRowData.payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/edit/${selectedRowData.id}`}>Επεξεργασία Δανείου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/profile/${selectedRowData.id}`}>Πληροφορίες Δανείου</a></strong></p>
                        {/* <p><strong>Type:</strong> {selectedRowData.type}</p> */}
                        {/* Render other fields as needed */}
                    </div>
                )}
                {selectedRowData && (selectedIdType==="Bank" || selectedIdType==="Customer") && (
                    
                    <div>
                        {console.log("Kantoooo", selectedRowData)}
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        {/* <p><strong>Date:</strong> {formatDate(selectedRowData.date)}</p> */}
                        <p><strong>Σχετίζεται με τιμολόγιο:</strong> {selectedRowData.timologia_id}</p>
                        <p><strong>Εκχώρηση (€): </strong>{formatCurrency(selectedRowData.bank_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από τράπεζα (εκτίμηση): </strong>{formatDate(selectedRowData.bank_estimated_date)}</p>
                        <p><strong>Υπόλοιπο από πελάτη (€): </strong>{formatCurrency(selectedRowData.customer_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από πελάτη (εκτίμηση): </strong>{formatDate(selectedRowData.cust_estimated_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/edit/${selectedRowData.id}`}>Επεξεργασία Εκχώρησης</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/profile/${selectedRowData.id}`}>Πληροφορίες Εκχώρησης</a></strong></p>
                        {/* <p><strong>Type:</strong> {selectedRowData.type}</p> */}
                        {/* Render other fields as needed */}
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default PaidList;
