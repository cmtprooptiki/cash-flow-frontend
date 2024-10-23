import React,{useState,useEffect, useRef} from 'react'
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

import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";



const ErgaList = () => {
    const [erga,setErga]=useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Σχεδίαση','Ολοκληρωμένο','Αποπληρωμένο','Υπογεγραμμένο','Ακυρωμένο']);
    const [project_managers, setProjectManager]=useState([]);
    const [filteredErga, setFilteredErga] = useState([]);


    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'name', header: 'Έργο' },
        { field: 'customer.name', header: 'Όνομα Πελάτη' },
        { field: 'erga_category.name', header: 'Κατηγορία Έργου' },
        { field: 'ammount_total', header: 'Σύνολο Έργου' },
        { field: 'status', header: 'Κατάσταση έργου' },
        { field: 'sign_date', header: 'Ημερομηνία υπογραφής σύμβασης' },
        { field: 'project_manager', header: 'Project Manager' },
        { field: 'shortname', header: 'Συντομογραφία' },
        { field: 'ammount', header: 'Ποσό (καθαρή αξία)' },

        { field: 'ammount_vat', header: 'Ποσό ΦΠΑ' },
        { field: 'estimate_start_date', header: 'Ημερομηνία έναρξης (εκτίμηση)' }

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
        
        const formattedReportData = filteredErga.map((product) => {
            return {
                ...product,
                ammount_total: formatCurrency(product.ammount_total),
                sign_date: formatDate(product.sign_date),
                ammount: formatCurrency(product.ammount),
                ammount_total: formatCurrency(product.ammount_total), // Format the quantity as currency
                estimate_start_date:formatDate(product.estimate_start_date)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.name,
            product.customer.name,
            product.erga_category.name,
            product.ammount_total,
            product.status,
            product.sign_date, // Now this is formatted as currency
            product.estimate_start_date,
            product.ammount, // Now this is formatted as currency
            product.ammount_vat,
            product.project_manager,
            product.shortname
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('erga.pdf');
                        
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
                ...filteredErga.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount_total') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount_vat') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }

                        if (col.field === 'customer.name')
                        {
                            return product.customer ? product.customer.name : '';
                        }

                        if (col.field === 'erga_category.name')
                            {
                                return product.erga_category ? product.erga_category.name : '';
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
    
            saveAsExcelFile(excelBuffer, 'erga');
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

                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
           
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
        getErga();
        setLoading(false);
        initFilters();
    },[]);

    const getErga = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
            const ergaData = response.data;
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // .map(name => ({ name }));
            setProjectManager(uniqueProjectManager);
            // Convert sign_date to Date object for each item in ergaData
            const ergaDataWithDates = ergaData.map(item => ({
                ...item,
                sign_ammount_no_tax: parseFloat(item.sign_ammount_no_tax),
                ammount_vat: parseFloat(item.ammount_vat),
                ammount: parseFloat(item.ammount),
                ammount_total: parseFloat(item.ammount_total),
                sign_date: new Date(item.sign_date),
                estimate_start_date: new Date(item.estimate_start_date),
                estimate_payment_date:new Date(item.estimate_payment_date),
                estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));
    
            // console.log(ergaDataWithDates); 
            // Assuming you have a state setter like setErga defined somewhere
            // setErga(ergaDataWithDates);


                // Sort ergaDataWithDates by sign_date in ascending order
        const sortedErgaData = ergaDataWithDates.sort((a, b) => a.sign_date - b.sign_date);

        console.log(sortedErgaData); // Optionally log the sorted data

        // Assuming you have a state setter like setErga defined somewhere
        setErga(sortedErgaData);
        setFilteredErga(sortedErgaData)
    
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
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/erga/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span>
                <Link to={`/erga/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" /></Link>
                <Link to={`/erga/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
            
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
    <Link to={"/erga/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Έργου" icon="pi pi-plus-circle"/></Link>
    )}
    <DataTable ref = {dt} value={erga} onValueChange={(erga) => setFilteredErga(erga)} paginator stripedRows showGridlines rows={20} scrollable scrollHeight="800px" loading={loading} dataKey="id" 
            filters={filters} globalFilterFields={['name'
                ,'shortname','sign_ammount_no_tax'
                ,'sign_date', 'status', 'estimate_start_date'
                ,'project_manager','ammount','ammount_vat','ammount_total'
                ,'estimate_payment_date','estimate_payment_date_2','estimate_payment_date_3'
                ,'customer_id','customer.name','erga_cat_id','erga_category.name']} header={header}
            emptyMessage="No customers found.">
                                

        <Column field="name" header="Έργο" alignFrozen="left" frozen filter={true} filterPlaceholder="Search by name" style={{ minWidth: '5rem' }} />
        <Column field="logoImage" header="Λογότυπο" alignFrozen="left" frozen body={imageBodyTemplate}></Column>

        <Column field="shortname" header="Ακρώνυμο έργου" alignFrozen="left" frozen filter={true} filterPlaceholder="Search by shortname" style={{ minWidth: '5rem' }} />
        <Column header="Ημερομηνία υπογραφής σύμβασης" filter={true} filterField="sign_date" dataType="date" style={{ minWidth: '5rem' }} body={signDateBodyTemplate} filterElement={dateFilterTemplate} ></Column>

        <Column header="Κατάσταση έργου" field="status" filter={true} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filterElement={statusFilterTemplate} />
        {/* <Column header="Συμβατική αξία (καθαρό ποσό)" filterField="sign_ammount_no_tax" dataType="numeric" style={{ minWidth: '10rem' }} body={signed_ammount_notaxBodyTemplate} filter filterElement={ammountFilterTemplate} /> */}
 
        <Column header="Ποσό  (καθαρή αξία)" filter={true} filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filterElement={ammountFilterTemplate} />
        <Column header="Ποσό ΦΠΑ" filter={true} filterField="ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filterElement={ammountFilterTemplate} />
        <Column header="Σύνολο" filter={true} filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate}  filterElement={ammountFilterTemplate} />
        <Column header="Ημερομηνία έναρξης (εκτίμηση)" filter={true} filterField="estimate_start_date" dataType="date" style={{ minWidth: '5rem' }} body={estimateStartDateBodyTemplate} filterElement={estimateStartDateFilterTemplate} ></Column>
        {/* <Column header="Ημερομηνία πληρωμής (εκτίμηση)" filterField="estimate_payment_date" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate} filter filterElement={estimatePaymentDateFilterTemplate} ></Column>
        <Column header="Ημερομηνία πληρωμής (εκτίμηση 2)" filterField="estimate_payment_date_2" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate2} filter filterElement={estimatePaymentDateFilterTemplate2} ></Column>
        <Column header="Ημερομηνία πληρωμής (εκτίμηση 3)" filterField="estimate_payment_date_3" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate3} filter filterElement={estimatePaymentDateFilterTemplate3} ></Column> */}
        <Column header="Project Manager" filterField="project_manager" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={projectManagerBodyTemplate} filter={true} filterElement={projectManagerFilterTemplate} />
        
        <Column field="customer.name" header="Όνομα Πελάτη" filter={true} filterPlaceholder="Search by customer name" style={{ minWidth: '5rem' }}/>
        <Column field="erga_category.name" header="Κατηγορία Έργου" filter={true} filterPlaceholder="Search by erga cat name" style={{ minWidth: '5rem' }} />
        <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundColor: 'rgb(25, 81, 114)', color: '#ffffff' }} />
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

export default ErgaList
