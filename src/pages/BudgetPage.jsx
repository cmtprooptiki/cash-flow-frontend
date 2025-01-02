
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to fetch the budget from the backend
import Layout from './Layout';
import PaidBudgetList from './PaidBudgetList';
import apiBaseUrl from '../apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

import {ReactComponent as BudgetIcon } from '../icons/budget.svg';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import {  momentLocalizer} from 'react-big-calendar';
import { Calendar  }  from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog } from 'primereact/dialog';
import apiBaseFrontUrl from '../apiFrontConfig';
import { Divider } from 'primereact/divider';
import {ReactComponent as IncomeIcon } from '../icons/income_icon.svg';
import {ReactComponent as CostIcon } from '../icons/cost_icon.svg';
import 'moment/locale/el'; // Import Greek locale

moment.locale('el');


const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(Calendar);

const BudgetPage = () => {
    const [budget, setBudget] = useState(null); // Set initial state to null to indicate loading
    const [date, setDate] = useState(null); // State to store the budget date
    const [msg, setMsg] = useState("");

    const [paradotea, setIncomeParadotea] = useState([]);
    const [ekxorimena, setEkxorimena] = useState([]);
    const [incomeTim, setIncomeTim] = useState([]);
    const [daneia,setDaneia]=useState([]);
    const [doseis,setDoseis]=useState([]);
    const [combinedData,setCombinedData]=useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null); // State to store the row data to display

    const [calendarDate, setCalendarDate] = useState(new Date());
    const[selectedIdType,setSelectedIdType]=useState([])

    const [visible, setVisible] = useState(false); // State to control the visibility of the popup
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError} = useSelector((state=>state.auth));
  
    useEffect(()=>{
        dispatch(getMe());
    },[dispatch]);
    
    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    },[isError,navigate]);

   

    // Fetch the budget and date from the database when the component mounts
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                // Fetch budget from your API endpoint
                const response = await axios.get(`${apiBaseUrl}/budget`, {timeout: 5000});
                if (response.data && response.data.length > 0) {
                    // Assuming the first record is the one you're interested in
                    const budgetData = response.data[0];
                    setBudget(budgetData.ammount);
                    setDate(budgetData.date); // Store the budget date
                } else {
                    setMsg("No budget found.");
                }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                } else {
                    setMsg("Failed to fetch budget. Please try again.");
                }
            }
        };

        fetchBudget(); // Fetch the budget on component mount
    }, []);

    const getDoseis = async () =>{
        const response = await axios.get(`${apiBaseUrl}/doseis`, {timeout: 5000})
        console.log("Doseika:::::: ", response.data)
        setDoseis(response.data)
    }

    const getEkxorimena = async () => {
        const response = await axios.get(`${apiBaseUrl}/ek_tim`, {timeout: 5000});
        setEkxorimena(response.data);
    };

    const getIncomePar = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_par`, {timeout: 5000});
        setIncomeParadotea(response.data);
    };

    const getIncomeTim = async () => {
        const response = await axios.get(`${apiBaseUrl}/income_tim`, {timeout: 5000});
        const data = response.data;

        // Filter to ensure unique timologia.id values
        const uniqueTimologia = [];
        const seenTimologiaIds = new Set();

        data.forEach(item => {
            if (!seenTimologiaIds.has(item.timologia.id)) {
                seenTimologiaIds.add(item.timologia.id);
                uniqueTimologia.push(item);
            }
        });
        setIncomeTim(uniqueTimologia);
    };
    const getDaneia = async () =>{
        const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000})
        setDaneia(response.data);
    }

    const fetchData = async () => {
        await getDoseis();
        await getEkxorimena();
        await getIncomePar();
        await getIncomeTim();
        await getDaneia();
    };
    
    useEffect(() => {
        fetchData();       
    }, []);


    const scenario="table1"
    useEffect(()=>{
        let combinedData2 = [];
        console.log("scenario ",scenario)
            combinedData2 = [
                ...ekxorimena.filter(item => item.status_bank_paid === "no").map(item => ({ date: new Date(item.bank_estimated_date), income: parseFloat(item.bank_ammount), type: 'Bank', id: item.id })),
                ...ekxorimena.filter(item => item.status_customer_paid === "no").map(item => ({ date: new Date(item.cust_estimated_date), income: parseFloat(item.customer_ammount), type: 'Customer', id: item.id})),
                ...paradotea.map(item => ({ date: new Date(item.paradotea.estimate_payment_date), income: parseFloat(item.paradotea.ammount_total), type: 'Paradotea', id: item.paradotea_id })),
                ...incomeTim.filter(item => item.timologia.status_paid === "no").map(item => ({ date: new Date(item.timologia.actual_payment_date), income: parseFloat(item.timologia.ammount_of_income_tax_incl), type: 'Timologia', id: item.timologia_id })),
                ...daneia.filter(item=>item.status==="no").map(item=>({ date: new Date(item.payment_date), income: parseFloat(item.ammount), type: 'Daneia', id: item.id })),
                ...doseis.filter(item=>item.status==="no").map(item=>({ date: new Date(item.estimate_payment_date), income: parseFloat((-1)*item.ammount) , type: 'doseis', id: item.doseis_id }))
            ];
            setCombinedData(combinedData2)
    },[paradotea,ekxorimena,incomeTim,daneia,doseis])

    // Convert the fetched budget to a float for calculations
    const parsedBudget = parseFloat(budget);
    const validBudget = isNaN(parsedBudget) ? 0 : parsedBudget;

    // Format the date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Show loading state if the budget is still being fetched
    if (budget === null || date === null) {
        return (
            <Layout>
                <div>Loading budget...</div>
            </Layout>
        );
    }

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    

    
    const getParadoteoId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/paradotea/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getTimologioId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/timologia/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getDaneioId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/daneia/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getDosiId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/doseis/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }
    const getEkxId = async(id)=>{
        console.log("id scenario id ",id)
        const response = await axios.get(`${apiBaseUrl}/ek_tim/${id}`, {timeout: 5000})
        setSelectedRowData(response.data)
    }

    



    
    
    

    const handleRowData = (rowData) => {
        setSelectedRowData(rowData);
        setSelectedIdType(rowData.type)
        if(rowData.type ==="Paradotea"){
            getParadoteoId(rowData.id)
        }else if(rowData.type ==="Timologia"){
            getTimologioId(rowData.id)
        }else if(rowData.type ==="Daneia"){
            getDaneioId(rowData.id)
        }else if(rowData.type ==="doseis"){
            getDosiId(rowData.id)
        }else if(rowData.type ==="Bank" || rowData.type==="Customer"){
            getEkxId(rowData.id)
        }
        
        setVisible(true);
    };

    const handleEventClick = (event, item) => {
        handleRowData(item)
        console.log("type tests: event.item here ",item)
      };

    const MyEvents=combinedData.map((item) => ({
        id: item.id,//   id: item.ekxorimena_timologia_id, ?δεν ξερω γιατι ηταν ετσι αλλα και ετσι δουλευε
        test:item.type,
        title: (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
        
            {Number(item.income).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
        ),
        start: item.date,
        end: item.date,
        item: item,
      }));
      //Style Colors for Calendar Esoda with Color green E3oda with Color Red
      const eventStyleGetter =(event, start, end, isSelected)=> {
        let backgroundColor = "black";
        let color = "white"
        if (event.test==="Timologia"){
            backgroundColor = "ForestGreen";
            color="white";
        }
        else if(event.test==="Bank"){
            backgroundColor = "ForestGreen";
            color="white";
        }
        else if(event.test==="Customer"){
                backgroundColor = "ForestGreen";
                color="white";
          }
        else if(event.test==="doseis"){
            backgroundColor = "red";
            color="white";
        }
        else if(event.test==="Paradotea"){
            backgroundColor = "ForestGreen";
            color="white";
        }else if(event.test==="Daneia"){
            backgroundColor = "ForestGreen";
            color="white";
        }
        
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: color,
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    const defaultMessages = {
        date: 'Ημερομηνία',
        time: 'Ώρα',
        event: 'Ποσό',
        allDay: 'All Day',
        week: 'Εβδομάδα',
        work_week: 'Εργάσιμη Εβοδμάδα',
        day: 'Μέρα',
        month: 'Μήνας',
        previous: 'Προηγόυμενο',
        next: 'Επόμενο',
        yesterday: 'Χθές',
        tomorrow: 'Αύριο',
        today: 'Σήμερα',
        agenda: 'Ατζέντα',
        noEventsInRange: 'There are no events in this range.',
        showMore: function showMore(total) {
            return "+" + total + " more";
        }
    };



    


    return (
        <Layout>
            <div >
                {msg && <p>{msg}</p>}
                <div className="col-12 md:col-6 lg:col-3">
      <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-5">
              <div>
                  <h6 className="m-0 mb-1 text-500 text-gray-800">Τραπεζικά Διαθέσιμα</h6>
                  <h1 className="m-0 text-gray-800 ">{formatCurrency(validBudget)}</h1>
                  <small className="m-0 text-gray-800 ">Τελευταία Ενημέρωση: {formatDate(date)}</small>
              </div>
              <div className="flex align-items-center justify-content-center bg-bluegray-100" style={{ width: '5rem', height: '5rem',borderRadius:'50%' }}>
                  <BudgetIcon style={{ width: '2.5em', height: '2.5em' ,fill:'black'}}  className="" /> 
              </div>
          </div>
          
      </div>
  </div>
            </div>
            <br></br>
            
            <DragAndDropCalendar
                localizer={localizer}
                date={calendarDate}
                onNavigate={(date) => setCalendarDate(date)}
                events={MyEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "600px"}}
                onSelectEvent={(event) => handleEventClick(event, event.item)}
                popup
                resizable
                messages={defaultMessages}
                draggableAccessor={() => true}
                eventPropGetter={eventStyleGetter}
              />
            
            <Dialog header="Πληροφορίες" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                {selectedRowData && selectedIdType==="Paradotea" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}><h3>Τιμολόγιο</h3>  
                        <h3>Παραδοτέο</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Τίτλος παραδοτέου:</strong> {selectedRowData.title}</p>
                        <p><strong>Παραδοτέο (Αριθμός): </strong>{selectedRowData.part_number}</p>
                        <p><strong>Ημερομηνία υποβολής: </strong>{formatDate(selectedRowData.delivery_date)}</p>
                        <p><strong>Ποσοστό σύμβασης: </strong>{selectedRowData.percentage} %</p>
                        <p><strong>Ποσό  (καθαρή αξία): </strong>{formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ποσό ΦΠΑ: </strong>{formatCurrency(selectedRowData.ammount_vat)}</p>
                        <p><strong>Σύνολο: </strong>{formatCurrency(selectedRowData.ammount_total)}</p>
                        <p><strong>Ημερομηνία πληρωμής (εκτίμηση): </strong>{formatDate(selectedRowData.estimate_payment_date)}</p>
                        <p><strong>Ημερομηνία πληρωμής  (εκτίμηση 2): </strong>{formatDate(selectedRowData.estimate_payment_date_2)}</p>
                        <p><strong>Ημερομηνία πληρωμής  (εκτίμηση 3): </strong>{formatDate(selectedRowData.estimate_payment_date_3)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/edit/${selectedRowData.id}`}>Επεξεργασία παραδοτέου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/paradotea/profile/${selectedRowData.id}`}>Πληροφορίες παραδοτέου</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="Timologia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}><h3>Τιμολόγιο</h3>  
                            <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Αρ. τιμολογίου:</strong> {selectedRowData.invoice_number}</p>
                        <p><strong>Ημερομηνία έκδοσης τιμολογίου:</strong> {formatDate(selectedRowData.invoice_date)}</p>
                        <p><strong>Ποσό τιμολογίου  (καθαρή αξία):</strong> {formatCurrency(selectedRowData.ammount_no_tax)}</p>
                        <p><strong>Ποσό ΦΠΑ:</strong>{formatCurrency(selectedRowData.ammount_tax_incl)}</p>
                        <p><strong>Πληρωτέο:</strong>{formatCurrency(selectedRowData.ammount_of_income_tax_incl)}</p>
                        <p><strong>Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)</strong> {formatDate(selectedRowData.actual_payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/edit/${selectedRowData.id}`}>Επεξεργασία τιμολογίου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/timologia/profile/${selectedRowData.id}`}>Πληροφορίες τιμολογίου</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="doseis" && (
                    
                    <div>
                        {console.log("Daneikaaaa: ", selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}>
                            <h3>Δόση</h3>

                            <CostIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Ποσό:</strong> {formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Πραγματική ημερομηνία πληρωμής:</strong> {formatDate(selectedRowData.actual_payment_date)}</p>
                        <p><strong>Εκτιμώμενη ημερομηνία πληρωμής:</strong> {formatDate(selectedRowData.estimate_payment_date)}</p>
                        <p><strong>Κατάσταση:</strong> {selectedRowData.status}</p>
                        <p><strong>id υποχρεωσης:</strong> {selectedRowData.ypoxreoseis_id}</p>
                        <p><strong>Προμηθευτής-έξοδο:</strong> {selectedRowData.ypoxreosei?.provider}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/doseis/edit/${selectedRowData.id}`}>Επεξεργασία δόσης</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/doseis/profile/${selectedRowData.id}`}>Πληροφορίες δόσης</a></strong></p>
                    </div>
                )}
                {selectedRowData && selectedIdType==="Daneia" && (
                    
                    <div>
                        {console.log(selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}} >

                        <h3>Δάνειο</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>Περιγραφή:</strong> {selectedRowData.name}</p>
                        <p><strong>Ποσό:</strong> {formatCurrency(selectedRowData.ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής δανείου(εκτίμηση):</strong> {formatDate(selectedRowData.payment_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/edit/${selectedRowData.id}`}>Επεξεργασία δανείου</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/daneia/profile/${selectedRowData.id}`}>Πληροφορίες δανείου</a></strong></p>
                    </div>
                )}
                {selectedRowData && (selectedIdType==="Bank" || selectedIdType==="Customer") && (
                    
                    <div>
                        {console.log("Kantoooo", selectedRowData)}
                        <span style={{display:"flex",flexDirection:"row-reverse",justifyContent:"flex-end",alignItems:"center"}}>  

                        <h3>Εκχώρηση</h3>
                        <IncomeIcon style={{ width: '4.5em', height: '4.5em' ,fill:'black'}}  className="" />
                        </span>
                        <Divider/>
                        <p><strong>ID:</strong> {selectedRowData.id}</p>
                        <p><strong>related with invoice:</strong> {selectedRowData.timologia_id}</p>
                        <p><strong>Εκχώρηση (€): </strong>{formatCurrency(selectedRowData.bank_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από τράπεζα (εκτίμηση): </strong>{formatDate(selectedRowData.bank_estimated_date)}</p>
                        <p><strong>Υπόλοιπο από πελάτη (€): </strong>{formatCurrency(selectedRowData.customer_ammount)}</p>
                        <p><strong>Ημερομηνία πληρωμής από πελάτη (εκτίμηση): </strong>{formatDate(selectedRowData.cust_estimated_date)}</p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/edit/${selectedRowData.id}`}>Επεξεργασία εκχώρησης</a></strong></p>
                        <p><strong><a href = {`${apiBaseFrontUrl}/ek_tim/profile/${selectedRowData.id}`}>Πληροφορίες εκχώρησης</a></strong></p>
                    </div>
                )}
            </Dialog>

                <br></br>
            <PaidBudgetList key={combinedData.length} budget={validBudget} combinedData3={combinedData}/>
        </Layout>
    );
};

export default BudgetPage;