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

const PaidList = () => {
    const [paradotea, setIncomeParadotea] = useState([]);
    const [ekxorimena, setEkxorimena] = useState([]);
    const [incomeTim, setIncomeTim] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['Bank', 'Customer','Paradotea','Timologia']);
    const [totalIncome, setTotalIncome] = useState(0);

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
    };

    const getEkxorimena = async () => {
        const response = await axios.get(`${apiBaseUrl}/ek_tim`);
        setEkxorimena(response.data);
    };

    const getIncomePar = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_par`);
        setIncomeParadotea(response.data);
    };

    const getIncomeTim = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_tim`);
        setIncomeTim(response.data);
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
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            income: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

        });
        setGlobalFilterValue('');
    };

    const formatDate = (value) => {
        let date = new Date(value);
        
        if (!isNaN(date)) {
            console.log("show date ",date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }))
            return date.toLocaleDateString('en-US', {
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
    return formatDate(rowData.date);
};

const dateFilterTemplate = (options) => {
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};


const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
};

const ammountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.income);
};


const ammountFilterTemplate = (options) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
};


const getSeverity = (status) => {
    switch (status) {
        case 'Bank':
            return 'danger';

        case 'Customer':
            return 'success';
        case 'Paradotea':
            return 'danger';

        case 'Timologia':
            return 'success';
     
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

        return data.reduce((acc, item) => acc + item.income, 0);
    };
    

    const combinedData = [
        ...ekxorimena.map(item => ({ date: new Date(item.bank_date), income: item.bank_ammount, type: 'Bank', id: item.id })),
        ...ekxorimena.map(item => ({ date: new Date(item.customer_date), income: item.customer_ammount, type: 'Customer', id: item.id })),
        ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: item.paradotea.ammount_total, type: 'Paradotea', id: item.id })),
        ...incomeTim.map(item => ({ date: new Date(item.timologia.actual_payment_date), income: item.timologia.ammount_of_income_tax_incl, type: 'Timologia', id: item.id }))
    ];





    useEffect(() => {
        setTotalIncome(calculateTotalIncome(combinedData));
    }, [combinedData]);

    const handleFilter = (filteredData) => {
        console.log("filtered data: ",filteredData)
        setTotalIncome(calculateTotalIncome(filteredData));
    };

    //console.log(combinedData)

    const thisYearTotal = (filter) => {
        console.log("filter data",filter)
        console.log("filter filters",filter.props.filters)
        let total2=0;
        ///check if filters have been applied
        ///if applied
        if(filter.props.filters!=null){
            for(let typeFilter of filter.props.filters.type.constraints){
                ///check for each filter of type column if it has value (if the values is null then this type of filter has not been applied)
                if(typeFilter.value){
                    if(typeFilter.matchMode=="equals"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(sale.type==typeFilter.value){
                                total2 += sale.income;
                            }  
                        }                        
                    }   
                }
            }
            for(let typeFilter of filter.props.filters.date.constraints){
                ///check for each filter of type column if it has value (if the values is null then this type of filter has not been applied)
                if(typeFilter.value){ 
                    if(typeFilter.matchMode=="dateAfter"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(new Date(sale.date)>=new Date(typeFilter.value)){
                                total2 += sale.income;
                            }  
                        }                        
                    }  
                    if(typeFilter.matchMode=="dateBefore"){
                        ///we add all income values only if their column type matches our selected filters
                        for(let sale of filter.props.value) {
                            if(new Date(sale.date)<=new Date(typeFilter.value)){
                                total2 += sale.income;
                            }  
                        }                        
                    }    
                }
            }
            

            return formatCurrency(total2);
        }
        ///if not applied
        let total = 0;
        for(let sale of combinedData) {
            total += sale.income;
        }

        return formatCurrency(total);
    }

    const handelAllFilters=(filters)=>{
        console.log("Type filter: ",filters.type.constraints)
    }

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
            
            >
                <Column filterField="date" header="date" dataType="date" style={{ minWidth: '5rem' }} body={DateBodyTemplate} filter filterElement={dateFilterTemplate}></Column>
                {/* <Column filterField="income" header="income" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={formatCurrency(totalIncome)}></Column> */}
                <Column filterField="income" header="income" dataType="numeric" style={{ minWidth: '5rem' }} body={ammountBodyTemplate} filter filterElement={ammountFilterTemplate} footer={thisYearTotal} ></Column>
                <Column field="type" header="Type" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />

                <Column field="id" header="Id" filter sortable></Column>

            </DataTable>
        </div>
    );
};

export default PaidList;
