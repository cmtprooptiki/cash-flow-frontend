import React,{useState,useEffect,useRef } from 'react'
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
import { Tooltip } from 'primereact/tooltip';

import robotoData from './robotoBase64.json';
import { jsPDF } from "jspdf";


const ReportList = () => {
    const [reportData,setReportData]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Σχεδίαση','Ολοκληρωμένο','Αποπληρωμένο','Υπογεγραμμένο','Ακυρωμένο']);
    const [filteredData, setFilteredData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [filtercalled,setfiltercalled]=useState(false)

    // const [project_managers, setProjectManager]=useState([]);
   
    //Export functionaliy code
    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'erga_name', header: 'Έργο' },
        { field: 'customer_name', header: 'Πελάτης' },

        { field: 'ammount_total', header: 'Σύνολο Έργου' },
        { field: 'status', header: 'Κατάσταση έργου' },
        { field: 'sign_date', header: 'Ημερομηνία υπογραφής σύμβασης' },
        { field: 'total_yes_timologia', header: 'Εισπράξεις' },
        { field: 'total_no_timologia', header: 'Απαιτήσεις Τιμολογιμένων' },
        { field: 'demands_no_tim', header: 'Απαιτήσεις Μη Τιμολογιμένων' },

        { field: 'demands', header: 'Απαιτήσεις' },
        { field: 'future_demands', header: 'Μελλοντικές Απαιτήσεις' }


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

        const formattedReportData = filteredData.map((product) => {
            return {
                ...product,
                ammount_total: formatCurrency(product.ammount_total),
                sign_date: formatDate(product.sign_date),
                total_yes_timologia: formatCurrency(product.total_yes_timologia),
                total_no_timologia: formatCurrency(product.total_no_timologia), // Format the quantity as currency
                demands_no_tim:formatCurrency(product.demands_no_tim),
                demands:formatCurrency(product.demands),
                future_demands:formatCurrency(product.future_demands),
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.erga_name,
            product.customer_name,
            product.ammount_total,
            product.status,
            product.sign_date, // Now this is formatted as currency
            product.total_yes_timologia,
            product.total_no_timologia, // Now this is formatted as currency
            product.demands_no_tim,
            product.demands,
            product.future_demands
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('products.pdf');
                        
                    });
                });
    };

    // const exportExcel = () => {
    //     import('xlsx').then((xlsx) => {
    //         const worksheet = xlsx.utils.json_to_sheet(reportData);
    //         const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //         const excelBuffer = xlsx.write(workbook, {
    //             bookType: 'xlsx',
    //             type: 'array'
    //         });

    //         saveAsExcelFile(excelBuffer, 'products');
    //     });
    // };


    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            // Create the headers based on the 'cols' array
            const headers = cols.map(col => col.header);
    
            // Create data rows with headers first
            const data = [
                headers,  // First row with headers
                ...filteredData.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount_total') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'total_yes_timologia') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'total_no_timologia') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'demands_no_tim') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'demands') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'future_demands') {
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
    
            saveAsExcelFile(excelBuffer, 'products');
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


    //export ends here


    const getSeverity = (status) => {
        switch (status) {
            case 'Σχεδίαση':
                return 'info';

            case 'Υπογεγραμμένο':
                return 'success';
            
            case 'Ολοκληρωμένο':
                return 'secondary';

            case 'Αποπληρωμένο':
                return 'contrast';

            case 'Ακυρωμένο':
                return 'danger';

           

         
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
            erga_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            customer_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            sign_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ammount_total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            total_yes_timologia: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            total_no_timologia: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            demands_no_tim: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            demands: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            future_demands: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

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

            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
           
            </div>

            
        );
    };

    const headerTemplate = (data) => {
        return (
            <div className="flex align-items-center gap-2">
                <img src={`${apiBaseUrl}/${data.logoImage}`} alt={data.logoImage} className="w-6rem shadow-2 border-round" />
                <span className="font-bold" style={{color:'black'}}>{data.customer_name}</span>
            </div>
        );
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                
                {/* <td colSpan="1">
                    <div className="font-bold w-full" style={{color:'black'}}>Σύνολο Έργων: {calculateCustomerTotal(data.customer_name)}</div>
                
                </td>
                <td colSpan="3">
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολικο Ποσο Έργων: {calculateAmmount_Total(data.customer_name)}</div>
                    
                </td>
                <td colSpan="6">
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολο Εισπράξεων: {calculateTotalYesTim(data.customer_name)}</div>
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολικες Απαιτήσεις Εισπράξεων: {calculateTotalNoTim(data.customer_name)}</div>
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολικες Απαιτήσεις Μη Τιμολογιμένων: {calculateTotalDemandsNoTim(data.customer_name)}</div>
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολικες Απαιτήσεις: {calculateTotalDemands(data.customer_name)}</div>
                    <div className="font-bold w-full" style={{color:'black'}}>Συνολικες Μελλοντικές Απαιτήσεις: {calculateTotalFutureDemands(data.customer_name)}</div>

                </td> */}
                <td colSpan={8}>
                <table className='reportsTable'>
                    <thead>
                    <tr>
                        <th>Σύνολο Έργων</th>
                        <th>Συνολικο Ποσο Έργων</th>
                        <th>Συνολο Εισπράξεων</th>
                        <th>Συνολικες Απαιτήσεις Εισπράξεων</th>
                        <th>Συνολικες Απαιτήσεις Μη Τιμολογιμένων</th>
                        <th>Συνολικες Απαιτήσεις</th>
                        <th>Συνολικες Μελλοντικές Απαιτήσεις</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{calculateCustomerTotal(data.customer_name)}</td>
                        <td>{calculateAmmount_Total(data.customer_name)}</td>
                        <td>{calculateTotalYesTim(data.customer_name)}</td>
                        <td>{calculateTotalNoTim(data.customer_name)}</td>
                        <td>{calculateTotalDemandsNoTim(data.customer_name)}</td>
                        <td>{calculateTotalDemands(data.customer_name)}</td>
                        <td>{calculateTotalFutureDemands(data.customer_name)}</td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </React.Fragment>
        );
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

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total++;
                }
            }
        }

        return total;
    };
    const calculateTotalNoTim = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.total_no_timologia)
                }
            }
        }
        

        return formatCurrency(total);
    };
    const calculateAmmount_Total = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.ammount_total)
                }
            }
        }
        

        return formatCurrency(total);
    };
    const calculateTotalYesTim = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.total_yes_timologia)
                }
            }
        }
        

        return formatCurrency(total);
    };
    const calculateTotalDemandsNoTim = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.demands_no_tim)
                }
            }
        }
        

        return formatCurrency(total);
    };
    const calculateTotalDemands = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.demands)
                }
            }
        }
        

        return formatCurrency(total);
    };
    const calculateTotalFutureDemands = (name) => {
        let total = 0.0;

        if (reportData) {
            for (let customer of reportData) {
                if (customer.customer_name === name) {
                    total+=parseFloat(customer.future_demands)
                }
            }
        }
        

        return formatCurrency(total);
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
    const imageBodyTemplate = (rowData) => {
        return <img src={`${apiBaseUrl}/${rowData.logoImage}`} alt={rowData.logoImage} className="w-6rem shadow-2 border-round" />;
    };

    

    //Sign Date
    const signDateBodyTemplate = (rowData) => {
        return formatDate(rowData.sign_date);
    };

    const dateFilterTemplate = (options) => {
        console.log('Current filter value:', options);

        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const formatCurrencyReport = (value) => {
        return Number(value);
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const total_yes_timologiaTemplate = (rowData) => {
        return formatCurrency(rowData.total_yes_timologia);
    };

    const total_no_timologiaBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total_no_timologia);
    };


    const demands_no_timTemplate = (rowData) => {
        return formatCurrency(rowData.demands_no_tim);
    };

    const demandsBodyTemplate = (rowData) => {
        return formatCurrency(rowData.demands);
    };

    const future_demandsBodyTemplate = (rowData) => {
        return formatCurrency(rowData.future_demands);
    };



    const ammount_totalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_total);
    };


  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };



    useEffect(()=>{
        getReportData()
        setLoading(false);
        initFilters();
    },[]);

    const getReportData= async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/getGroupTableParadotea`, {timeout: 5000});
            const reportData = response.data;

            const ergaDataWithDates = reportData.map(item => ({
                ...item,
                total_yes_timologia:parseFloat(item.total_yes_timologia),
                total_no_timologia:parseFloat(item.total_no_timologia),
                demands_no_tim:parseFloat(item.demands_no_tim),
                demands:parseFloat(item.demands),
                future_demands:parseFloat(item.future_demands),

                sign_date: new Date(item.sign_date)
                // estimate_start_date: new Date(item.estimate_start_date),
                // estimate_payment_date:new Date(item.estimate_payment_date),
                // estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                // estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));
    


        console.log(ergaDataWithDates); // Optionally log the sorted data

        // Assuming you have a state setter like setErga defined somewhere
        setReportData(ergaDataWithDates);
        setFilteredData(ergaDataWithDates);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }



    const header = renderHeader();

    

  

  return (
    <div className="card" >
    <h1 className='title'>Αναφορές</h1>
    {/* {user && user.role ==="admin" && (
    <Link to={"/erga/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Έργου" icon="pi pi-plus-circle"/></Link>
    )} */}
   <DataTable ref={dt} value={reportData} onValueChange={(reportData) => setFilteredData(reportData)} rowGroupMode="subheader" groupRowsBy="customer_name" sortMode="single" sortField="customer_name"
                    sortOrder={1} scrollable scrollHeight="600px" loading={loading} 
                    filters={filters}
                    rowGroupHeaderTemplate={headerTemplate} 
                    rowGroupFooterTemplate={footerTemplate} 
                    globalFilterFields={['erga_name'
                        ,'ammount_total','sign_ammount_no_tax'
                        ,'sign_date', 'status',    
                        'total_yes_timologia',
                        'total_no_timologia',
                        'demands_no_tim',
                        'demands',
                        'future_demands' ]}
                    header={header} 
                    tableStyle={{ minWidth: '100rem' }}>



                <Column header="Έργα/Πελάτη" field="erga_name" filter style={{ minWidth: '200px' }}></Column>
                <Column header="Σύνολο Έργου" filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Κατάσταση έργου" field="status"  filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column header="Ημερομηνία υπογραφής σύμβασης" filterField="sign_date" dataType="date" style={{ minWidth: '5rem' }} body={signDateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                <Column header="Εισπράξεις" filterField="total_yes_timologia" dataType="numeric" style={{ minWidth: '5rem' }} body={total_yes_timologiaTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Απαιτήσεις Τιμολογιμένων" filterField="total_no_timologia" dataType="numeric" style={{ minWidth: '5rem' }} body={total_no_timologiaBodyTemplate} filter filterElement={ammountFilterTemplate}  />
                <Column header="Απαιτήσεις Μη Τιμολογιμένων" filterField="demands_no_tim" dataType="numeric" style={{ minWidth: '5rem' }} body={demands_no_timTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Απαιτήσεις" filterField="demands" dataType="numeric" style={{ minWidth: '5rem' }} body={demandsBodyTemplate} filter filterElement={ammountFilterTemplate}  />
                <Column header="Μελλοντικές Απαιτήσεις" filterField="future_demands" dataType="numeric" style={{ minWidth: '5rem' }} body={future_demandsBodyTemplate} filter filterElement={ammountFilterTemplate}  />

            </DataTable>
</div>
  )
}

export default ReportList
