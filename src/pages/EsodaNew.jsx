import React, { useEffect, useState } from 'react';
// import Layout from './Layout';
// import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

import axios from 'axios';
// import ApexCharts from 'react-apexcharts';
// import Select from 'react-select';
// import { v4 as uuidv4 } from 'uuid';
// import BuildingMetricsTable from '../components/BuildingMetricsTable';
// import { IconContext } from "react-icons";
// import { GiBubbles } from "react-icons/gi";
// import { HiOutlineLocationMarker } from "react-icons/hi";
import '../dashboard.css';
// import { getColorClass2, getLimitAnnotation } from '../components/HelperComponent';
import apiBaseUrl from '../apiConfig';

// Importing calendar library
import { Calendar, momentLocalizer,DateLocalizer ,DnDCalendar} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// import { Modal, Button } from 'react-bootstrap';

// import InfoBox from '../components/InfoBox';
import InfoBoxAntonis from '../components/InfoBoxAntonis';

// import WeeksTable from '../components/WeeksTable'; // Import the WeeksTable component

import PaidList from '../components/paid_components/PaidLists';
import BudgetChart from '../components/paid_components/BudgetChart';
// import { FaUnderline } from 'react-icons/fa';


const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const EsodaNew = () =>
{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDateType, setSelectedDateType] = useState('estimate_payment_date');
  const [eventClickedFirst, setEventClickedFirst] = useState(false);
  const [boxData, setBoxData] = useState([]);
  const [second_boxData, setSecondBoxData] = useState([]);
  const [paradotea, setParadotea] = useState([]);
  const [erganames, setErgaListNames] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  // const [prevSelectedButton, setPrevSelectedButton] = useState(null);
  const [income_paradotea,setIncome_paradotea]=useState([])
  const [income_ekx,setIncome_ekx]=useState([])
  const [income_ekx_cust, setIncome_Ekx_Cust] = useState([])
  const [incomeTim, setIncomeTim] = useState([]);
  const [daneia,setDaneia]=useState([])

  var [event_is_dropped,set_event_is_dropped]=useState(false)
  var [refresh, setRefresh] = useState(false);
  
  useEffect(() => {
    // Logic that needs to run when `someState` changes
    // For example, you might want to fetch new data or trigger a re-render
    setRefresh(prev => !prev); // Toggle `refresh` state to force a re-render of PaidList
    // console.log("event dropped: ",event_is_dropped)
    // console.log("refresh: ",refresh)
  }, [event_is_dropped]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  useEffect(() => {
    getParadotea();
    getErgaListNames();
    getIncome_paradotea();
    getIncome_ekx();
    getIncome_ekx_cust_date();
    getIncomeTim();
    getDaneia();
    
  }, []);

  const getParadotea = async () => {
    const response = await axios.get(`${apiBaseUrl}/getlistParErgColors`, {timeout: 5000});
    setParadotea(response.data);
  };

//   const getIncome_paradotea=async () =>{
//     const response = await axios.get(`${apiBaseUrl}/CheckParadotea`, {timeout: 5000});
//     setIncome_paradotea(response.data);
//     //console.log(response.data)
//   }
  const getIncome_paradotea=async () =>{
    const response = await axios.get(`${apiBaseUrl}/CheckParadotea`, {timeout: 5000});
    const response2 = await axios.get(`${apiBaseUrl}/income_par`, {timeout: 5000});
    
    // Extracting the data from the responses
    const checkParadoteaData = response.data; // Assuming response.data is an array
    const incomeParData = response2.data; // Assuming response2.data is an array

    // Extract IDs from response2 (income_par data)
    const incomeParIds = incomeParData.map(item => item.paradotea_id);

    // Filter response (CheckParadotea data) based on the extracted IDs
    const filteredData = checkParadoteaData.filter(item => incomeParIds.includes(item.paradotea_id));
    //console.log("hello ",incomeParData)
    setIncome_paradotea(filteredData);
    //console.log(response.data)
  }
  const getIncome_ekx=async () =>{
    const response = await axios.get(`${apiBaseUrl}/ParadoteaBank_Date`, {timeout: 5000});
    const ekx=response.data
    // console.log("ekx data: ",ekx)
    setIncome_ekx(ekx.filter(item => item.Ekxorimena_Timologium.status_bank_paid === "no"));
    //console.log(response.data)
  }

  const getErgaListNames = async () => {
    const response = await axios.get(`${apiBaseUrl}/getlistErgaNames`, {timeout: 5000});
    setErgaListNames(response.data);
  };


  const getIncome_ekx_cust_date = async () =>
    {
      const response = await axios.get(`${apiBaseUrl}/ParadoteaCust_Date`, {timeout: 5000});
      const ekx_cust=response.data
      setIncome_Ekx_Cust(ekx_cust.filter(item => item.Ekxorimena_Timologium.status_customer_paid === "no"));
    }

  const handleYearChange = (increment) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(calendarDate.getFullYear() + increment);
    setCalendarDate(newDate);

  };
  const getIncomeTim = async () => {
    const response = await axios.get(`${apiBaseUrl}/income_tim`, {timeout: 5000});
    setIncomeTim(response.data);
};
const getDaneia = async () =>{
  const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000})
  const response2 =response.data
  setDaneia(response2.filter(item=>item.status==="no"));
}

  // const handleDateChange = (newDate) => {
  //   setCalendarDate(newDate);
  // };

  

  const handleEventClick = (event, item) => {
    setEventClickedFirst(true);
    // console.log("event here ",event)
    console.log("type is: ",event.test,"\n event.item here ",item)
    
    setBoxData(item);
    setSecondBoxData(event);
  };

  const handleEventDrop = async ({ event, start, end }) => {
    //console.log("drag and drop event: ",event)
    if(event.test==="paradotea"){
      const updatedDate = moment.utc(start).startOf('day').toDate();
      const dateTypeKey = selectedDateType;

      try {
        //console.log(event.item.id)
        const response = await axios.patch(`${apiBaseUrl}/paradotea/${event.item.id}`, {
          [dateTypeKey]: updatedDate
        });
        if (response.status === 200) {
          setIncome_paradotea((prev) =>
            prev.map((item) =>
              item.paradotea.id === event.item.id ? { ...item, paradotea: { ...item.paradotea, [dateTypeKey]: updatedDate } } : item
            )
          );
        }
      } catch (error) {
        console.error('Failed to update event', error);
      }
    }
    else if(event.test==="ekxorimena"){
      const updatedDate = moment.utc(start).startOf('day').toDate();
      //console.log(event)
      try {
        //console.log(event.item.ekxorimena_timologia_id)
        const response = await axios.patch(`${apiBaseUrl}/ek_tim/${event.item.ekxorimena_timologia_id}`, {
          "timologia_id":event.item.Ekxorimena_Timologium.timologia_id,///Δεν ξερω γιατι αλλα χωρις αυτο βγαζει Error 400 bad request
          "bank_estimated_date": new Date(updatedDate)
        });
        if (response.status === 200) {
          setIncome_ekx((prev) =>
            prev.map((item) =>
              item.Ekxorimena_Timologium.id === event.item.Ekxorimena_Timologium.id ? { ...item, Ekxorimena_Timologium: { ...item.Ekxorimena_Timologium, "bank_estimated_date": updatedDate } } : item
            )
          );
        }
      } catch (error) {
        console.error('Failed to update event', error);
      }
    }
    else if(event.test==="ekxorimena_customer"){
      const updatedDate = moment.utc(start).startOf('day').toDate();
      //console.log(event)
      try {
        //console.log(event.item.ekxorimena_timologia_id)
        const response = await axios.patch(`${apiBaseUrl}/ek_tim/${event.item.ekxorimena_timologia_id}`, {
          "timologia_id":event.item.Ekxorimena_Timologium.timologia_id,///Δεν ξερω γιατι αλλα χωρις αυτο βγαζει Error 400 bad request
          "cust_estimated_date": new Date(updatedDate)
        });
        if (response.status === 200) {
          setIncome_Ekx_Cust((prev) =>
            prev.map((item) =>
              item.Ekxorimena_Timologium.id === event.item.Ekxorimena_Timologium.id ? { ...item, Ekxorimena_Timologium: { ...item.Ekxorimena_Timologium, "cust_estimated_date": updatedDate } } : item
            )
          );
        }
      } catch (error) {
        console.error('Failed to update event', error);
      }
    }
    else if(event.test==="timologia"){
      const updatedDate = moment.utc(start).startOf('day').toDate();
      //console.log("event: ",event)
      try {
        //console.log(event.item.ekxorimena_timologia_id)
        const response = await axios.patch(`${apiBaseUrl}/timologia/${event.item.id}`, {
          // "timologia_id":event.item.Ekxorimena_Timologium.timologia_id,///Δεν ξερω γιατι αλλα χωρις αυτο βγαζει Error 400 bad request
          "actual_payment_date": new Date(updatedDate)
        });
        if (response.status === 200) {
          //console.log("item tim: ",incomeTim)
          setIncomeTim((prev) =>
            prev.map((item) =>
              item.timologia.id === event.item.id ? {...item,timologia:{...item.timologia,"actual_payment_date":new Date(updatedDate)}}:item
              //item.timologia.id === event.item.id ? { ...item, timologia: { ...item.timologia, "cust_date": updatedDate } } : item
          )
          );
        }
      } catch (error) {
        console.error('Failed to update event', error);
      }
    }
    else if(event.test==="daneia"){
      const updatedDate = moment.utc(start).startOf('day').toDate();
      try {
        //console.log(event.item.id)
        const response = await axios.patch(`${apiBaseUrl}/daneia/${event.item.id}`, {
          payment_date: new Date(updatedDate)
        });
        if (response.status === 200) {
          
          setDaneia((prev) =>
            // console.log(prev)
            prev.map((item) =>
              // console.log("daneia update",item)
              // console.log("daneia update",event.item)

              
              item.id === event.item.id ? { ...item, "payment_date": new Date(updatedDate)  } : item
            )
          );
          // console.log("daneia updated ",daneia)
        }
      } catch (error) {
        console.error('Failed to update event', error);
      }
    }


    if(event_is_dropped){
      set_event_is_dropped(false)
    }else{
      set_event_is_dropped(true)
    }
   
  };
  const eventStyleGetter =(event, start, end, isSelected)=> {
    //console.log(event);
    if (event.test==="timologia"){
      var backgroundColor = "ForestGreen";
      var color="white";
    }
    else if(event.test==="ekxorimena"){
      var backgroundColor = "red";
      var color="white";
    }
    else if(event.test==="ekxorimena_customer"){
      var backgroundColor = "red";
      var color="white";
    }
    else if(event.test==="paradotea"){
      var backgroundColor = "#0288d1";
      var color="white";
    }else if(event.test==="daneia"){
      var backgroundColor = "orange";
      var color="black";
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

  const handleDateTypeChange = (dateType) => {
    setSelectedDateType(dateType);
    
    setSelectedButton(dateType);
  };

  const getDateBySelectedType = (item) => {
    switch (selectedDateType) {
      case 'estimate_payment_date_2':
        return new Date(item.estimate_payment_date_2);
      case 'estimate_payment_date_3':
        return new Date(item.estimate_payment_date_3);
      default:
        return new Date(item.estimate_payment_date);
    }
  };
  //console.log(income_paradotea)
  // const MyEvents=paradotea.map((item) => ({
  //   id: item.ekxorimena_timologia_id,
  //   title: (
  //     <div>
  //       <div
  //         className="circle"
  //         style={{
  //           backgroundColor: item.erga.color,
  //           boxShadow: '0px 0px 4px 2px ' + item.erga.color,
  //         }}
  //       ></div>
  //       {item.ammount_total} €
  //     </div>
  //   ),
  //   start: getDateBySelectedType(item),
  //   end: getDateBySelectedType(item),
  //   item: item,
  // }));
  //console.log(MyEvents)

  const MyEvents=income_paradotea.map((item) => ({
      id: item.paradotea.id,//   id: item.ekxorimena_timologia_id, ?δεν ξερω γιατι ηταν ετσι αλλα και ετσι δουλευε
      test:"paradotea",
      title: (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
          <div
            className="circle"
            style={{
              backgroundColor: "#"+item.paradotea.erga.color,
              boxShadow: '0px 0px 4px 2px #' + item.paradotea.erga.color,
            }}
          ></div>
          {Number(item.paradotea.ammount_total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
        </div>
      ),
      start: getDateBySelectedType(item.paradotea),
      end: getDateBySelectedType(item.paradotea),
      item: item.paradotea,
    }));
    //console.log("My Event : ",MyEvents)



   const ekx=(income_ekx.map((item) => ({
    id: item.ekxorimena_timologia_id,
    test:"ekxorimena",
    title: (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
        <div
          className="circle"
          style={{
            backgroundColor: "#"+item.paradotea.erga.color,
            boxShadow: '0px 0px 4px 2px #' + item.paradotea.erga.color,
          }}
        ></div>
        {/* {console.log(item.Ekxorimena_Timologium.bank_ammount)} */}
        {Number(item.Ekxorimena_Timologium.bank_ammount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
      </div>
    ),
    start: new Date(item.Ekxorimena_Timologium.bank_estimated_date),
    end: new Date(item.Ekxorimena_Timologium.bank_estimated_date),
    item: item,
  })));

  const ekx_cust=(income_ekx_cust.map((item) => ({
    id: item.ekxorimena_timologia_id,
    test:"ekxorimena_customer",
    title: (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
        <div
          className="circle"
          style={{
            backgroundColor: "#"+item.paradotea.erga.color,
            boxShadow: '0px 0px 4px 2px #' + item.paradotea.erga.color,
          }}
        ></div>
        {/* {console.log(item.Ekxorimena_Timologium.customer_ammount)} */}
        {Number(item.Ekxorimena_Timologium.customer_ammount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
      </div>
    ),
    start: new Date(item.Ekxorimena_Timologium.cust_estimated_date),
    end: new Date(item.Ekxorimena_Timologium.cust_estimated_date),
    item: item,
  })));
  //console.log("income tim",incomeTim)
  const tim_income_tim=(incomeTim.map((item) => ({
    id: item.timologia.id,
    test:"timologia",

    title: (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
        {/* <div
          className="circle"
          style={{
            backgroundColor: "red",
            boxShadow: '0px 0px 2px 1px ' + "red",
          }}
        ></div> */}
        {/* {console.log(item.Ekxorimena_Timologium.customer_ammount)} */}
        {/* {item.timologia.ammount_of_income_tax_incl} € */}
        {Number(item.timologia.ammount_of_income_tax_incl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €

        {/* {console.log("timologia item: ",item)} */}
      </div>
    ),
    start: new Date(item.timologia.actual_payment_date),
    end: new Date(item.timologia.actual_payment_date),
    item: item.timologia,
  })));

  const init_daneia=(daneia.map((item)=>({
    id:item.id,
    test:"daneia",
    title:(
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bolder"}}>
        <div
          className="circle"
          style={{
            backgroundColor: "#964B00",
            boxShadow: '0px 0px 4px 2px #C4A484',
          }}
        ></div>
        {/* {console.log(item.Ekxorimena_Timologium.bank_ammount)} */}
        {Number(item.ammount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
      </div>

    ),
    start:new Date(item.payment_date),
    end:new Date(item.payment_date),
    item:item
  })))

  function joinjson(items){
    MyEvents.push(items)
  }

  const uniqueekx = [
    ...ekx
  ].filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );

  const uniqueekx_cust = [
    ...ekx_cust
  ].filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );
  //console.log("timologia",tim_income_tim)
  const uniqueIncome_tim = [
    ...tim_income_tim
  ].filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );
  const uniqueDaneia = [
    ...init_daneia
  ].filter((event, index, self) =>
    index === self.findIndex((e) => e.id === event.id)
  );
  //console.log("timologia unique",uniqueIncome_tim)
  uniqueekx.forEach(joinjson)
  uniqueekx_cust.forEach(joinjson)
  uniqueIncome_tim.forEach(joinjson)
  uniqueDaneia.forEach(joinjson)
 
  
 

  return (
    <div>
    <div className="boxclass">
      <h1 className = "Scenario" style = {{textAlign: "center", marginBottom: 20}}>{selectedButton === 'estimate_payment_date' ? 'Best-Case Scenario' :
         selectedButton === 'estimate_payment_date_2' ? 'Medium-Case Scenario' :
         selectedButton === 'estimate_payment_date_3' ? 'Worst-Case Scenario' : ''}</h1>
      <div className="container">
        <h1 style = {{fontSize: "22px",fontWeight: "bold", textAlign: "left", marginBottom: "25px", marginTop: "25px"}}>Προβλεπόμενα Έσοδα</h1>

        <div className="row">
          <div className="col-md-4">
            <div className="row">
          {eventClickedFirst === true && <InfoBoxAntonis item={boxData} event={second_boxData} />}
          </div>
          <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round row'>
            <div className="scrollable-list">
              <h5>Εργα</h5>
              {erganames.map((item, index) => (
                <div key={index} className="list-item">
                  <div
                    className="circle"
                    style={{
                      backgroundColor: "#"+item.erga.color,
                      boxShadow: '0px 0px 4px 2px ' +"#"+ item.erga.color,
                    }}
                  ></div>
                  <h5>{item.erga.name}</h5>
                </div>
              ))}
            </div>
            </div>

          </div>
          <div className="col-md-8">
            <div className="calendar-container">
              <button className="FiltersYear" style={{ marginRight: 20, marginBottom: 20 }} onClick={() => handleYearChange(-1)}>
                Previous Year
              </button>
              <button className="FiltersYear" style={{ marginBottom: 20 }} onClick={() => handleYearChange(1)}>
                Next Year
              </button>
              <button className={`Filters ${selectedButton === 'estimate_payment_date' ? 'selected' : ''}`} style={{ marginBottom: 20, marginLeft: 20 }} onClick={() => handleDateTypeChange('estimate_payment_date')}>
                Best-Case
              </button>
              <button className={`Filters ${selectedButton === 'estimate_payment_date_2' ? 'selected' : ''}`} style={{ marginBottom: 20, marginLeft: 20 }} onClick={() => handleDateTypeChange('estimate_payment_date_2')}>
                Medium-Case
              </button>
              <button className={`Filters ${selectedButton === 'estimate_payment_date_3' ? 'selected' : ''}`} style={{ marginBottom: 20, marginLeft: 20 }} onClick={() => handleDateTypeChange('estimate_payment_date_3')}>
                Worst-Case
              </button>
              
              <DragAndDropCalendar
                localizer={localizer}
                date={calendarDate}
                onNavigate={(date) => setCalendarDate(date)}
                
                events={MyEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onEventDrop={handleEventDrop}
                onSelectEvent={(event) => handleEventClick(event, event.item)}
                popup
                resizable
                
                draggableAccessor={() => true}
                eventPropGetter={eventStyleGetter}
                
              />
            </div>
          </div>
        </div>
        {/* <div className="row">
        </div> */}
        <div className="row">
          <div className="col-md-12">
            <BudgetChart key={refresh}></BudgetChart>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {/* {uniqueekx.forEach(item => {
              console.log(item.Ekxorimena_Timologium); // Access Ekxorimena_Timologium property for each object
            })} */}
            {/* {income_paradotea.length > 0 && (
              <WeeksTable
                income_paradotea={newparat}
                income_ekx={income_ekx}
                income_ekx_cust={income_ekx_cust}
                selectedDateType={selectedDateType}
                calendarDate={calendarDate}
                onDateChange={handleDateChange}
              />
            )} */}
            
            {/* <WeeksTable income_paradotea={income_paradotea} selectedDateType={selectedDateType} calendarDate={calendarDate} onDateChange={handleDateChange}/> */}
          </div>
        </div>
        
      </div>
      
      </div>
      <br></br>
      <PaidList key={refresh} scenario={selectedDateType}/>
      </div>
      
  );
}

export default EsodaNew;