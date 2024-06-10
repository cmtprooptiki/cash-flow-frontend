import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import Esoda from './Esoda';
import Eksoda from './Eksoda';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
// import BuildingMetricsTable from '../components/BuildingMetricsTable';
import { IconContext } from "react-icons";
import { GiBubbles } from "react-icons/gi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import '../dashboard.css';
import { getColorClass2, getLimitAnnotation } from '../components/HelperComponent';
import apiBaseUrl from '../apiConfig';

// Importing calendar library
import { Calendar, momentLocalizer,DateLocalizer ,DnDCalendar} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Modal, Button } from 'react-bootstrap';

import InfoBox from '../components/InfoBox';

import WeeksTable from '../components/WeeksTable'; // Import the WeeksTable component

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Dashboard = () => {
  //Kodikas ippo
  //const [events, setEvents] = useState([]);
 
  //const [selectedEvent, setSelectedEvent] = useState(null); // State variable to store selected event
  //const [selectedSlot, setSelectedSlot] = useState(null); // State variable to store selected slot
 
  ///test
  //const [showModal, setShowModal] = useState(false);

  //const [newDate, setNewDate] = useState(null);
 
 
  
  // function details_scene(){
  //   setDetails(true)
  //   setEventClickedFirst(false)
  // }

  
  
 
  // const handleSlotSelect = async slotInfo => {
  //   if (eventClickedFirst && selectedEvent) {
  //     try {
  //       const updatedDate = moment.utc(slotInfo.end).startOf('day').toDate();
  //       const response = await axios.patch(`${apiBaseUrl}/paradotea/${selectedEvent.id}`, {
  //         estimate_payment_date: updatedDate
  //       });
        
 
  //       if (response.status === 200) {
  //         setParadotea(prev => prev.map(item =>
  //           item.id === selectedEvent.id ? { ...item, estimate_payment_date: updatedDate } : item
  //         ));
  //         setSelectedEvent(null);
  //         setEventClickedFirst(false);
  //         /////test
  //         setShowModal(false);
  //       }
  //     } catch (error) {
  //       console.error('Failed to update event', error);
  //     }
  //   } else {
  //     console.log("Slot selected without clicking event first");
  //   }
  // };


//telos ippo code


 

      // const testData = [
      //   {
      //     id: 1,
      //     title: 'Event 1',
      //     start: new Date(2024, 4, 15, 10, 0), // Year, Month (0-based), Day, Hour, Minute
      //     end: new Date(2024, 4, 15, 12, 0)
      //   },

      //   {
      //     id: 2,
      //     title: 'Event 2',
      //     start: new Date(2024, 4, 16, 14, 0),
      //     end: new Date(2024, 4, 16, 16, 0)
      //   }
      // ];

      // setEvents(testData); // Set test data as events
//   }
    
// }
//test
//const handleClose = () => setShowModal(false);

 

              {/* <Calendar
                localizer={localizer}
                events={paradotea.map(item => ({
                  id: item.id,
                  title: <div><div className="circle" style={{ backgroundColor: item.erga.color }}></div>{item.ammount_total} €</div>,
                  //title:<div><div className="circle" style={{ backgroundColor: 'green' }}></div><h2 style={{fontSize:"18px",backgroundColor:"green"}}>{item.ammount_total},HELLO</h2></div>,
                  //title:newhtml,
                  start: new Date(item.estimate_payment_date),
                  end: new Date(item.estimate_payment_date) // You may need to adjust this based on your data
                 
                }))}
                startAccessor="start"
                endAccessor="end"
                BackgroundWrapper= "red"
                style={{ height: 500 }}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSlotSelect}
                selectable={true}
                popup
                resizable
                eventPropGetter={(myEventsList) => {
                  const backgroundColor = myEventsList.colorEvento ? myEventsList.colorEvento : 'lightgray';
                  const color = myEventsList.color ? myEventsList.color : 'white';
                  return { style: { backgroundColor ,color} }

                }}
              /> */}
      {/* Modal for event details 
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <>
              <p>ID: {selectedEvent.id}</p>
              <p>Title: {selectedEvent.title}</p>
              <p>Start: {selectedEvent.start.toString()}</p>
              <p>End: {selectedEvent.end.toString()}</p>
            </>
          ) : (
            <p>No event selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>*/}
  //   </Layout>
    
  // );

  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { isError } = useSelector((state) => state.auth);

  // const [calendarDate, setCalendarDate] = useState(new Date());
  // const [selectedDateType, setSelectedDateType] = useState('estimate_payment_date');
  // const [eventClickedFirst, setEventClickedFirst] = useState(false);
  // const [boxData, setBoxData] = useState([]);
  // const [paradotea, setParadotea] = useState([]);
  // const [erganames, setErgaListNames] = useState([]);
  // const [selectedButton, setSelectedButton] = useState(null);
  // const [prevSelectedButton, setPrevSelectedButton] = useState(null);
  // const [income_paradotea,setIncome_paradotea]=useState([])
  // const [income_ekx,setIncome_ekx]=useState([])
  // const [income_ekx_cust, setIncome_Ekx_Cust] = useState([])
  
  

  // useEffect(() => {
  //   dispatch(getMe());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (isError) {
  //     navigate('/');
  //   }
  // }, [isError, navigate]);

  // useEffect(() => {
  //   getParadotea();
  //   getErgaListNames();
  //   getIncome_paradotea();
  //   getIncome_ekx();
  //   getIncome_ekx_cust_date();
  // }, []);

  // const getParadotea = async () => {
  //   const response = await axios.get(`${apiBaseUrl}/getlistParErgColors`);
  //   setParadotea(response.data);
  // };

  // const getIncome_paradotea=async () =>{
  //   const response = await axios.get(`${apiBaseUrl}/CheckParadotea`);
  //   setIncome_paradotea(response.data);
  //   //console.log(response.data)
  // }
  // const getIncome_ekx=async () =>{
  //   const response = await axios.get(`${apiBaseUrl}/ParadoteaBank_Date`);
  //   setIncome_ekx(response.data);
  //   //console.log(response.data)
  // }

  // const getErgaListNames = async () => {
  //   const response = await axios.get(`${apiBaseUrl}/getlistErgaNames`);
  //   setErgaListNames(response.data);
  // };


  // const getIncome_ekx_cust_date = async () =>
  //   {
  //     const response = await axios.get(`${apiBaseUrl}/ParadoteaCust_Date`);
  //     setIncome_Ekx_Cust(response.data);
  //   }

  // const handleYearChange = (increment) => {
  //   const newDate = new Date(calendarDate);
  //   newDate.setFullYear(calendarDate.getFullYear() + increment);
  //   setCalendarDate(newDate);

  // };

  // const handleDateChange = (newDate) => {
  //   setCalendarDate(newDate);
  // };

  

  // const handleEventClick = (event, item) => {
  //   setEventClickedFirst(true);
  //   setBoxData(item);
  // };

  // const handleEventDrop = async ({ event, start, end }) => {
  //   const updatedDate = moment.utc(start).startOf('day').toDate();
  //   const dateTypeKey = selectedDateType;

  //   try {
  //     console.log(event.item.id)
  //     const response = await axios.patch(`${apiBaseUrl}/paradotea/${event.item.id}`, {
  //       [dateTypeKey]: updatedDate
  //     });
  //     if (response.status === 200) {
  //       setIncome_paradotea((prev) =>
  //         prev.map((item) =>
  //           item.paradotea.id === event.item.id ? { ...item, paradotea: { ...item.paradotea, [dateTypeKey]: updatedDate } } : item
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Failed to update event', error);
  //   }
  // };

  // const handleDateTypeChange = (dateType) => {
  //   setSelectedDateType(dateType);
    
  //   setSelectedButton(dateType);
  // };

  // const getDateBySelectedType = (item) => {
  //   switch (selectedDateType) {
  //     case 'estimate_payment_date_2':
  //       return new Date(item.estimate_payment_date_2);
  //     case 'estimate_payment_date_3':
  //       return new Date(item.estimate_payment_date_3);
  //     default:
  //       return new Date(item.estimate_payment_date);
  //   }
  // };
  // //console.log(income_paradotea)
  // // const MyEvents=paradotea.map((item) => ({
  // //   id: item.ekxorimena_timologia_id,
  // //   title: (
  // //     <div>
  // //       <div
  // //         className="circle"
  // //         style={{
  // //           backgroundColor: item.erga.color,
  // //           boxShadow: '0px 0px 4px 2px ' + item.erga.color,
  // //         }}
  // //       ></div>
  // //       {item.ammount_total} €
  // //     </div>
  // //   ),
  // //   start: getDateBySelectedType(item),
  // //   end: getDateBySelectedType(item),
  // //   item: item,
  // // }));
  // //console.log(MyEvents)

  // const MyEvents=income_paradotea.map((item) => ({
  //     id: item.ekxorimena_timologia_id,
  //     title: (
  //       <div>
  //         <div
  //           className="circle"
  //           style={{
  //             backgroundColor: item.paradotea.erga.color,
  //             boxShadow: '0px 0px 4px 2px ' + item.paradotea.erga.color,
  //           }}
  //         ></div>
  //         {item.paradotea.ammount_total} €
  //       </div>
  //     ),
  //     start: getDateBySelectedType(item.paradotea),
  //     end: getDateBySelectedType(item.paradotea),
  //     item: item.paradotea,
  //   }));
  //   console.log("My Event : ",MyEvents)



  //  const ekx=(income_ekx.map((item) => ({
  //   id: item.ekxorimena_timologia_id,
  //   title: (
  //     <div style = {{backgroundColor: "green"}}>
  //       <div
  //         className="circle"
  //         style={{
  //           backgroundColor: item.paradotea.erga.color,
  //           boxShadow: '0px 0px 4px 2px ' + item.paradotea.erga.color,
  //         }}
  //       ></div>
  //       {/* {console.log(item.Ekxorimena_Timologium.bank_ammount)} */}
  //       {item.Ekxorimena_Timologium.bank_ammount} €
  //     </div>
  //   ),
  //   start: new Date(item.Ekxorimena_Timologium.bank_date),
  //   end: new Date(item.Ekxorimena_Timologium.bank_date),
  //   item: item,
  // })));

  // const ekx_cust=(income_ekx_cust.map((item) => ({
  //   id: item.ekxorimena_timologia_id,
  //   title: (
  //     <div style = {{backgroundColor: "green"}}>
  //       <div
  //         className="circle"
  //         style={{
  //           backgroundColor: item.paradotea.erga.color,
  //           boxShadow: '0px 0px 4px 2px ' + item.paradotea.erga.color,
  //         }}
  //       ></div>
  //       {/* {console.log(item.Ekxorimena_Timologium.customer_ammount)} */}
  //       {item.Ekxorimena_Timologium.customer_ammount} €
  //     </div>
  //   ),
  //   start: new Date(item.Ekxorimena_Timologium.cust_date),
  //   end: new Date(item.Ekxorimena_Timologium.cust_date),
  //   item: item,
  // })));

  // function joinjson(items){
  //   MyEvents.push(items)
  // }

  // const uniqueekx = [
  //   ...ekx
  // ].filter((event, index, self) =>
  //   index === self.findIndex((e) => e.id === event.id)
  // );

  // const uniqueekx_cust = [
  //   ...ekx_cust
  // ].filter((event, index, self) =>
  //   index === self.findIndex((e) => e.id === event.id)
  // );
  // uniqueekx.forEach(joinjson)
  // uniqueekx_cust.forEach(joinjson)

  // // console.log("Ekxkxkxkx",ekx)
  // //console.log(MyEvents)

  

  // const newparat = income_paradotea.map(item => ({
  //   id: item.paradotea.id,
  //   part_number: item.paradotea.part_number,
  //   title: item.paradotea.title,
  //   delivery_date: item.paradotea.delivery_date,
  //   percentage: item.paradotea.percentage,
  //   ammount: item.paradotea.ammount,
  //   ammount_vat: item.paradotea.ammount_vat,
  //   ammount_total: item.paradotea.ammount_total,
  //   estimate_payment_date: item.paradotea.estimate_payment_date,
  //   estimate_payment_date_2: item.paradotea.estimate_payment_date_2,
  //   estimate_payment_date_3: item.paradotea.estimate_payment_date_3,
  //   createdAt: item.paradotea.createdAt,
  //   updatedAt: item.paradotea.updatedAt,
  //   erga_id: item.paradotea.erga_id,
  //   timologia_id: item.paradotea.timologia_id,
  //   erga: {
  //     name: item.paradotea.erga.name,
  //     id: item.paradotea.erga.id,
  //     color: item.paradotea.erga.color
  //   }
  // }));
  
 

  return (
    <Layout>
      <Welcome />
      <Esoda />
      <Eksoda/>
      {/* <h1 className = "Scenario" style = {{textAlign: "center", marginBottom: 20}}>{selectedButton === 'estimate_payment_date' ? 'Best-Case Scenario' :
         selectedButton === 'estimate_payment_date_2' ? 'Medium-Case Scenario' :
         selectedButton === 'estimate_payment_date_3' ? 'Worst-Case Scenario' : ''}</h1>
      <div className="container">
        
        <div className="row">
          <div className="col-md-4">
            <div className="scrollable-list">
              {erganames.map((item, index) => (
                <div key={index} className="list-item">
                  <div
                    className="circle"
                    style={{
                      backgroundColor: item.erga.color,
                      boxShadow: '0px 0px 4px 2px ' + item.erga.color,
                    }}
                  ></div>
                  <h4>{item.erga.name}</h4>
                </div>
              ))}
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
              />
            </div>
          </div>
        </div>
        <div className="row">
          {eventClickedFirst === true && <InfoBox item={boxData} />}
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {uniqueekx.forEach(item => {
  console.log(item.Ekxorimena_Timologium); // Access Ekxorimena_Timologium property for each object
})}
            {income_paradotea.length > 0 && (
  <WeeksTable
    income_paradotea={newparat}
    income_ekx={income_ekx}
    income_ekx_cust={income_ekx_cust}
    selectedDateType={selectedDateType}
    calendarDate={calendarDate}
    onDateChange={handleDateChange}
  />
)}
            {/* <WeeksTable income_paradotea={income_paradotea} selectedDateType={selectedDateType} calendarDate={calendarDate} onDateChange={handleDateChange}/> */}
          {/* </div>
        </div>
      </div>} */}
    </Layout>
  );
  
};

export default Dashboard;
