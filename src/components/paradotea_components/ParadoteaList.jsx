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

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog'; // Import Dialog
import FormEditParadotea from './FormEditParadotea'; // Adjust the import path as necessary
import FormProfileParadotea from './FormProfileParadotea';

import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";
import { OverlayPanel } from 'primereact/overlaypanel';

const ParadoteaList = () => {
    const [paradotea, setParadotea] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [timologia, setTimologio]=useState([]);
    const [erga, setErgo]=useState([]);
    const [ergashort, setErgoShort]=useState([]);
    const [filteredParadotea, setFilteredParadotea] = useState([]);
    


    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedParadoteaId, setSelectedParadoteaId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedParadotea, setSelectedParadotea] = useState([]);


    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'erga.name', header: 'Έργο' },
        { field: 'erga.shortname', header: 'Ακρόνυμο έργου' },
        { field: 'part_number', header: 'Παραδοτέο (Αριθμός)' },
        { field: 'title', header: 'Τίτλος παραδοτέου' },
        { field: 'delivery_date', header: 'Ημερομηνία υποβολής' },
        { field: 'percentage', header: 'Ποσοστό σύμβασης' },
        { field: 'ammount', header: 'Ποσό (καθαρή αξία)' },
        { field: 'ammount_vat', header: 'Ποσό ΦΠΑ' },
        { field: 'ammount_total', header: 'Σύνολο' },
        { field: 'estimate_payment_date', header: 'Ημερομηνία πληρωμής (εκτίμηση)' },
        {field: 'estimate_payment_date_2', header: 'Ημερομηνία πληρωμής (εκτίμηση 2)' },
        {field: 'estimate_payment_date_3', header: 'Ημερομηνία πληρωμής (εκτίμηση 3)' },
        {field: 'comments', header: 'Σχόλια' },
        { field: 'timologia.invoice_number', header: 'Τιμολόγια' }

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
        
        const formattedReportData = filteredParadotea.map((product) => {
            return {
                ...product,
                ammount: formatCurrency(product.ammount),
                delivery_date: formatDate(product.delivery_date),
                ammount_vat: formatCurrency(product.ammount_vat),
                ammount_total: formatCurrency(product.ammount_total),
                estimate_payment_date: formatDate(product.estimate_payment_date), // Format the quantity as currency
                estimate_payment_date_2:formatDate(product.estimate_payment_date_2),
                estimate_payment_date_3: formatDate(product.estimate_payment_date_3)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.erga.name,
            product.erga.shortname,
            product.part_number,
            product.title,
            product.delivery_date,
            product.percentage, // Now this is formatted as currency
            product.ammount,
            product.ammount_vat, // Now this is formatted as currency
            product.ammount_total, // Now this is formatted as currency
            product.estimate_payment_date,
            product.estimate_payment_date_2,
            product.estimate_payment_date_3,
            product.comments,
            product.timologia.invoice_number
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('Paradotea.pdf');
                        
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
                ...filteredParadotea.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount_vat') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ammount_total') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }

                        if (col.field === 'erga.name')
                        {
                            return product.erga ? product.erga.name : '';
                        }
    
                        if (col.field === 'erga.shortname')
                        {
                            return product.erga ? product.erga.shortname : '';
                        }

                        if (col.field === 'timologia.invoice_number')
                        {
                            return product.timologia ? product.timologia.invoice_number : '';
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
    
            saveAsExcelFile(excelBuffer, 'Paradotea');
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
        getParadotea()
        setLoading(false);
        initFilters();
    },[]);

    const getParadotea = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            console.log("Unique Timologia:",uniqueTimologia);
            setTimologio(uniqueTimologia);

            const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            setErgo(uniqueErga);

            const uniqueErgaShort= [...new Set(paraData.map(item => item.erga?.shortname || 'N/A'))];
            setErgoShort(uniqueErgaShort);

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
                ammount: parseFloat(item.ammount),
                ammount_vat: parseFloat(item.ammount_vat),
                ammount_total: parseFloat(item.ammount_total),
                estimate_payment_date: new Date(item.estimate_payment_date),
                estimate_payment_date_2:new Date(item.estimate_payment_date_2),
                estimate_payment_date_3:new Date(item.estimate_payment_date_3)
            }));


            const sortedParaData = parDataWithDates.sort((a, b) => a.delivery_date - b.delivery_date);

    
            console.log(sortedParaData); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setParadotea(sortedParaData);
            setFilteredParadotea(sortedParaData)
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }


    const deleteParadotea = async(ParadoteoId)=>{
        await axios.delete(`${apiBaseUrl}/paradotea/${ParadoteoId}`);
        getParadotea();
    }
    const deleteParadoteaSelected = (ids) => {
        // Assuming you have an API call or logic for deletion
        // Example: If using a REST API for deletion, you might perform a loop or bulk deletion
        if (Array.isArray(ids)) {
            // Handle multiple deletions
            ids.forEach(async (id) => {
                // Existing logic to delete a single Dosi by id, e.g., an API call
                console.log(`Deleting Dosi with ID: ${id}`);
                await axios.delete(`${apiBaseUrl}/paradotea/${id}`);

                // Add your deletion logic here
            });
        } else {
            // Fallback for single ID deletion (just in case)
            console.log(`Deleting Dosi with ID: ${ids}`);
            // Add your deletion logic here
        }
    
        // Optionally update your state after deletion to remove the deleted items from the UI
        setParadotea((prevParadotea) => prevParadotea.filter((paradoteo) => !ids.includes(paradoteo.id)));
        setSelectedParadotea([]); // Clear selection after deletion
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

            comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            
            'erga.name':{ value: null, matchMode: FilterMatchMode.IN },
            'erga.shortname':{ value: null, matchMode: FilterMatchMode.IN },
            'timologia.invoice_number':  { value: null, matchMode: FilterMatchMode.IN },
            

        });
        setGlobalFilterValue('');
    };


 

    const {user} = useSelector((state)=>state.auth)

    // const clearLocks = () =>
    //     {
    //         setFrozenColumns([]); // Clear all frozen columns
    //     }

        const allColumnFields = ['erga.name', 'erga.shortname'];
        const [frozenColumns, setFrozenColumns] = useState(['erga.name', 'erga.shortname']); // Initially frozen column(s)
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
    
         // Function to toggle all columns
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

//shortname

const shortnameBodyTemplate = (rowData) => {
        
    const ergo = rowData.erga?.shortname || 'N/A';        // console.log("repsBodytempl",timologio)
    console.log("timologio",ergo," type ",typeof(ergo));
    console.log("rep body template: ",ergo)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{ergo}</span>
        </div>
    );
};

const shortnameFilterTemplate = (options) => {
    console.log('Current timologia filter value:', options.value);

        return (<MultiSelect value={options.value} options={ergashort} itemTemplate={shortnameItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };


const shortnameItemTemplate = (option) => {
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


    // const actionsBodyTemplate=(rowData)=>{
    //     const id=rowData.id
    //     return(
    //         <div className=" flex flex-wrap justify-content-center gap-3">
               
    //         {user && user.role!=="admin" &&(
    //             <div>
    //                 <Link to={`/paradotea/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
    //             </div>
    //         )}
    //         {user && user.role ==="admin" && (
    //         <span className='flex gap-1'>
    //             <Link to={`/paradotea/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
    //             </Link>
    //             <Link to={`/paradotea/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
    //             <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteParadotea(id)} />
    //             {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
    //         </span>
           
    //         )}
    //         </div>
 
    //     );
    // }

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
                            <Link to={`/paradotea/profile/${id}`}>
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
                                        setSelectedParadoteaId(id);
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
                                        setSelectedParadoteaId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteParadotea(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
            </div>
        );
    };


    const actionsBodyTemplate2 = (rowData) => {
        const id = rowData.id;
        return (
            <div className="flex flex-wrap justify-content-center gap-3">
                {user && user.role !== "admin" && (
                    <div>
                        <Link to={`/paradotea/profile/${id}`} >
                            <Button severity="info" label="Προφίλ" text raised />
                        </Link>
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
                                setSelectedParadoteaId(id);
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
                                setSelectedParadoteaId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                        <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteParadotea(id)} />
                    </span>
                )}
            </div>
        );
    };


    // const actionsBodyTemplate = (rowData) => {
    //     const id = rowData.id;
    //     return (
    //         <div className="relative actions-menu-container">
    //             {/* Three dots icon */}
    //             <Button
    //                 icon="pi pi-ellipsis-v" 
    //                 className="actions-menu-button"
    //                 aria-label="Actions Menu"
    //             />
    //             {/* Buttons that will appear on hover */}
    //             <div className="hidden-buttons">
    //                 <Link to={`/paradotea/profile/${id}`}>
    //                     <Button icon="pi pi-eye" severity="info" aria-label="User" />
    //                 </Link>
    //                 {user && user.role === "admin" && (
    //                     <>
    //                         <Button
    //                             icon="pi pi-pen-to-square"
    //                             severity="info"
    //                             aria-label="Edit"
    //                             onClick={() => {
    //                                 setSelectedParadoteaId(id);
    //                                 setDialogVisible(true);
    //                             }}
    //                         />
    //                         <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteParadotea(id)} />
    //                     </>
    //                 )}
    //             </div>
    //         </div>
    //     );
    // };
   


    return(
        <div className="card" >
        <h1 className='title'>Παραδοτέα</h1>
        {user && user.role ==="admin" && (
        <Link to={"/paradotea/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Παραδοτέου" icon="pi pi-plus-circle"/></Link>
        )}

        {selectedParadotea.length > 0 && (
            <Button 
                label="Delete Selected" 
                icon="pi pi-trash" 
                severity="danger" 
                onClick={() => deleteParadoteaSelected(selectedParadotea.map(paradoteo => paradoteo.id))} // Pass an array of selected IDs
            />
        )}



<DataTable value={paradotea} ref = {dt} onValueChange={(paradotea) => setFilteredParadotea(paradotea)} paginator stripedRows
 rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={['id', 'part_number', 
                'title','delivery_date', 'percentage',
                'ammount','ammount_vat','ammount_total',
                'estimate_payment_date',
                'estimate_payment_date_2',
                'estimate_payment_date_3',
                'comments',
                'erga.name',
                'erga.shortname',
                'timologia.invoice_number'
                ]} 
            header={header} 
            emptyMessage="No customers found."
            selection={selectedParadotea} 
            onSelectionChange={(e) => setSelectedParadotea(e.value)} // Updates state when selection changes
            selectionMode="checkbox"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

                <Column className='font-bold' field="id" header="id" sortable style={{ minWidth: '2rem', color: 'black' }} frozen ></Column>
                <Column className="font-bold" header={renderColumnHeader('Έργα', 'erga.name')}
                frozen={frozenColumns.includes('erga.name')} filterField="erga.name" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem', color: 'black' }}
                    body={ergaBodyTemplate} filter filterElement={ergaFilterTemplate} />  
                <Column className="font-bold" header={renderColumnHeader('Ακρόνυμο έργου', 'erga.shortname')} filterField="erga.shortname" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem', color: 'black' }}
                    body={shortnameBodyTemplate} filter filterElement={shortnameFilterTemplate} frozen={frozenColumns.includes('erga.shortname')} />  

                <Column field="part_number"  header="Παραδοτέο (Αριθμός)"  filter filterPlaceholder="Search by part number" style={{ minWidth: '12rem' }}></Column>
                <Column field="title" header="Τίτλος παραδοτέου"  filter filterPlaceholder="Search by title"  style={{ minWidth: '12rem' }}></Column>
                <Column header="Ημερομηνία υποβολής" filterField="delivery_date" dataType="date" style={{ minWidth: '5rem' }} body={deliveryDateBodyTemplate} filter filterElement={deliveryDateFilterTemplate} ></Column>

                <Column field="percentage" header="Ποσοστό σύμβασης"  style={{ minWidth: '12rem' }}></Column>
                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}

                <Column header="Ποσό  (καθαρή αξία)" filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Ποσό ΦΠΑ " filterField="ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Σύνολο" filterField="ammount_total" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_totalBodyTemplate} filter filterElement={ammountFilterTemplate} />
       
                <Column header="Ημερομηνία πληρωμής (εκτίμηση)" filterField="estimate_payment_date" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate} filter filterElement={estimatePaymentDateFilterTemplate} ></Column>
                <Column header="Ημερομηνία πληρωμής  (εκτίμηση 2)" filterField="estimate_payment_date_2" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate2} filter filterElement={estimatePaymentDateFilterTemplate2} ></Column>
                <Column header="Ημερομηνία πληρωμής  (εκτίμηση 3)" filterField="estimate_payment_date_3" dataType="date" style={{ minWidth: '5rem' }} body={estimatePaymentDateBodyTemplate3} filter filterElement={estimatePaymentDateFilterTemplate3} ></Column>
               
                <Column field="comments" header="Σχόλιο"  filter filterPlaceholder="Search by comments"  style={{ minWidth: '12rem' }}></Column>

                {/* <Column  field="delivery_date" header="delivery_date" dataType="date" style={{ minWidth: '10rem' }} ></Column> */}
                {/* <Column field="erga_id" header="erga_id" dataType="numeric"  sortable style={{ minWidth: '2rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate}  ></Column> */}
                {/* <Column header="erga.name" filterField="erga.name" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                   ></Column>
                 */}

            

             <Column header="Τιμολόγια" filterField="timologia.invoice_number" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={timologiaBodyTemplate} filter filterElement={timologiaFilterTemplate} />
                <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }}/>

 </DataTable>

    {/* Dialog for editing Paradotea */}
    <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedParadoteaId && (selectedType=='Edit') && (
            <FormEditParadotea id={selectedParadoteaId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedParadoteaId && (selectedType=='Profile') && (
            <FormProfileParadotea id={selectedParadoteaId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>

        
       
    </div>
    )
}

export default ParadoteaList;