import React,{useState,useEffect, useRef} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog'; // Import Dialog

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';

import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";
import FormEditEkxorimenoTimologio from './FormEditEkxorimenoTimologio';
import FormProfileEkxorimenoTimologio from './FormProfileEkxorimenoTimologio';
import { OverlayPanel } from 'primereact/overlaypanel';

const EkxwrimenoTimologioList = () => 
{
    const [EkxwrimenoTimologio, setEkxorimena_Timologia] = useState([]);
    const [filteredEkxoriseis, setFilteredEkxoriseis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [totalincome, setTotalIncome] = useState(0)
    const [totalIncome_cust, setTotalIncomeCust] = useState(0)

    const [filtercalled,setfiltercalled]=useState(false)

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedEkxoriseisId, setSelectedEkxoriseisId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    
    const [statuses] = useState(['yes', 'no']);

    const[erga,setErgo]=useState([])

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'ErgaName', header: 'Έργο' },
        { field: 'bank_ammount', header: 'Εκχώρηση (€)' },
        { field: 'customer_ammount', header: 'Υπόλοιπο από πελάτη (€)' },
        { field: 'bank_date', header: 'Ημερομηνία πληρωμής από τράπεζα' },
        { field: 'bank_estimated_date', header: 'Ημερομηνία πληρωμής από τράπεζα (εκτίμηση)' },
        { field: 'status_bank_paid', header: 'Εκχώρηση (κατάσταση)' },
        { field: 'cust_date', header: 'Ημερομηνία πληρωμής από πελάτη' },
        { field: 'cust_estimated_date', header: 'Ημερομηνία πληρωμής από πελάτη (εκτίμηση)' },
        { field: 'status_customer_paid', header: 'Πληρωμή υπολοίπου από πελάτη (κατάσταση)' },
        { field: 'comments', header: 'Σχόλια' },

        
        { field: 'invoice_number', header: 'Αρ. τιμολογίου' }

        // { field: 'totalparadotea', header: 'Σύνολο Τιμ.Παραδοτέων/Έργο' },
        // { field: 'difference', header: 'Υπόλοιπο Παραδοτέων' }
    ];



// Step 1: Import base64 font string (this is a placeholder, you should replace it with the actual base64 string)

// Function to add the Roboto-Regular font to jsPDF
const callAddFont = function () {
  this.addFileToVFS('Roboto-Regular-normal.ttf', robotoBase64);
  this.addFont('Roboto-Regular-normal.ttf', 'Roboto-Regular', 'normal');
};

// Step 2: Register the font adding event
jsPDF.API.events.push(['addFonts', callAddFont]);




    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));


    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default({
                    orientation: 'l',
                    unit: 'mm',
                    format: 'a4'
                });
        // Step 4: Set the custom font and font size
        doc.setFont('Roboto-Regular');
        doc.setFontSize(12);
        
        const formattedReportData = filteredEkxoriseis.map((product) => {
            return {
                ...product,
                bank_ammount: formatCurrency(product.bank_ammount),
                bank_date: formatDate(product.bank_date),
                customer_ammount: formatCurrency(product.customer_ammount),
                cust_date: formatDate(product.cust_date), // Format the quantity as currency
                cust_estimated_date:formatDate(product.cust_estimated_date),
                bank_estimated_date: formatDate(product.bank_estimated_date)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.ErgaName,
            product.bank_ammount,
            product.customer_ammount,
            product.bank_date,
            product.bank_estimated_date, // Now this is formatted as currency
            product.status_bank_paid,
            product.cust_date, // Now this is formatted as currency
            product.cust_estimated_date, // Now this is formatted as currency
            product.status_customer_paid,
            product.comments,
            product.invoice_number
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('Ekxoriseis.pdf');
                        
                    });
                });
    };


        
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            // Create the headers based on the 'cols' array
            const headers = cols.map(col => col.header);
    
            // Create data rows with headers first
            const data = [
                headers,  // First row with headers
                ...filteredEkxoriseis.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'bank_ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'customer_ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
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
    
            saveAsExcelFile(excelBuffer, 'Ekxoriseis');
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




    useEffect(()=>{
        getEkxorimena_Timologia()
        setLoading(false);
        initFilters();
    }, []);

    const getEkxorimena_Timologia = async() =>{

        try {
            const response = await axios.get(`${apiBaseUrl}/ek_tim`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);
            
           
            const parDataWithDates = paraData.map(item => ({
                ...item,
                // erga: {
                //     ...item.erga,
                //     name: item.erga?.name || 'N/A'
                // },
                // timologia: {
                //     ...item.timologia,
                //     invoice_number: item.timologia?.invoice_number || 'N/A'
                // },
                bank_ammount: parseFloat(item.bank_ammount),
                customer_ammount: parseFloat(item.customer_ammount),
                bank_date: new Date(item.bank_date),
                cust_date: new Date(item.cust_date),
                cust_estimated_date: new Date(item.cust_estimated_date),
                bank_estimated_date: new Date(item.bank_estimated_date),
                ErgaName:"",
                invoice_number:""
            }));
            try {
                const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
                const paraErgaData = response.data;
                
                const mergedΕκ_TimParData=parDataWithDates.map(parDataWithDates=>{
                    parDataWithDates.ErgaName=paraErgaData.find(paraErgaData=>paraErgaData.timologia_id===parDataWithDates.timologia_id).erga.name || 'N/A'
                })
                console.log("merged ",mergedΕκ_TimParData[0])

                

            } catch (error) {
                console.error('Error fetching data2:', error);
            }
            try {
                const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
                const paraTimData = response.data;
                
                const mergedΕκ_TimParData=parDataWithDates.map(parDataWithDates=>{
                    parDataWithDates.invoice_number=paraTimData.find(paraTimData=>paraTimData.id===parDataWithDates.timologia_id).invoice_number || 'N/A'
                })
                console.log("merged ",mergedΕκ_TimParData[0])

                

            } catch (error) {
                console.error('Error fetching data2:', error);
            }
            const uniqueErgaNames = [...new Set(parDataWithDates.map(item =>item.ErgaName))];
            setErgo(uniqueErgaNames);
            console.log(parDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setEkxorimena_Timologia(parDataWithDates);
            setFilteredEkxoriseis(parDataWithDates)

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }


    }

    const deleteEkxorimeno_Timologio = async(ek_timologioId)=>{
        await axios.delete(`${apiBaseUrl}/ek_tim/${ek_timologioId}`);
        getEkxorimena_Timologia();
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
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            ErgaName: { value: null, matchMode: FilterMatchMode.IN} ,
            // timologia_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            invoice_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            bank_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            bank_estimated_date:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]},
            customer_ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            bank_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            status_bank_paid:{ operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            bank_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_estimated_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            cust_estimated_date:{operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]},
            status_customer_paid:{ operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

        });
        setGlobalFilterValue('');
    };



    const {user} = useSelector((state) => state.auth);
    // const clearLocks = () =>
    //     {
    //         setFrozenColumns([]); // Clear all frozen columns
    //     }

        const allColumnFields = ['ErgaName'];
        const [frozenColumns, setFrozenColumns] = useState(['ErgaName']); // Initially frozen column(s)
        const allColumnsFrozen = frozenColumns.length === allColumnFields.length;
        const buttonLabel = allColumnsFrozen ? 'Unlock All' : 'Lock All';

        // Function to toggle a column's frozen state
        const toggleFreezeColumn = (fieldName) => {
            setFrozenColumns((prev) =>
                prev.includes(fieldName)
                    ? prev.filter(col => col !== fieldName) // Unfreeze column if already frozen
                    : [...prev, fieldName]                  // Freeze column if not frozen
            );
        };

        const toggleAllColumns = () => {
            if (allColumnsFrozen) {
                // If all columns are frozen, unlock them
                setFrozenColumns([]);
            } else {
                // If not all columns are frozen, lock all of them
                setFrozenColumns(allColumnFields);
            }
        };
    
        const renderColumnHeader = (headerText, fieldName) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                <span
                    onClick={() => toggleFreezeColumn(fieldName)}
                    style={{ cursor: 'pointer', marginRight: '8px' }}
                    title={frozenColumns.includes(fieldName) ? 'Unlock Column' : 'Lock Column'}
                >
                    {frozenColumns.includes(fieldName) ? <i className="pi pi-lock" style={{ fontSize: '1rem' }}></i> : <i className="pi pi-lock-open" style={{ fontSize: '1rem' }}></i>}
                </span>
                <span>{headerText}</span>
            </div>
        );


    const renderHeader = () => {
        return (
            <div className="header-container flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <Button type="button" outlined label={buttonLabel} icon={buttonLabel === 'Unlock All' ? 'pi pi-unlock' : 'pi pi-lock'} onClick={toggleAllColumns} className="p-mb-3" />
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

                <Button className='action-button'  type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button className='action-button'  type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        );
    };


    const formatDate = (value) => {
        let date = new Date(value);
        let epochDate = new Date('1970-01-01T00:00:00Z');
        if (date.getTime() === epochDate.getTime()) 
        {
            return null;
        }
        if (!isNaN(date)) {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
        } else {
            return "Invalid date";
        }
    };
    

    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
    };

    const ergaBodyTemplate = (rowData) => {
        
        const ergo = rowData.ErgaName || 'N/A';        // console.log("repsBodytempl",timologio)
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


    //bank date
    const bank_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.bank_date);
    };
    
    const bank_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //estimate bankdate
    const bank_estimated_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.bank_estimated_date);
    };
    
    const bank_estimated_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    //custdate

    const cust_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.cust_date);
    };
    
    const cust_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };


    //estimate custdate
    const cust_estimated_dateDateBodyFilterTemplate = (rowData) => {
        return formatDate(rowData.cust_estimated_date);
    };
    
    const cust_estimated_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };



    const bank_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.bank_ammount);
    };

    const customer_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.customer_ammount);
    };

  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };


  
        

    const statusBankPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_bank_paid} severity={getSeverity(rowData.status_bank_paid)} />;
    };

    
    const statusCustomerPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_customer_paid} severity={getSeverity(rowData.status_customer_paid)} />;
    };

    

    const statusPaidFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusPaidItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusPaidItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };




    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });    };





    const footer = `In total there are ${EkxwrimenoTimologio ? EkxwrimenoTimologio.length : 0} paradotea.`;

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => Number(acc) + Number(item.bank_ammount), 0);
    };

    const calculateTotalIncomeCust = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => Number(acc) + Number(item.customer_ammount), 0);
    };

    const handleValueChange = (e) => {
        const visibleRows = e;
        // console.log("visisble rows:",e);
        if(e.length>0){
            setfiltercalled(true)
        }

        // // Calculate total income for the visible rows
        const incomeSum = visibleRows.reduce((sum, row) => sum + Number((row.bank_ammount || 0)), 0);
        const incomesum_cust = visibleRows.reduce((sum, row) => sum + Number((row.customer_ammount || 0)), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
        setTotalIncomeCust(formatCurrency(incomesum_cust))
    };

    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome(EkxwrimenoTimologio)));
            setTotalIncomeCust(formatCurrency(calculateTotalIncomeCust(EkxwrimenoTimologio)))
        }
        
    }, [EkxwrimenoTimologio]);

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
                            <Link to={`/ek_tim/profile/${id}`}>
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
                                        setSelectedEkxoriseisId(id);
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
                                        setSelectedEkxoriseisId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteEkxorimeno_Timologio(id)}
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
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/ek_tim/profile/${id}`} ><Button className='action-button'  severity="info" label="Προφίλ" text raised /></Link>
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
                                setSelectedEkxoriseisId(id);
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
                                setSelectedEkxoriseisId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                             <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteEkxorimeno_Timologio(id)} />
                             </span>
                        )}
            </div>
 
        );
    }

    



    return(
        <div className="card" >
        <h1 className='title'>Εκχωρημένα τιμολόγια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ek_tim/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Εκχωρημένου Τιμολογίου" icon="pi pi-plus-circle"/></Link>
        )}
        <DataTable ref = {dt} value={EkxwrimenoTimologio} onValueChange={(ekxoriseis) => {setFilteredEkxoriseis(ekxoriseis);
            handleValueChange(ekxoriseis);}} stripedRows paginator  rows={10} scrollable scrollHeight="400px" loading={loading} dataKey="id" 
                filters={filters} globalFilterFields={[
                    'id',
                    'ErgaName',
                    'timologia_id',
                    'invoice_number',
                    'bank_ammount',
                    'bank_estimated_date', 
                    'bank_date', 
                    'customer_ammount',
                    'cust_estimated_date',
                    'cust_date',
                    'status_bank_paid',
                    'status_customer_paid',
                    'comments'
                ]} header={header}
                emptyMessage="Δεν βρέθηκαν εκχωριμένα τιμολόγια.">
                <Column className='font-bold' field="id" header="id" filter filterPlaceholder="Search by name" style={{ minWidth: '5rem', color: 'black' }} frozen />
                {/* <Column field="ErgaName" header="Εργο" filter filterPlaceholder="Search by ergo" style={{ minWidth: '5rem' }} /> */}
                <Column className="font-bold" header= {renderColumnHeader('Εργο', 'ErgaName')} filterField="ErgaName" alignFrozen="left" frozen={frozenColumns.includes('ErgaName')}  showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem', color: 'black' }}
                    body={ergaBodyTemplate} filter filterElement={ergaFilterTemplate} />  
                
                <Column header="Εκχώρηση (€)" filterField="bank_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={bank_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalincome} />
                <Column header="Υπόλοιπο από πελάτη (€)" filterField="customer_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={customer_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalIncome_cust} />
                <Column header="Ημερομηνία πληρωμής από τράπεζα (εκτίμηση)" filterField="bank_estimated_date" dataType="date" style={{ minWidth: '5rem' }} body={bank_estimated_dateDateBodyFilterTemplate} filter filterElement={bank_estimated_dateDateFilterTemplate} ></Column>
                <Column header="Ημερομηνία πληρωμής από τράπεζα" filterField="bank_date" dataType="date" style={{ minWidth: '5rem' }} body={bank_dateDateBodyFilterTemplate} filter filterElement={bank_dateDateFilterTemplate} ></Column>

                <Column header="Ημερομηνία πληρωμής από πελάτη (εκτίμηση)" filterField="cust_estimated_date" dataType="date" style={{ minWidth: '5rem' }} body={cust_estimated_dateDateBodyFilterTemplate} filter filterElement={cust_estimated_dateDateFilterTemplate} ></Column>
                <Column header="Ημερομηνία πληρωμής από πελάτη" filterField="cust_date" dataType="date" style={{ minWidth: '5rem' }} body={cust_dateDateBodyFilterTemplate} filter filterElement={cust_dateDateFilterTemplate} ></Column>

                {/* <Column field="timologia_id" header="timologia_id" filter filterPlaceholder="Search by timologia_id" style={{ minWidth: '5rem' }} /> */}
                <Column field="invoice_number" header="Αρ. τιμολογίου" filter filterPlaceholder="Search by invoice number" style={{ minWidth: '5rem' }} />
                <Column field="status_bank_paid" header="Εκχώρηση (κατάσταση)" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBankPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
                <Column field="status_customer_paid" header="Πληρωμή υπολοίπου από πελάτη (κατάσταση)" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusCustomerPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
                <Column field="comments" header="Σχόλια"  filter filterPlaceholder="Search by comment"  style={{ minWidth: '12rem' }}></Column>

                <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }}  />

           </DataTable>

           <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedEkxoriseisId && (selectedType=='Edit') && (
            <FormEditEkxorimenoTimologio id={selectedEkxoriseisId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedEkxoriseisId && (selectedType=='Profile') && (
            <FormProfileEkxorimenoTimologio id={selectedEkxoriseisId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>
    </div>
    );
}

export default EkxwrimenoTimologioList;