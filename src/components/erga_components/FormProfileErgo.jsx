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

const FormProfileErgo= () => {
  const[name,setName]=useState("");
  const[sign_ammount_no_tax,setSignAmmountNoTax]=useState("");
  const[sign_date,setSignDate]=useState("");
  const[status,setStatus]=useState("");
  const[estimate_start_date,setEstimateStartDate]=useState("");
  const[project_manager,setProjectManager]=useState("")
  const[customer_id,setCustomerId]=useState("")
  const[shortname,setShortName]=useState("")
  const[ammount,setAmmount]=useState("")
  const[ammount_vat,setAmmount_Vat]=useState("")
  const[ammount_total,setAmmount_Total]=useState("")
  const[estimate_payment_date,setEstimate_Payment_Date]=useState("")
  const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("")
  const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("")


  const[msg,setMsg]=useState("");

  const navigate = useNavigate();

  const{id} = useParams();




  useEffect(()=>{
      const getErgoById = async()=>{
        try {
            const response=await axios.get(`${apiBaseUrl}/erga/${id}`);
            setName(response.data.name);
            setSignAmmountNoTax(response.data.sign_ammount_no_tax);
            setSignDate(response.data.sign_date);

            setStatus(response.data.status);
            setEstimateStartDate(response.data.estimate_start_date);
            setProjectManager(response.data.project_manager);
            setCustomerId(response.data.customer_id);
            setShortName(response.data.shortname)
            setAmmount(response.data.ammount)
            setAmmount_Vat(response.data.ammount_vat)
            setAmmount_Total(response.data.ammount_total)
            setEstimate_Payment_Date(response.data.estimate_payment_date)
            setEstimate_Payment_Date_2(response.data.estimate_payment_date_2)
            setEstimate_Payment_Date_3(response.data.estimate_payment_date_3)
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
    getErgoById();
    },[id]);



    return (
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >{name}</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.: &nbsp;</span><label className="media-body"> {sign_ammount_no_tax}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ: &nbsp; </span>
              <label className="media-body"> {sign_date}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ: &nbsp;</span>
              <label className="media-body"> {status}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση): &nbsp;</span>
              <label className="media-body"> {estimate_start_date}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">PROJECT MANAGER: &nbsp;</span>
              <label className="media-body"> {project_manager}</label>
            </li>
           
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ID ΠΕΛΑΤΗ: &nbsp;</span>
              <label className="media-body"> {customer_id}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΣΥΝΤΟΜΟΠΓΡΑΦΙΑ ΟΝΟΜΑΤΟΣ: &nbsp;</span>
              <label className="media-body"> {shortname}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΑΡΧΙΚΟ ΠΟΣΟ: &nbsp;</span>
              <label className="media-body"> {ammount}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΦΠΑ: &nbsp;</span>
              <label className="media-body"> {ammount_vat}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΣΥΝΟΛΙΚΟ ΠΟΣΟ: &nbsp;</span>
              <label className="media-body"> {ammount_total}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ: &nbsp;</span>
              <label className="media-body"> {estimate_payment_date}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2: &nbsp;</span>
              <label className="media-body"> {estimate_payment_date_2}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3: &nbsp;</span>
              <label className="media-body"> {estimate_payment_date_3}</label>
            </li>
           
          </ul>
        </div>
        
       
          

          </div>
    
      </div>


      
    </div>
  </div>
		</div>
	);

  
}

export default FormProfileErgo;