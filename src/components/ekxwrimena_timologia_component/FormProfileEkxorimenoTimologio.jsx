import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import ApexCharts from 'react-apexcharts';

import 'bootstrap/dist/css/bootstrap.min.css';

// import ProfileMap from './ProfileMap';
// import WeatherComponent from './WeatherComponent';
import apiBaseUrl from '../../apiConfig';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import {getLimitAnnotation,getbarcolor,showcol} from '../HelperComponent';
// import ProgressBar from 'react-bootstrap/ProgressBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const FormProfileEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState("");
    const[bank_date,setBank_Date]=useState("");
    const[customer_ammount,setCustomer_Ammount]=useState("");
    const[cust_date,setCust_Date]=useState("");
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

    useEffect(()=>{
        const getEkxorimenoTimologioById = async() =>{
            const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`);
            try
            {
                const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`);
                setTimologia_Id(response.data.timologia_id);
                setBank_Ammount(response.data.bank_ammount);
                setBank_Date(response.data.bank_date);
                setCustomer_Ammount(response.data.customer_ammount);
                setCust_Date(response.data.cust_date);
            }
            catch(error)
            {
                setMsg(error.response.data.msg);
            }
        };
        getEkxorimenoTimologioById();
    },[id]);

    return(
        <div>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossorigin="anonymous" />
<div className="container">
    <div className="row">
      <div className="col-lg-5 col-md-6">
        <div className="mb-2 d-flex" style={{zIndex:"10"}}>
          {/* <img className="w-25" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt=""/> */}
        </div>
        <div className="mb-2 d-flex">
          {/* <img className="w-25" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt=""/> */}

        </div>

        
        
      </div>
      <div className="col-lg-7 col-md-6 pl-xl-3">
        
        <div className='box'>
          <div className="mb-2 d-flex">
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΕΚΧΩΡΗΜΕΝΟ ΤΙΜΟΛΟΓΙΟ</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΤΙΜΟΛΟΓΙΟ ID:  &nbsp;</span><label className="media-body"> {timologia_id}</label>
            </li>
          
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
              <label className="media-body"> {bank_ammount}</label>
            </li>
           
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
              <label className="media-body"> {bank_date}</label>
            </li>


            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΠΕΛΑΤΗ: &nbsp;</span>
              <label className="media-body"> {customer_ammount}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ: &nbsp;</span>
              <label className="media-body"> {cust_date}</label>
            </li>

          </ul>
        </div>
        
       
          

          </div>
    
      </div>


      
    </div>
  </div>
		</div>
    )
}
export default FormProfileEkxorimenoTimologio;