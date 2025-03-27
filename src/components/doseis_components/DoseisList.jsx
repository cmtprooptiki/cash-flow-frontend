import React,{useState,useEffect, useRef} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { FilterMatchMode, FilterOperator, FilterService } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';





import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method

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
    const [tags, setTag]=useState([]);

    const [month, setMonth] = useState("")

    const [filteredDoseis, setFilteredDoseis] = useState([]);

    const dt = useRef(null);
    const robotoBase64 = robotoData.robotoBase64;

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDosiId, setSelectedDosiId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const [selectedDoseis, setSelectedDoseis] = useState([]);


    const cols = [
        { field: 'provider', header: 'Προμηθευτής-έξοδο' },
        { field: 'ammount', header: 'Ποσό Δόσης' },
        { field: 'estimate_payment_date', header: 'Εκτιμώμενη ημερομηνία πληρωμής' },
        { field: 'actual_payment_date', header: 'Πραγματική ημερομηνία πληρωμής' },
        { field: 'status', header: 'Κατάσταση Δόσης' }
    ];

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        let validEdit = false;
    
        // Utility function to safely handle string trimming
        const safeTrim = (value) => (typeof value === 'string' ? value.trim() : '');
    
        switch (field) {
            case 'status':
                 // Assuming dropdowns or calendar components return an object like { value: actualValue }
                 if (newValue && newValue.value !== undefined) {
                    rowData[field] = newValue.value;
                    newValue = newValue.value;
                    validEdit = true;
                } else if (typeof newValue === 'string' || typeof newValue === 'number' || newValue instanceof Date) {
                    // Handle plain value (non-dropdown or custom component returns)
                    rowData[field] = newValue;
                    validEdit = true;
                } else {
                    event.preventDefault();
                }
                break;
            case 'ammount':
                 // Assuming dropdowns or calendar components return an object like { value: actualValue }
                 if (newValue && newValue.value !== undefined) {
                    rowData[field] = newValue.value;
                    newValue = newValue.value;
                    validEdit = true;
                } else if (typeof newValue === 'string' || typeof newValue === 'number' || newValue instanceof Date) {
                    // Handle plain value (non-dropdown or custom component returns)
                    rowData[field] = newValue;
                    validEdit = true;
                } else {
                    event.preventDefault();
                }
                break;
            case 'estimate_payment_date':
                 // Assuming dropdowns or calendar components return an object like { value: actualValue }
                 if (newValue && newValue.value !== undefined) {
                    rowData[field] = newValue.value;
                    newValue = newValue.value;
                    validEdit = true;
                } else if (typeof newValue === 'string' || typeof newValue === 'number' || newValue instanceof Date) {
                    // Handle plain value (non-dropdown or custom component returns)
                    rowData[field] = newValue;
                    validEdit = true;
                } else {
                    event.preventDefault();
                }
                break;
            case 'actual_payment_date':
                // Assuming dropdowns or calendar components return an object like { value: actualValue }
                if (newValue && newValue.value !== undefined) {
                    rowData[field] = newValue.value;
                    newValue = newValue.value;
                    validEdit = true;
                } else if (typeof newValue === 'string' || typeof newValue === 'number' || newValue instanceof Date) {
                    // Handle plain value (non-dropdown or custom component returns)
                    rowData[field] = newValue;
                    validEdit = true;
                }
                else if(newValue === null)
                {
                    rowData[field] = newValue;
                    validEdit = true;
                } 
                else {
                    event.preventDefault();
                }
                break;
    
            default:
                const trimmedValue = safeTrim(newValue);
                if (trimmedValue.length > 0 || newValue === '') {
                    console.log("Still here!!!!")
                    rowData[field] = trimmedValue;
                    validEdit = true;
                } else {
                    console.warn(`Empty or invalid value for field ${field}`);
                    event.preventDefault();
                }
                break;
        }
    
        if (validEdit) {
            try {
                console.log("Data being sent to backend:", rowData);

                if (field === 'comment' && newValue === '')
                {
                    newValue = null
                }

                if (field === 'actual_payment_date' && newValue === null)
                {
                    const response = await axios.patch(`${apiBaseUrl}/doseis/${rowData.doseis_id}`, {
                        [field]: newValue,
                        status: 'no'
                    });
                    if (response.status === 200) {
                        console.log('Update successful');
                    } else {
                        console.error(`Update failed with status: ${response.status}`);
                        
                    }
                }
                else if (field === 'actual_payment_date' && newValue !== null)
                {
                    const response = await axios.patch(`${apiBaseUrl}/doseis/${rowData.doseis_id}`, {
                        [field]: newValue,
                        status: 'yes'
                    });
                    if (response.status === 200) {
                        console.log('Update successful');
                    } else {
                        console.error(`Update failed with status: ${response.status}`);
                        
                    }
                }
                else
                {
                    const response = await axios.patch(`${apiBaseUrl}/doseis/${rowData.doseis_id}`, {
                        [field]: newValue,
                    });
                    if (response.status === 200) {
                        console.log('Update successful');
                    } else {
                        console.error(`Update failed with status: ${response.status}`);
                        
                    }
                }
                
                
            } catch (error) {
                console.error('Error updating the product:', error);
                event.preventDefault();
            }
        }
    };



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
            product.provider,
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
                     
                        // Check if the field is 'ammount' or any other amount field that needs formatting
                        if (col.field === 'ammount') {
                            return formatCurrencyReport(product[col.field]);  // Apply the currency format to the 'ammount'
                        }
                        if (col.field === 'ypoxreosei.provider') {
                            return product.ypoxreosei ? product.ypoxreosei.provider : '';  
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

            const uniqueYpoxreoseis= [...new Set(doseis_data.map(item => item.provider ))];
            setYpoxreoseis(uniqueYpoxreoseis);


            const uniqueTags = [...new Set(
                doseis_data
                    .map(item => item.tag_name || '') // Extract values
                    .flatMap(value => value.split(',').map(v => v.trim())) // Split by comma and trim spaces
            )];
            setTag(uniqueTags)
            const doseisDataWithDates = doseis_data.map(item => ({
                ...item,
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

            });
        } else {
            // Fallback for single ID deletion (just in case)
            console.log(`Deleting Dosi with ID: ${ids}`);
        }
    
        // Optionally update your state after deletion to remove the deleted items from the UI
        setDoseis((prevDoseis) => prevDoseis.filter((dosi) => !ids.includes(dosi.doseis_id)));
        setSelectedDoseis([]); // Clear selection after deletion
    };

    const toast = useRef(null)

    const accept = (id) => {
        try {
            deleteDosi(id);
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
        getDoseis()
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

    const confirmMultipleDelete = () => {
        confirmDialog({
            message: 'Are you sure you want to delete the selected records?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                // Delete all selected items after confirmation
                deleteDoseis(selectedDoseis.map(doseis => doseis.doseis_id));
                
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
            'provider':{ value: null, matchMode: FilterMatchMode.IN },
            'tag_name': { value: null, matchMode: FilterMatchMode.CUSTOM },
            

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
        
        const provider = rowData.provider || 'N/A';

    return (
        <div className="flex align-items-center gap-2">
            <span>{provider}</span>
        </div>
        );
    };

    const ProviderFilterTemplate = (options) => {
        console.log('Current provider filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={ypoxreoseis} itemTemplate={ProviderItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
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

        const tagsBodyTemplate = (rowData) => {
            console.log("RRRRRRRR :", rowData.tag_name);
            let tag = rowData.tag_name
            tag = tag.replace(',', ', ');
    
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
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const priceEditor = (options) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback(e.value)}
                mode="currency"
                currency="USD"
                locale="en-US"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        options.editorCallback(e.target.value);
                    }
                }}
                autoFocus
            />
        );
    };

    const dateEditor2 = (options) => {
        const isEpochDate =
          options.value instanceof Date &&
          options.value.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
      
        // Show current date only if value is exactly epoch or undefined/null
        const value = options.value === null
          ? null
          : !options.value || isEpochDate
          ? new Date()
          : options.value;
      
        const clearDate = () => {
          options.editorCallback(null); // Set it to null and show calendar as empty
        };
      
        return (
          <div>
            <Calendar
              value={value}
              onChange={(e) => options.editorCallback(e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Επιλέξτε ημερομηνία"
              autoFocus
            />
            <div className="control">
              <Button
                label="Clear"
                onClick={clearDate}
                className="p-button-secondary mt-2"
                type="button"
              />
            </div>
          </div>
        );
      };

    const dateEditor = (options) => {
        const isEpochDate =
        options.value instanceof Date &&
        options.value.getTime() === new Date('1970-01-01T00:00:00Z').getTime();

        const value = !options.value || isEpochDate ? new Date() : options.value;

        return (
          <Calendar
            value={value}
            onChange={(e) => options.editorCallback(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
            placeholder="Επιλέξτε ημερομηνία"
            autoFocus
          />
        );
      };

    const cellEditor = (options) => {
        if (options.field === 'ammount') return priceEditor(options);
        else if (options.field === 'status') return dropdownEditor(options, statuses); // Dropdown editor for category
        else if (options.field === 'actual_payment_date') return dateEditor2(options)
        else if (options.field === 'estimate_payment_date') return dateEditor(options)
        else return textEditor(options);
    };
    
    const textEditor = (options) => {
        return (
            <InputText
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        options.editorCallback(e.target.value);
                    }
                }}
                autoFocus
            />
        );
    };

    const dropdownEditor = (options,list) => {
        return (
            <Dropdown
                value={options.value}
                options={list} // Use the list of options
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select option"
                onKeyDown={(e) => e.stopPropagation()}
            />
        );
    };


    const header = renderHeader();

    const ActionsBodyTemplate = (rowData) => {
        const id = rowData.doseis_id;
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
        return data.reduce((acc, item) => Number(acc) + Number(item.ammount), 0);
    };

    const handleValueChange = (e) => {
        const visibleRows = e;
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
    FilterService.register('tag_name', (value, filter) => {
        if (!filter || filter.length === 0) {
            return true; // Show all rows when no filter is set
        }
        
        // If the value is null, undefined, or an empty string, check if empty value is selected in the filter
        if (!value) {
            // If filter contains an empty string or null, allow the row to be displayed
            return filter.includes('') || filter.includes(null);
        }
    
        // Otherwise, split and trim the value to compare with the filter
        const valueArray = value.split(',').map((v) => v.trim()); // Split and trim any extra spaces
        return filter.some((f) => valueArray.includes(f.trim()) || (f === '' && valueArray.length === 0)); // Check if any filter value matches
    });




    
     return(


<div className="card" >
    
        <h1 className='title'>Δόσεις</h1>
        <div className='d-flex align-items-center gap-4 '>
        {user && user.role ==="admin" && (
        <Link to={"/doseis/add"} className='button is-primary mb-2 '><Button label="Προσθήκη Νεας Δόσης" className='rounded' icon="pi pi-plus-circle"/></Link>
        )}
        {user && user.role ==="admin" && (
        <Link to={"/doseis/multiAdd"} className='button is-primary mb-2 rounded-pill'><Button label="Προσθήκη Πολλαπλών Δόσεων" className='rounded' icon="pi pi-plus-circle"/></Link>
        )}

{selectedDoseis.length > 0 && (
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

                    <DataTable 
                        value={doseis} 
                        ref={dt} 
                        onValueChange={(doseis) => { setFilteredDoseis(doseis); handleValueChange(doseis); }}
                        paginator 
                        stripedRows
                        rows={20}  
                        loading={loading} 
                        dataKey="doseis_id" 
                        filters={filters}
                        editMode="cell" 
                        globalFilterFields={[
                            'doseis_id',
                            'provider', 
                            'ammount', 
                            'actual_payment_date',
                            'estimate_payment_date',
                            'ammount_no_tax',
                            'status',
                            'tag_name'
                        ]}
                        header={header} 
                        emptyMessage="No doseis found."
                        selection={selectedDoseis} 
                        onSelectionChange={(e) => setSelectedDoseis(e.value)} // Updates state when selection changes
                        selectionMode="checkbox"
                    >
                         <Column selectionMode="multiple" headerStyle={{ width: '3em' }} alignFrozen="left" frozen></Column>
                         {/* Other columns remain as before */}
                <Column field="doseis_id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column header="Προμηθευτής-έξοδο" filterField="provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={ProviderBodyTemplate} filter filterElement={ProviderFilterTemplate} />

<Column field="tag_name"  header="tags"  showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={tagsBodyTemplate} filter filterElement={tagsFilterTemplate} filterFunction={(value, filter) => FilterService.filters.tag_name(value, filter)}  ></Column>  
                 <Column field = "month" header = "Month"  style={{ minWidth: '5rem' }} body={(rowData) => {
            const date = new Date(rowData.estimate_payment_date); // Parse the date
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
            ];
            return isNaN(date.getTime())
                ? "Invalid Date" // Handle invalid date
                : monthNames[date.getMonth()]; // Get the month name
        }}></Column>
                <Column field="comment" header='comment' style={{ minWidth: '12rem' }} onCellEditComplete={onCellEditComplete} editor={(options) => cellEditor(options)}></Column>
               <Column header="Ποσό Δόσης" filterField="ammount" field = "ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} onCellEditComplete={onCellEditComplete} footer={totalincome} editor={(options) => cellEditor(options)} />
               <Column header="Πραγματική ημερομηνία πληρωμής" field = "actual_payment_date" filterField="actual_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={actual_payment_dateDateBodyTemplate} onCellEditComplete={onCellEditComplete} editor={(options) => cellEditor(options)} filter filterElement={actual_payment_dateDateFilterTemplate} ></Column>
                <Column header="Εκτιμώμενη ημερομηνία πληρωμής" filterField="estimate_payment_date" field = "estimate_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={estimate_payment_dateDateBodyTemplate} filter filterElement={estimate_payment_dateDateFilterTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} ></Column>


            <Column field="status" header="Κατάσταση" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} onCellEditComplete={onCellEditComplete} editor={(options) => cellEditor(options)}/>

            
               
               
                <Column header="Ενέργειες" field="id" body={ActionsBodyTemplate} alignFrozen="right" frozen headerStyle={{ backgroundImage: 'linear-gradient(to right, #1400B9, #00B4D8)', color: '#ffffff' }} />

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
