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
import { Tag } from 'primereact/tag';

import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";
import { Dialog } from 'primereact/dialog';
import FormEditDoseis from '../doseis_components/FormEditDoseis';
import FormProfileDoseis from '../doseis_components/FormProfileDoseis';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';


const DoseisList = () => {
    const [doseis, setDoseis] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [ypoxreoseis, setYpoxreoseis]=useState([]);
    const {user} = useSelector((state) => state.auth)
    const [statuses] = useState(['yes', 'no']);
    const [filtercalled,setfiltercalled]=useState(false)
    const [totalincome, setTotalIncome] = useState(0)

    const [filteredDoseis, setFilteredDoseis] = useState([]);

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDosiId, setSelectedDosiId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const [selectedDoseis, setSelectedDoseis] = useState([]);


    const cols = [
        { field: 'ypoxreosei.provider', header: 'Προμηθευτής-έξοδο' },
        { field: 'ammount', header: 'Ποσό Δόσης' },
        { field: 'estimate_payment_date', header: 'Εκτιμώμενη ημερομηνία πληρωμής' },
        { field: 'actual_payment_date', header: 'Πραγματική ημερομηνία πληρωμής' },
        { field: 'status', header: 'Κατάσταση Δόσης' }
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
        
        const formattedReportData = filteredDoseis.map((product) => {
            return {
                ...product,
                ammount: formatCurrency(product.ammount),
                actual_payment_date: formatDate(product.actual_payment_date),
                estimate_payment_date:formatDate(product.estimate_payment_date)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.ypoxreosei.provider,
            product.ammount,
            product.estimate_payment_date,
            product.actual_payment_date,
            product.status
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('Doseis.pdf');
                        
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
                ...filteredDoseis.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'quantity'
                        }
                        if (col.field === 'ypoxreosei.provider') {
                            return product.ypoxreosei ? product.ypoxreosei.provider : '';  // Apply the currency format to the 'quantity'
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
    
            saveAsExcelFile(excelBuffer, 'doseis');
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
        getDoseis();
        setLoading(false);
        initFilters();
    },[]);

    const getDoseis = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/doseis`, {timeout: 5000});
            const doseis_data = response.data;
            console.log("ParaData:",doseis_data);

            const uniqueYpoxreoseis= [...new Set(doseis_data.map(item => item.ypoxreosei?.provider || 'N/A'))];
            setYpoxreoseis(uniqueYpoxreoseis);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            // console.log("Unique Timologia:",uniqueTimologia);
            // setTimologio(uniqueTimologia);

            // const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            // setErgo(uniqueErga);

            // Convert sign_date to Date object for each item in ergaData
            const doseisDataWithDates = doseis_data.map(item => ({
                ...item,
                ypoxreoseis:
                {
                    ...item.ypoxreoseis,
                    provider: item.ypoxreoseis?.provider || 'N/A'
                },
                // erga: {
                //     ...item.erga,
                //     name: item.erga?.name || 'N/A'
                // },
                // timologia: {
                //     ...item.timologia,
                //     invoice_number: item.timologia?.invoice_number || 'N/A'
                // },
                ammount: parseFloat(item.ammount),
                actual_payment_date: new Date(item.actual_payment_date),
                estimate_payment_date: new Date(item.estimate_payment_date)
            }));
    
            console.log(doseisDataWithDates); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setDoseis(doseisDataWithDates);
            setFilteredDoseis(doseisDataWithDates)
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }
    }

    const deleteDosi = async(doseisId)=>{
        await axios.delete(`${apiBaseUrl}/doseis/${doseisId}`);
        getDoseis();
    }

    const deleteDoseis = (ids) => {
        // Assuming you have an API call or logic for deletion
        // Example: If using a REST API for deletion, you might perform a loop or bulk deletion
        if (Array.isArray(ids)) {
            // Handle multiple deletions
            ids.forEach(async (id) => {
                // Existing logic to delete a single Dosi by id, e.g., an API call
                console.log(`Deleting Dosi with ID: ${id}`);
                await axios.delete(`${apiBaseUrl}/doseis/${id}`);

                // Add your deletion logic here
            });
        } else {
            // Fallback for single ID deletion (just in case)
            console.log(`Deleting Dosi with ID: ${ids}`);
            // Add your deletion logic here
        }
    
        // Optionally update your state after deletion to remove the deleted items from the UI
        setDoseis((prevDoseis) => prevDoseis.filter((dosi) => !ids.includes(dosi.id)));
        setSelectedDoseis([]); // Clear selection after deletion
    };
    

    const onGlobalFilterChange = (e) => {
        
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };



    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () =>
        {
            setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ammount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            actual_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            estimate_payment_date	: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            // ammount_no_tax: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            
            // ammount_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
           
            // ammount_of_income_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
            

            // status_paid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'ypoxreosei.provider':{ value: null, matchMode: FilterMatchMode.IN },
            

        });
        setGlobalFilterValue('');
        }

        

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        console.log("no error here 2")
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

        const ammountBodyTemplate= (rowData) => {
        return formatCurrency(rowData.ammount);
    };
    const ammountFilterTemplate = (options) => {
        console.log("error not here")
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };
    const renderHeader = () => {
        return (
            <div className="header-container flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
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

       //delivery Date
 const estimate_payment_dateDateBodyTemplate = (rowData) => {
    return formatDate(rowData.estimate_payment_date);
};

const estimate_payment_dateDateFilterTemplate = (options) => {
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};

    const ProviderBodyTemplate = (rowData) => {
        
        const provider = rowData.ypoxreosei?.provider || 'N/A';        // console.log("repsBodytempl",timologio)
        // console.log("timologio",ergo," type ",typeof(ergo));
        // console.log("rep body template: ",ergo)

    return (
        <div className="flex align-items-center gap-2">
            {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
            <span>{provider}</span>
        </div>
        );
    };

    const ProviderFilterTemplate = (options) => {
        console.log('Current provider filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={ypoxreoseis} itemTemplate={ProviderItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
        };

        const ProviderItemTemplate = (option) => {
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

    

     //delivery Date
     const actual_payment_dateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.actual_payment_date);
    };
    
    const actual_payment_dateDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
    
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
    const formatCurrency = (value) => {
        // return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const header = renderHeader();

    const ActionsBodyTemplate = (rowData) => {
        const id = rowData.id;
        const op = useRef(null);
        const [hideTimeout, setHideTimeout] = useState(null);
        // console.log("error here 3")
        // Show overlay on mouse over
        const handleMouseEnter = (e) => {
            // console.log("mouse enter")
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                setHideTimeout(null);
            }
            op.current.show(e);
        };
    
        // Hide overlay with delay on mouse leave
        const handleMouseLeave = () => {
            // console.log("mouse exit")
            const timeout = setTimeout(() => {
                op.current.hide();
            }, 100); // Adjust delay as needed
            setHideTimeout(timeout);
        };
        
        return (
            <div className="actions-container">
                <Button 
                    icon="pi pi-ellipsis-v" 
                    className="p-button-text"
                    aria-label="Actions"
                    onMouseEnter={handleMouseEnter} // Show overlay on hover
                    onMouseLeave={handleMouseLeave} // Start hide timeout on mouse leave
                />
    
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
                        {user && user.role !== "admin" && (
                            <Link to={`/doseis/profile/${id}`}>
                                <Button icon="pi pi-eye" severity="info" aria-label="User" />
                            </Link>
                        )}
                        
                        {user && user.role === "admin" && (
                            <>
                                <Button 
                                className='action-button'
                                    icon="pi pi-eye"
                                    severity="info"
                                    aria-label="User"
                                    onClick={() => {
                                        setSelectedDosiId(id);
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
                                        setSelectedDosiId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteDosi(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
            </div>
        );
    };
    

    // const actionsBodyTemplate=(rowData)=>{
    //     const id=rowData.id
    //     return(
    //         <div className=" flex flex-wrap justify-content-center gap-3">
               
    //         {user && user.role!=="admin" &&(
    //             <div>
    //                 <Link to={`/doseis/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
    //             </div>
    //         )}
    //         {user && user.role ==="admin" && (
    //         <span className='flex gap-1'>
    //             <Link to={`/doseis/profile/${id}`} ><Button className='action-button'  icon="pi pi-eye" severity="info" aria-label="User" />
    //             </Link>
    //             <Link to={`/doseis/edit/${id}`}><Button className='action-button'  icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
    //             <Button className='action-button'  icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteDoseis(id)} />
    //             {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
    //         </span>
           
    //         )}
    //         </div>
 
    //     );
    // }

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => Number(acc) + Number(item.ammount), 0);
    };

    const handleValueChange = (e) => {
        const visibleRows = e;
        // console.log("visisble rows:",e);
        if(e.length>0){
            setfiltercalled(true)
        }

        // // Calculate total income for the visible rows
        const incomeSum = visibleRows.reduce((sum, row) => sum + Number((row.ammount || 0)), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
    };

    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome(doseis)));
        }
        
    }, [doseis]);

    // const actionsBodyTemplate = (rowData) => {
    //     const id = rowData.id;
    //     return (
    //         <div className="flex flex-wrap justify-content-center gap-3">
    //             {user && user.role !== "admin" && (
    //                 <div>
    //                     <Link to={`/doseis/profile/${id}`} >
    //                         <Button severity="info" label="Προφίλ" text raised />
    //                     </Link>
    //                 </div>
    //             )}
    //             {user && user.role === "admin" && (
    //                 <span className='flex gap-1'>
    //                     {/* <Link to={`/paradotea/profile/${id}`} > */}

    //                         <Button className='action-button' 
    //                         icon="pi pi-eye" 
    //                         severity="info" 

    //                         aria-label="User" 
    //                         onClick={() => {
    //                             setSelectedDosiId(id);
    //                             setSelectedType('Profile');
    //                             setDialogVisible(true);
    //                         }}
    //                         />
    //                     {/* </Link> */}
    //                     <Button
    //                         className='action-button'
    //                         icon="pi pi-pen-to-square"
    //                         severity="info"
    //                         aria-label="Edit"
    //                         onClick={() => {
    //                             setSelectedDosiId(id);
    //                             setSelectedType('Edit');
    //                             setDialogVisible(true);
    //                         }}
    //                     />
    //                     <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteDosi(id)} />
    //                 </span>
    //             )}
    //         </div>
    //     );
    // };





    
     return(


<div className="card" >
    
        <h1 className='title'>Δόσεις</h1>
        {user && user.role ==="admin" && (
        <Link to={"/doseis/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεας Δόσης" icon="pi pi-plus-circle"/></Link>
        )}
        {user && user.role ==="admin" && (
        <Link to={"/doseis/multiAdd"} className='button is-primary mb-2'><Button label="Προσθήκη Πολλαπλών Δόσεων" icon="pi pi-plus-circle"/></Link>
        )}

{selectedDoseis.length > 0 && (
            <Button 
                label="Delete Selected" 
                icon="pi pi-trash" 
                severity="danger" 
                onClick={() => deleteDoseis(selectedDoseis.map(dosi => dosi.id))} // Pass an array of selected IDs
            />
        )}

{/* scrollable scrollHeight="600px" */}
{/* <DataTable value={doseis} ref = {dt} onValueChange={(doseis) => {setFilteredDoseis(doseis); handleValueChange(doseis)}} paginator stripedRows
 rows={20}  loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'id',
                'ypoxreosei.provider', 
                'ammount', 
                'actual_payment_date',
                'estimate_payment_date',
                'ammount_no_tax',
                'status'
                ]} 
            header={header} 
            emptyMessage="No doseis found."> */}

                    <DataTable 
                        value={doseis} 
                        ref={dt} 
                        onValueChange={(doseis) => { setFilteredDoseis(doseis); handleValueChange(doseis); }}
                        paginator 
                        stripedRows
                        rows={20}  
                        loading={loading} 
                        dataKey="id" 
                        filters={filters} 
                        globalFilterFields={[
                            'id',
                            'ypoxreosei.provider', 
                            'ammount', 
                            'actual_payment_date',
                            'estimate_payment_date',
                            'ammount_no_tax',
                            'status'
                        ]}
                        header={header} 
                        emptyMessage="No doseis found."
                        selection={selectedDoseis} 
                        onSelectionChange={(e) => setSelectedDoseis(e.value)} // Updates state when selection changes
                        selectionMode="checkbox"
                    >
                         <Column selectionMode="multiple" headerStyle={{ width: '3em' }} alignFrozen="left" frozen></Column>
                         {/* Other columns remain as before */}
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column header="Προμηθευτής-έξοδο" filterField="ypoxreosei.provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={ProviderBodyTemplate} filter filterElement={ProviderFilterTemplate} />  
               <Column header="Ποσό Δόσης" filterField="ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalincome} />
               <Column header="Πραγματική ημερομηνία πληρωμής" filterField="actual_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={actual_payment_dateDateBodyTemplate} filter filterElement={actual_payment_dateDateFilterTemplate} ></Column>
                <Column header="Εκτιμώμενη ημερομηνία πληρωμής" filterField="estimate_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={estimate_payment_dateDateBodyTemplate} filter filterElement={estimate_payment_dateDateFilterTemplate} ></Column>

                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}     

            <Column field="status" header="Κατάσταση" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />

            {/* <Column field="status_paid" header="status_paid"  filter filterPlaceholder="Search by status_paid"  style={{ minWidth: '12rem' }}></Column> */}

        
               
                <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }} />
                {/* <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }} /> */}
                {/* <Column header="Ενέργειες" field="id" body={thirdActionBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }} /> */}

 </DataTable>

        <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedDosiId && (selectedType=='Edit') && (
            <FormEditDoseis id={selectedDosiId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedDosiId && (selectedType=='Profile') && (
            <FormProfileDoseis id={selectedDosiId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>
        
        
        
       
    </div>
     )
}

export default DoseisList;
