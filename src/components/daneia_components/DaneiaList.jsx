import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Provider, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import {Dialog} from 'primereact/dialog'

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import FormEditDaneia from '../daneia_components/FormEditDaneia'
import FormProfileDaneia from '../daneia_components/FormProfileDaneia'

import robotoData from '../report_components/robotoBase64.json';
import { jsPDF } from "jspdf";
import { OverlayPanel } from 'primereact/overlaypanel';

const DaneiaList = () => {
    const [daneia, setDaneia] = useState([]);
    const {user} = useSelector((state)=>state.auth)
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['yes', 'no']);
    const [filteredDaneia, setFilteredDaneia] = useState([]);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDaneiaId, setSelectedDaneiaId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'name', header: 'Έργο' },
        { field: 'ammount', header: 'Ποσό δανείου' },
        { field: 'payment_date', header: 'Πληρωμή Δανείου(εκτίμηση)' },
        { field: 'actual_payment_date', header: 'Πληρωμή Δανείου' },
        { field: 'status', header: 'Κατάσταση έργου' }
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
        
        const formattedReportData = filteredDaneia.map((product) => {
            return {
                ...product,
                ammount: formatCurrency(product.ammount),
                payment_date: formatDate(product.payment_date),
                actual_payment_date:formatDate(product.actual_payment_date)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.name,
            product.ammount,
            product.payment_date,
            product.actual_payment_date,
            product.status
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('daneia.pdf');
                        
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
                ...filteredDaneia.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'quantity' or any other amount field that needs formatting
                        if (col.field === 'ammount') {
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
    
    useEffect(()=>{
        getDaneia()
        setLoading(false);

        initFilters();
    },[]);

    const getDaneia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000});
        const daneia_data = response.data;
        const Daneia_Data = daneia_data.map(item => ({
            ...item,
            'daneia.ammount': parseFloat(item.ammount),
            'daneia.payment_date': new Date(item.payment_date),
            'daneia.actual_payment_date': new Date(item.actual_payment_date)
            
        }));
        setDaneia(Daneia_Data);
        setFilteredDaneia(Daneia_Data)
    }
    const deleteDaneia = async(daneiaId)=>{
        await axios.delete(`${apiBaseUrl}/daneia/${daneiaId}`);
        getDaneia();
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
            
            'daneia.payment_date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'daneia.actual_payment_date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            'daneia.ammount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            'status': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }

        });
        setGlobalFilterValue('');
    };

    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
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


    // const formatDate = (value) => {
    //     let date = new Date(value);
    //     if (!isNaN(date)) {
    //         return date.toLocaleDateString('en-GB', {
    //             day: '2-digit',
    //             month: '2-digit',
    //             year: 'numeric'
    //         });
    //     } else {
    //         return "Invalid date";
    //     }
    // };
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

    const PaymentDateBodyTemplate = (rowData) => {
        return formatDate(rowData.payment_date);
    };
    
    const PaymentDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    }

    const ActualPaymentDateBodyTemplate = (rowData) => {
        return formatDate(rowData.actual_payment_date);
    };
    
    const ActualPaymentDateFilterTemplate = (options) => {
        console.log('Current filter value:', options);
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    }

    const ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount);
    };

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
                            <Link to={`/daneia/profile/${id}`}>
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
                                        setSelectedDaneiaId(id);
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
                                        setSelectedDaneiaId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => deleteDaneia(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    const actionsBodyTemplate2=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/daneia/profile/${id}`} >
                    <Button className='action-button'  severity="info" label="Προφίλ" text raised /></Link>
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
                                setSelectedDaneiaId(id);
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
                                setSelectedDaneiaId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                             <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteDaneia(id)} />
                             </span>
                        )}
            </div>
 
        );
    }

    return(



        
        <div className="card" >
                <h1 className='title'>Δάνεια</h1>
                {user && user.role ==="admin" && (
                <Link to={"/daneia/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέου Δανείου" icon="pi pi-plus-circle"/></Link>
                )}
        
        
        
        <DataTable value={daneia} paginator ref = {dt} onValueChange={(daneia) => setFilteredDaneia(daneia)}
         rows={20} stripedRows scrollable scrollHeight="600px" loading={loading} dataKey="id" 
                    filters={filters} 
                    globalFilterFields={[
                        'daneia.id', 
                        'name', 
                        'daneia.ammount',
                        'daneia.payment_date',
                        'daneia.actual_payment_date',
                        'status'
                        ]} 
                    header={header} 
                    emptyMessage="No daneia found.">
                        <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                        <Column field="name" header="Ονομα δανείου"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
                       
                        <Column header="Ποσό δανείου" filterField="daneia.ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                       
                        <Column header=" Πληρωμή Δανείου(εκτίμηση)" filterField="daneia.payment_date" dataType="date" style={{ minWidth: '5rem' }} body={PaymentDateBodyTemplate} filter filterElement={PaymentDateFilterTemplate} ></Column>
                        <Column header="Πληρωμή Δανείου" filterField="daneia.actual_payment_date" dataType="date" style={{ minWidth: '5rem' }} body={ActualPaymentDateBodyTemplate} filter filterElement={ActualPaymentDateFilterTemplate} ></Column>
        
                        {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}
        
                        <Column field="status" header="Κατάσταση Δανείου" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
        
                
                       
                        <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }}/>
        
         </DataTable>

         <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
            {selectedDaneiaId && (selectedType=='Edit') && (
            <FormEditDaneia id={selectedDaneiaId} onHide={() => setDialogVisible(false)} />
            )}
             {selectedDaneiaId && (selectedType=='Profile') && (
            <FormProfileDaneia id={selectedDaneiaId} onHide={() => setDialogVisible(false)} />
            )}
        </Dialog>

               
            </div>)
}


export default DaneiaList