import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Provider, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Toast } from 'primereact/toast';

import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method

import { FilterMatchMode, FilterOperator, FilterService } from 'primereact/api';
        
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
import FormEditParadotea from '../paradotea_components/FormEditParadotea';

import FormEditYpoxreoseis from './FormEditYpoxreoseis';
import FormProfileYpoxreoseis from './FormProfileYpoxreoseis';
import { OverlayPanel } from 'primereact/overlaypanel';

const YpoxreoseisList = () =>
{
    const [ypoxreoseis, setYpoxreoseis] = useState([]);

    const [providers, setProvider]=useState([]);
    const [tags, setTag]=useState([]);

    const {user} = useSelector((state)=>state.auth)

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filteredypoxreoseis, setFilteredYpoxreoseis] = useState([]);

    const toast = useRef(null)

    const [filtercalled,setfiltercalled]=useState(false)

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedYpoxreoseisId, setSelectedYpoxreoseisId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedYpoxreoseis, setSelectedYpoxreoseis] = useState([])
    const [totalincome, setTotalIncome] = useState(0)

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const cols = [
        { field: 'ypoxreoseis.provider', header: 'Προμηθευτής-έξοδο' },
        { field: 'ypoxreoseis.total_owed_ammount', header: 'Ποσό (σύνολο)' },
        { field: 'ypoxreoseis.invoice_date', header: 'Ημερομηνία τιμολογίου' },
        { field: 'ypoxreoseis.ammount_vat', header: 'ΦΠΑ' }
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
        
        const formattedReportData = filteredypoxreoseis.map((product) => {
            return {
                ...product.ypoxreoseis,
                total_owed_ammount: formatCurrency(product.ypoxreoseis.total_owed_ammount),
                invoice_date: formatDate(product.ypoxreoseis.invoice_date),
                ammount_vat:formatCurrency(product.ypoxreoseis.ammount_vat)
            };
        });

        // Step 5: Add the table using autoTable
        doc.autoTable({
        columns: exportColumns,
        body: formattedReportData.map((product) => [
            product.provider,
            product.total_owed_ammount,
            product.invoice_date,
            product.ammount_vat
        ]),
        styles: {
            font: 'Roboto-Regular' // Make sure the table uses the Roboto font
        }
        });

        // Step 6: Save the document
        doc.save('Ypoxreoseis.pdf');
                        
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
                ...filteredypoxreoseis.map((product) =>
                    cols.map((col) => {
                     
                        // Check if the field is 'total_owed_ammount' or any other amount field that needs formatting
                        if (col.field === 'ypoxreoseis.total_owed_ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'total_owed_ammount'
                        }

                        if (col.field === 'ypoxreoseis.ammount_vat')
                        {
                            return formatCurrencyReport(product[col.field]);
                        }

                        if (col.field === 'ypoxreoseis.provider')
                        {
                            return product.ypoxreoseis ? product.ypoxreoseis.provider : ''; 
                        }
                        return product[col.field];
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
    
            saveAsExcelFile(excelBuffer, 'Ypoxreoseis');
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

    

    const accept = (id) => {
        try {
            deleteYpoxreoseis(id);
            toast.current.show({ severity: 'success', summary: 'Deleted Successfully', detail: `Item ${id} has been deleted.` });
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete the item. Please try again.',
                life: 3000,
            });
        } 
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        getYpoxreoseis()
    }

    const confirm = (id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => accept(id),
            reject: () => reject() // Optional
        });
    };


    useEffect(()=>{
        getYpoxreoseis();
        setLoading(false);

        initFilters();

    },[]);

    const getYpoxreoseis = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);


            const uniqueProviders= [...new Set(paraData.map(item => item.ypoxreoseis?.provider || 'N/A'))];
            setProvider(uniqueProviders);

            const uniqueTags = [
                ...new Set(
                  paraData
                    .map(item => item?.tags || []) // Ensure `tags` is always an array
                    .flatMap(value => 
                      Array.isArray(value) 
                        ? value.map(v => v.trim()) // Trim each element if it's an array
                        : [] // Handle non-array values gracefully
                    )
                )
              ];
              setTag(uniqueTags);
            // Convert sign_date to Date object for each item in ergaData
            const parDataWithDates = paraData.map(item => ({
                ...item,
                'ypoxreoseis.invoice_date': new Date(item.ypoxreoseis?.invoice_date),
                'ypoxreoseis.total_owed_ammount': parseFloat(item.ypoxreoseis.total_owed_ammount),
                'ypoxreoseis.ammount_vat': parseFloat(item.ypoxreoseis.ammount_vat)
            }));
            // Sort parDataWithDates by ypoxreoseis.invoice_date in ascending order
            const sortedParData = parDataWithDates.sort((a, b) => {
                const dateA = a['ypoxreoseis.invoice_date'];
                const dateB = b['ypoxreoseis.invoice_date'];
                return dateA - dateB; // Sort in ascending order
            });

            
    
            console.log(sortedParData); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setYpoxreoseis(sortedParData);
            setFilteredYpoxreoseis(sortedParData)
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }



    }

    const deleteYpoxreoseis = async(YpoxreoseisId)=>{
            await axios.delete(`${apiBaseUrl}/ypoquery/${YpoxreoseisId}`);
            getYpoxreoseis();  // Refresh the list after deletion
    }

    const deleteMultipleYpoxreoseis = (ids) => {
        // Assuming you have an API call or logic for deletion
        // Example: If using a REST API for deletion, you might perform a loop or bulk deletion
        if (Array.isArray(ids)) {
            // Handle multiple deletions
            ids.forEach(async (id) => {
                // Existing logic to delete a single Dosi by id, e.g., an API call
                console.log(`Deleting Ypoxreoseis with ID: ${id}`);
                await axios.delete(`${apiBaseUrl}/ypoquery/${id}`);
            });
        } else {
            // Fallback for single ID deletion (just in case)
            console.log(`Deleting ypoxreoseis with ID: ${ids}`);
        }
    
        // Optionally update your state after deletion to remove the deleted items from the UI
        setYpoxreoseis((prevYpoxreoseis) => prevYpoxreoseis.filter((ypoxreoseis) => !ids.includes(ypoxreoseis.ypoxreoseis.id)));
        setSelectedYpoxreoseis([]); // Clear selection after deletion
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
            
            'ypoxreoseis.erga_id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            'ypoxreoseis.provider':  { value: null, matchMode: FilterMatchMode.IN },
            
            'ypoxreoseis.invoice_date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            'ypoxreoseis.total_owed_ammount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            'ypoxreoseis.ammount_vat': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            'tags':  { value: null, matchMode: FilterMatchMode.CUSTOM },

            'ypoxreoseis.doseisCount' : { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

          

        });
        setGlobalFilterValue('');
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
    return formatDate(rowData.ypoxreoseis.invoice_date);
};

const invoice_dateDateFilterTemplate = (options) => {
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};


    const total_owed_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ypoxreoseis.total_owed_ammount);
    };

    const ammount_vatBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ypoxreoseis.ammount_vat);
    };

  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };




    const providersBodyTemplate = (rowData) => {
        
        const provider = rowData.ypoxreoseis?.provider || 'N/A'; 
        console.log("timologio",provider," type ",typeof(provider));
        console.log("rep body template: ",provider)
    
        return (
            <div className="flex align-items-center gap-2" >
                <span>{provider}</span>
            </div>
        );
    };
    
    const providersFilterTemplate = (options) => {
        console.log('Current timologia filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={providers} itemTemplate={providersItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
        };
    
    
    const providersItemTemplate = (option) => {
        console.log("rep Item template: ",option)
        console.log("rep Item type: ",typeof(option))
    
        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };

    const tagsBodyTemplate = (rowData) => {
    
        const tag = Array.isArray(rowData?.tags) 
        ? rowData.tags.join(', ') 
        : 'N/A'; // Ensure a proper string representation
    console.log("Rendered Tags:", tag);

    return (
        <div className="flex align-items-center gap-2">
            <span>{tag}</span>
        </div>
    );
    };
        
    const tagsFilterTemplate = (options) => {
        console.log('Current Filter Value:', options.value);
        console.log('Available Tags:', tags);
    
        return (
            <MultiSelect
                value={options.value} // Currently applied filters
                options={tags} // All unique tags
                itemTemplate={tagsItemTemplate}
                onChange={(e) => {
                    console.log('Selected Filters:', e.value);
                    options.filterCallback(e.value); // Pass selected values back to the DataTable
                }}
                placeholder="Any"
                className="p-column-filter"
            />
        );
    };

    const tagsItemTemplate = (option) => {
        console.log("rep Item template: ",option)
        console.log("rep Item type: ",typeof(option))
    
        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
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

    const confirmMultipleDelete = () => {
        confirmDialog({
            message: 'Are you sure you want to delete the selected records?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                // Delete all selected items after confirmation
                deleteMultipleYpoxreoseis(selectedYpoxreoseis.map(ypoxreoseis => ypoxreoseis.ypoxreoseis.id));
                
                // Show success toast
                toast.current.show({
                    severity: 'success',
                    summary: 'Deleted Successfully',
                    detail: 'Selected items have been deleted.',
                    life: 3000,
                });
            },
            reject: () => {
                // Show cancellation toast
                toast.current.show({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Deletion was cancelled.',
                    life: 3000,
                });
            },
        });
    };



    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };




    const footer = `In total there are ${ypoxreoseis ? ypoxreoseis.length : 0} ypoxrewseis.`;
    const header = renderHeader();
    const ActionsBodyTemplate = (rowData) => {
        const id = rowData.ypoxreoseis?.id;
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
                            <Link to={`/ypoquery/profile/${id}`}>
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
                                        setSelectedYpoxreoseisId(id);
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
                                        setSelectedYpoxreoseisId(id);
                                        setSelectedType('Edit');
                                        setDialogVisible(true);
                                    }}
                                />
                                {/* <Toast ref={toast} /> */}
                                
                                <Button
                                className='action-button'
                                    icon="pi pi-trash"
                                    severity="danger"
                                    aria-label="Delete"
                                    onClick={() => confirm(id)}
                                />
                            </>
                        )}
                    </div>
                </OverlayPanel>
                
            </div>
        );
    };

    const calculateTotalIncome = (data) => {
        
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, item) => Number(acc) + Number(item.ypoxreoseis.total_owed_ammount), 0);
    };

    const handleValueChange = (e) => {
        const visibleRows = e;
        if(e.length>0){
            setfiltercalled(true)
        }

        // Calculate total income for the visible rows
        const incomeSum = visibleRows.reduce((sum, row) => sum + Number((row.ypoxreoseis.total_owed_ammount || 0)), 0);
        
        setTotalIncome(formatCurrency(incomeSum));
    };

    useEffect(() => {
        if(!filtercalled){
            setTotalIncome(formatCurrency(calculateTotalIncome(ypoxreoseis)));
        }
        
    }, [ypoxreoseis]);


    const actionsBodyTemplate = (rowData) => {
        const id=rowData.ypoxreoseis?.id
        return (
            <div className="flex flex-wrap justify-content-center gap-3">
                {user && user.role !== "admin" && (
                    <div>
                        <Link to={`/ypoquery/profile/${id}`} >
                            <Button severity="info" label="Προφίλ" text raised />
                        </Link>
                    </div>
                )}
                {user && user.role === "admin" && (
                    <span className='flex gap-1'>

                            <Button className='action-button' 
                            icon="pi pi-eye" 
                            severity="info" 

                            aria-label="User" 
                            onClick={() => {
                                setSelectedYpoxreoseisId(id);
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
                                setSelectedYpoxreoseisId(id);
                                setSelectedType('Edit');
                                setDialogVisible(true);
                            }}
                        />
                        <Button className='action-button' icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => deleteYpoxreoseis(id)} />
                    </span>
                )}
            </div>
        );
    };

    FilterService.register('tags', (value, filter) => {
        console.log('Row Tags (value):', value); // Debugging log
        console.log('Active Filter (filter):', filter); // Debugging log
    
        // If no filter is applied, show all rows
        if (!filter || filter.length === 0) {
            return true;
        }
    
        // Ensure value is treated as an array
        const valueArray = Array.isArray(value) 
            ? value 
            : (value ? value.split(',').map((v) => v.trim()) : []);

        
    
        // Compare filter values against the row's tags
        return filter.some((f) => valueArray.includes(f.trim()));
    });



    return(

        



        
<div className="card" >
        <h1 className='title'>Υποχρέωσεις</h1>
        <div className='d-flex align-items-center gap-4'>
        {user && user.role ==="admin" && (
        <Link to={"/ypoquery/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέας Υποχρέωσης" className='rounded' icon="pi pi-plus-circle"/></Link>
        )}
        {selectedYpoxreoseis.length > 0 && (
            <Button
                className='button is-primary mb-2 rounded' 
                label="Delete Selected" 
                icon="pi pi-trash" 
                severity="danger" 
                onClick={confirmMultipleDelete} // Pass an array of selected IDs
            />
        )}

        </div>


        <Toast ref={toast} />
        <ConfirmDialog />
<DataTable value={ypoxreoseis} ref = {dt} onValueChange={(ypoxreoseis) => setFilteredYpoxreoseis(ypoxreoseis)} paginator stripedRows
 rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="ypoxreoseis.id" 
            filters={filters} 
            globalFilterFields={[
                'ypoxreoseis.id', 
                'ypoxreoseis.provider', 
                'ypoxreoseis.erga_id',
                'ypoxreoseis.invoice_date',
                'ypoxreoseis.total_owed_ammount',
                'ypoxreoseis.ammount_vat',
                'tags',
                'ypoxreoseis.doseisCount'
                

                ]} 
            header={header} 
            emptyMessage="No timologia found."
            selection={selectedYpoxreoseis} 
            onSelectionChange={(e) => setSelectedYpoxreoseis(e.value)} // Updates state when selection changes
            selectionMode="checkbox"
            rowClassName={(data) => data.ypoxreoseis.doseisCount === 0 ? 'bg-red-300' : ''}
>
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }} ></Column>
                <Column field="ypoxreoseis.id" header="id" sortable style={{ minWidth: '2rem',  }} ></Column>
                <Column header="Προμηθευτής-έξοδο" filterField="ypoxreoseis.provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={providersBodyTemplate} filter filterElement={providersFilterTemplate} />

                <Column header= "Αριθμός των Δόσεων" field='ypoxreoseis.doseisCount' filter filterField='ypoxreoseis.doseisCount' dataType="numeric" ></Column>
                <Column field="ypoxreoseis.erga_id"  header="erga_id"  filter filterPlaceholder="Search by erga_id" style={{ minWidth: '12rem' }}></Column>
               
               
               
                <Column header="Ημερομηνία τιμολογίου" filterField="ypoxreoseis.invoice_date" dataType="date" style={{ minWidth: '5rem' }} body={invoice_dateDateBodyTemplate} filter filterElement={invoice_dateDateFilterTemplate} ></Column>
                <Column header="Ποσό (σύνολο)" filterField="ypoxreoseis.total_owed_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={total_owed_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={totalincome}/>
                
                <Column header="ΦΠΑ" filterField="ypoxreoseis.ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filter filterElement={ammountFilterTemplate} />
                
                <Column field="tags"  header="tags"  showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={tagsBodyTemplate} filter filterElement={tagsFilterTemplate} filterFunction={(value, filter) => FilterService.filters.tags(value, filter)} ></Column>
        
               
                <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }}/>

 </DataTable>
    {/* Dialog for editing Paradotea */}
    <Dialog  visible={dialogVisible} onHide={() => setDialogVisible(false)} modal style={{ width: '50vw' }} maximizable breakpoints={{ '960px': '80vw', '480px': '100vw' }}>
        {selectedYpoxreoseisId && (selectedType=='Edit') && (
        <FormEditYpoxreoseis id={selectedYpoxreoseisId} onHide={() => setDialogVisible(false)}  />
        )}
            {selectedYpoxreoseisId && (selectedType=='Profile') && (
        <FormProfileYpoxreoseis id={selectedYpoxreoseisId} onHide={() => setDialogVisible(false)} />
        )}
    </Dialog>
    
       
    </div>
    )

    

}

export default YpoxreoseisList