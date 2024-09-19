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
import WeeksTableEksoda from '../components/WeeksTableEksoda';


// Importing calendar library
import { Calendar, momentLocalizer,DateLocalizer ,DnDCalendar} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Modal, Button } from 'react-bootstrap';

// import InfoBox from '../components/InfoBox';

import WeeksTable from '../components/WeeksTable'; // Import the WeeksTable component
import EksodaInfoBox from '../components/EksodaInfoBox';
import PaidExodaList from '../components/paid_components/PaidExodaList';

import BudgetChart from '../components/paid_components/BudgetChart';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Eksoda = ()=>
{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const [doseis, setDoseis] = useState([])
  const [ypoxreoseis, setYpoxreoseis] = useState([])
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [eventClickedFirst, setEventClickedFirst] = useState(false);
  const [boxData, setBoxData] = useState([]);

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
    getDoseis();
    getYpoxreoseis();
  }, []);

  const getDoseis = async () =>
    {
        const response = await axios.get(`${apiBaseUrl}/doseis`);
        setDoseis(response.data)
    }

    const getYpoxreoseis = async () =>
    {
        const response = await axios.get(`${apiBaseUrl}/ypoquery`);
        setYpoxreoseis(response.data)
    }

    const handleYearChange = (increment) => {
        const newDate = new Date(calendarDate);
        newDate.setFullYear(calendarDate.getFullYear() + increment);
        setCalendarDate(newDate);
    
      };
    
      
    
      const handleEventClick = (event, item) => {
        setEventClickedFirst(true);
        setBoxData(item);
      };

      const handleEventDrop = async ({ event, start, end }) => {
        const updatedDate = moment.utc(start).startOf('day').toDate();
        const dateTypeKey = "estimate_payment_date";
      
        try {
          const response = await axios.patch(`${apiBaseUrl}/doseis/${event.item.id}`, {
            [dateTypeKey]: updatedDate
          });
          if (response.status === 200) {
            setDoseis((prev) =>
              prev.map((item) =>
                item.id === event.item.id ? { ...item, [dateTypeKey]: updatedDate } : item
              )
            );
          }
        } catch (error) {
          console.error('Failed to update event', error);
        }

        if(event_is_dropped){
            set_event_is_dropped(false)
          }else{
            set_event_is_dropped(true)
          }
    }
    
    const filteredoseis =doseis.filter((item)=>item.status==="no");
    //console.log("filtered doseis",filteredoseis)

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
        }else if(event.test==="doseis"){
          var backgroundColor = "#0288d1";
          var color="white";
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


        const MyEvents=filteredoseis.map((item) => ({
            id: item.id,
            title: (
              <div >
                <div
                  className="circle"
                  // style={{
                  //   backgroundColor: "red",
                  //   // boxShadow: '0px 0px 4px 2px ' + item.paradotea.erga.color,
                  // }}
                ></div>
                {Number(item.ammount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
            ),
            start: item.estimate_payment_date,
            end: item.estimate_payment_date,
            item: item,
            allDay: item.allDay,
          }));
   


      


      return (
        <div className="boxclass">
          {/* <h1 className = "Scenario" style = {{textAlign: "center", marginBottom: 20}}>{selectedButton === 'estimate_payment_date' ? 'Best-Case Scenario' :
             selectedButton === 'estimate_payment_date_2' ? 'Medium-Case Scenario' :
             selectedButton === 'estimate_payment_date_3' ? 'Worst-Case Scenario' : ''}</h1> */}

             
          <div className="container">
          <h1 style = {{fontSize: "22px",fontWeight: "bold", textAlign: "left", marginBottom: "25px", marginTop: "25px"}}>Προβλεπόμενα Έξοδα</h1>
            
            <div className="row">
              <div className="col-md-4">
              {eventClickedFirst === true && <EksodaInfoBox item={boxData} />}

                {/* <div className="scrollable-list">
                  {ypoxreoseis.map((item, index) => (
                    <div key={index} className="list-item">
                      <div
                        className="circle"
                        style={{
                       
                        }}
                      ></div>
                      <h4>{item.ypoxreoseis.provider}</h4>
                    </div>
                  ))}
                </div> */}
                
              </div>
              
              <div className="col-md-8">
                <div className="calendar-container">
                  <button className="FiltersYear" style={{ marginRight: 20, marginBottom: 20 }} onClick={() => handleYearChange(-1)}>
                    Previous Year
                  </button>
                  <button className="FiltersYear" style={{ marginBottom: 20 }} onClick={() => handleYearChange(1)}>
                    Next Year
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
              <div class="col-md-12">
                <BudgetChart key={refresh}></BudgetChart>
              </div>
            </div>

          </div>
          
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {/* {MyEvents.forEach(item => {
      console.log(item.Ekxorimena_Timologium); // Access Ekxorimena_Timologium property for each object
    })} */}
                {/* {MyEvents.length > 0 && (
      <WeeksTableEksoda
      eventsWithActualPaymentDate={eventsWithActualPaymentDate}
      eventsWithoutActualPaymentDate={eventsWithoutActualPaymentDate}
        calendarDate={calendarDate}
        onDateChange={handleDateChange}
      />
    )} */}
                {/* <WeeksTable income_paradotea={income_paradotea} selectedDateType={selectedDateType} calendarDate={calendarDate} onDateChange={handleDateChange}/> */}
              </div>
            </div>
          </div>
          
          <PaidExodaList key={refresh}/>
          <br></br>
          </div>
      ); 



}

export default Eksoda;