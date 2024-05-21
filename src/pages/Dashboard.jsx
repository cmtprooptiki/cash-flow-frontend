import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

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

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Dashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getMe());
    // fetchData(); // Fetch data from the database
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

//Kodikas ippo
  //const [events, setEvents] = useState([]);
 
  //const [selectedEvent, setSelectedEvent] = useState(null); // State variable to store selected event
  //const [selectedSlot, setSelectedSlot] = useState(null); // State variable to store selected slot
 
  ///test
  //const [showModal, setShowModal] = useState(false);

  //const [newDate, setNewDate] = useState(null);
 
  const [eventClickedFirst, setEventClickedFirst] = useState(false); // Flag to track if an event was clicked first
  //const [details,setDetails]=useState(false)
  const [box_data,setBoxData]=useState([])

  
  // function details_scene(){
  //   setDetails(true)
  //   setEventClickedFirst(false)
  // }

  
  const handleEventClick = (event,item) => {
    //setSelectedEvent(event); // Store selected event in state variable
    setEventClickedFirst(true); // Set flag indicating event was clicked first
    //setDetails(true)
    console.log(item)
    setBoxData(item)
    console.log(event)
    //test
    //setShowModal(true);
  };
 
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


  const [paradotea, setParadotea] = useState([]);
  const [erganames, setErgaListNames] = useState([]);
  // const [events, setEvents] = useState([]);

  useEffect(()=>{
      getParadotea()
      getErgaListNames()
  },[]);

  const getParadotea = async() =>{
      const response = await axios.get(`${apiBaseUrl}/getlistParErgColors`);
      setParadotea(response.data);

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
  }

  const getErgaListNames = async() =>{
    const response = await axios.get(`${apiBaseUrl}/getlistErgaNames`);
    setErgaListNames(response.data);

    
}
//test
//const handleClose = () => setShowModal(false);

  // Function to fetch data from the database

  const handleEventDrop = async ({ event, start, end }) => {
    const updatedDate = moment.utc(start).startOf('day').toDate();
    try {
      const response = await axios.patch(`${apiBaseUrl}/paradotea/${event.id}`, {
        estimate_payment_date: updatedDate
      });
      if (response.status === 200) {
        setParadotea(prev => prev.map(item =>
          item.id === event.id ? { ...item, estimate_payment_date: updatedDate } : item
        ));
      }
    } catch (error) {
      console.error('Failed to update event', error);
    }
  }

  return (
    <Layout>
      <Welcome />
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="scrollable-list">
            {erganames.map((item, index) => (
              <div key={index} className="list-item">
                <div className="circle" style={{ backgroundColor: item.erga.color ,boxShadow: "0px 0px 4px 2px "+ item.erga.color}}></div>
                <h4>{item.erga.name}</h4>
              </div>
            ))}
            </div>
          </div>
          <div className="col-md-8">
            <div className="calendar-container">
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
                 <DragAndDropCalendar
                localizer={localizer}
                events={paradotea.map(item => ({
                  id: item.id,
                  title: <div><div className="circle" style={{ backgroundColor: item.erga.color,boxShadow: "0px 0px 4px 2px "+ item.erga.color }}></div>{item.ammount_total} €</div>,
                  start: new Date(item.estimate_payment_date),
                  end: new Date(item.estimate_payment_date),
                  item: item // Include the entire item object here

                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onEventDrop={handleEventDrop}
                //onSelectEvent={handleEventClick}
                
                onSelectEvent={(event) => handleEventClick(event, event.item )}
                popup
                resizable
                draggableAccessor={() => true}
              />
            </div>
          </div>
        </div>
        <div className='row'>
        {eventClickedFirst===true  && (<InfoBox item={box_data} />
        
          
        )}
        </div>
      </div>
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
    </Layout>
    
  );
  
};

export default Dashboard;
