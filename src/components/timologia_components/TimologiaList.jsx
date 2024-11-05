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

import { Dialog } from 'primereact/dialog'; // Import Dialog
import FormEditTimologia from '../timologia_components/FormEditTimologia'
import FormProfileTimologia from '../timologia_components/FormProfileTimologia'
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";


const TimologiaList = () => {
    const [Timologia, setTimologia] = useState([]);
    const {user} = useSelector((state) => state.auth)

    const [statuses] = useState(['yes', 'no']);

    const [filteredTimologia, setFilteredTimologia] = useState([]);

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    // const [timologia, setTimologio]=useState([]);
    const [erga, setErgo]=useState([]);

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;


    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedTimologiaId, setSelectedTimologiaId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const cols = [
        { field: 'ErgaName', header: 'Έργο' },
        { field: 'invoice_date', header: 'Ημερομηνία έκδοσης τιμολογίου' },
        { field: 'invoice_number', header: 'Αρ. τιμολογίου' },
        
        { field: 'ammount_no_tax', header: 'Ποσό τιμολογίου (καθαρή αξία)' },
        { field: 'ammount_tax_incl', header: 'Ποσό ΦΠΑ' },
        { field: 'ammount_of_income_tax_incl', header: 'Πληρωτέο' },
        { field: 'actual_payment_date', header: 'Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)' },
        { field: 'status_paid', header: 'Κατάσταση Τιμολογίου' },
        { field: 'comments', header: 'Σχόλια' },

        { field: 'ammount_parakratisi_eight', header: 'Παρακράτηση 8%' },
        { field: 'ammount_parakratisi_eforia', header: 'Παρακράτηση εφορίας' }

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
        
        const formattedReportData = filteredTimologia.map((product) => {
            return {
                ...product,
                ammount_no_tax: formatCurrency(product.ammount_no_tax),
                actual_payment_date: formatDate(product.actual_payment_date),
                ammount_tax_incl: formatCurrency(product.ammount_tax_incl),
                ammount_of_income_tax_incl: formatCurrency(product.ammount_of_income_tax_incl), // Format the quantity as currency
                invoice_date:formatDate(product.invoice_date),
                ammount_parakratisi_eight: formatCurrency(product.ammount_parakratisi_eight),
                ammount_parakratisi_eforia: formatCurrency(product.ammount_parakratisi_eforia),
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.ErgaName,
            product.invoice_date,
            product.invoice_number,
            product.ammount_no_tax,
            product.ammount_tax_incl,
            product.ammount_of_income_tax_incl, // Now this is formatted as currency
            product.actual_payment_date,
            product.status_paid, // Now this is formatted as currency
            product.comments,
            product.ammount_parakratisi_eight,
            product.ammount_parakratisi_eforia
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('Timologia.pdf');
                        
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
                ...filteredTimologia.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount_no_tax') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount_tax_incl') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount_of_income_tax_incl') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }

                        if (col.field === 'ammount_parakratisi_eight') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }

                        if (col.field === 'ammount_parakratisi_eforia') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }

                        // if (col.field === 'customer.name')
                        // {
                        //     return product.customer ? product.customer.name : '';
                        // }

                        // if (col.field === 'erga_category.name')
                        //     {
                        //         return product.erga_category ? product.erga_category.name : '';
                        //     }
                        
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
    
            saveAsExcelFile(excelBuffer, 'Timologia');
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
        getTimologia()
        setLoading(false);
        initFilters();
    }, []);

    const getTimologia = async() =>{
        // const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
        // setTimologia(response.data);

        try {
            const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            // console.log("Unique Timologia:",uniqueTimologia);
            // setTimologio(uniqueTimologia);

            // const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            // setErgo(uniqueErga);

            // Convert sign_date to Date object for each item in ergaData
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
                invoice_date: new Date(item.invoice_date),
                ammount_no_tax: parseFloat(item.ammount_no_tax),
                ammount_tax_incl: parseFloat(item.ammount_tax_incl),
                ammount_of_income_tax_incl: parseFloat(item.ammount_of_income_tax_incl),
                actual_payment_date: new Date(item.actual_payment_date),
                ErgaName:""
            }));
            try {
                const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
                const paraErgaData = response.data;
                
                const mergedTimParData=parDataWithDates.map(parDataWithDates=>{
                    parDataWithDates.ErgaName=paraErgaData.find(paraErgaData=>paraErgaData.timologia_id===parDataWithDates.id).erga.name
                })
                // console.log("merged ",mergedTimParData)

            } catch (error) {
                console.error('Error fetching data2:', error);
            }

            const uniqueErgaNames = [...new Set(parDataWithDates.map(item =>item.ErgaName))];
            setErgo(uniqueErgaNames);
            console.log("ddsadasdasda",uniqueErgaNames)
            // const a3 = a1.map(it1 => {
            //     it1.test = a2.find(it2 => it2.id === it1.id).test
            //     return it1
            //   })
    
            const sortedParaData = parDataWithDates.sort((a, b) => a.actual_payment_date - b.actual_payment_date);

    
            console.log("what  ",sortedParaData); // Optionally log the transformed data


    
            // Assuming you have a state setter like setErga defined somewhere
            setTimologia(sortedParaData);
            setFilteredTimologia(sortedParaData)
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }





    }

    const deleteTimologio = async(timologioId)=>{
        await axios.delete(`${apiBaseUrl}/timologia/${timologioId}`);
        getTimologia();
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

            ErgaName: { value: null, matchMode: FilterMatchMode.IN} ,

            

            invoice_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            
            invoice_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            ammount_no_tax: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            
            ammount_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            actual_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
           
            ammount_of_income_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
            comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            status_paid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            

        });
        setGlobalFilterValue('');
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
    


    const ammount_no_taxBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_no_tax);
    };

    const ammount_tax_inclBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_tax_incl);
    };

    const ammount_of_income_tax_inclBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_of_income_tax_incl);
    };


    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };

    const clearLocks = () =>
        {
            setFrozenColumns([]); // Clear all frozen columns
        }



    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button  type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <Button type="button" icon="pi pi-unlock" label="Unlock All" outlined onClick={clearLocks} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>

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


     //delivery Date
 const invoice_dateDateBodyTemplate = (rowData) => {
    return formatDate(rowData.invoice_date);
};

const invoice_dateDateFilterTemplate = (options) => {
    // console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};

    

     //delivery Date
     const actual_payment_dateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.actual_payment_date);
    };
    
    const actual_payment_dateDateFilterTemplate = (options) => {
        // console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    

    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
    };

        

    const statusPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_paid} severity={getSeverity(rowData.status_paid)} />;
    };

    const statusPaidFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusPaidItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusPaidItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };




    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };



    const footer = `In total there are ${Timologia ? Timologia.length : 0} timologia.`;

    const header = renderHeader();

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/timologia/profile/${id}`} ><Button className='action-button'  severity="info" label="Προφίλ" text raised /></Link>
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
                                setSelectedTimologiaId(id);
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
                                setSelectedTimologiaId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                        <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteTimologio(id)} />
                    </span>
                )}
            </div>
 
        );
    }

    const [frozenColumns, setFrozenColumns] = useState(['ErgaName', 'invoice_number']); // Initially frozen column(s)

    // Function to toggle a column's frozen state
    const toggleFreezeColumn = (fieldName) => {
        setFrozenColumns((prev) =>
            prev.includes(fieldName)
                ? prev.filter(col => col !== fieldName) // Unfreeze column if already frozen
                : [...prev, fieldName]                  // Freeze column if not frozen
        );
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



    return(


<div className="card" >
        <h1 className='title'>Τιμολόγια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/timologia/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Τιμολογίου" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={Timologia} ref = {dt} onValueChange={(timologia) => setFilteredTimologia(timologia)} paginator 
 rows={20} stripedRows scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'id', 
                'ErgaName',
                'invoice_number', 
                'invoice_date',
                'ammount_no_tax',
                'ammount_tax_incl',
                'actual_payment_date',
                'ammount_of_income_tax_incl',
                'comments',
                'status_paid'

                ]} 
            header={header} 
            emptyMessage="No timologia found.">
                <Column className='font-bold' field="id" header="id" sortable style={{ minWidth: '2rem', color: 'black' }} frozen ></Column>
                {/* <Column field="ErgaName"  header="Εργο"  filter filterPlaceholder="Search by Ergo" style={{ minWidth: '12rem' }}></Column> */}
                <Column className="font-bold" header= {renderColumnHeader('Εργο', 'ErgaName')} filterField="ErgaName" showFilterMatchModes={false} alignFrozen="left" frozen={frozenColumns.includes('ErgaName')} 
                    body={ergaBodyTemplate} filter filterElement={ergaFilterTemplate} style={{color: 'black'}} />  
                
                <Column className="font-bold" field="invoice_number"  header= {renderColumnHeader('Αρ. τιμολογίου', 'invoice_number')} filter filterPlaceholder="Search by invoice_number" style={{ minWidth: '12rem', color: 'black' }} frozen={frozenColumns.includes('invoice_number')} ></Column>
                <Column header="Ημερομηνία έκδοσης τιμολογίου" filterField="invoice_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={invoice_dateDateBodyTemplate} filter filterElement={invoice_dateDateFilterTemplate} ></Column>

                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}

                <Column header="Ποσό τιμολογίου  (καθαρή αξία)" filterField="ammount_no_tax" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_no_taxBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Ποσό ΦΠΑ" filterField="ammount_tax_incl" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_tax_inclBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)" filterField="actual_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={actual_payment_dateDateBodyTemplate} filter filterElement={actual_payment_dateDateFilterTemplate} ></Column>

                <Column header="Πληρωτέο" filterField="ammount_of_income_tax_incl" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_of_income_tax_inclBodyTemplate} filter filterElement={ammountFilterTemplate} />

                
            

            <Column field="comments" header="Σχόλια"  filter filterPlaceholder="Search by comment"  style={{ minWidth: '12rem' }}></Column>

            {/* <Column field="status_paid" header="status_paid"  filter filterPlaceholder="Search by status_paid"  style={{ minWidth: '12rem' }}></Column> */}

            <Column field="status_paid" header="Κατάσταση τιμολογίου" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
        
               
                <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }} />

 </DataTable>

 <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedTimologiaId && (selectedType=='Edit') && (
            <FormEditTimologia id={selectedTimologiaId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedTimologiaId && (selectedType=='Profile') && (
            <FormProfileTimologia id={selectedTimologiaId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>
       
    </div>

    )
}

export default TimologiaList