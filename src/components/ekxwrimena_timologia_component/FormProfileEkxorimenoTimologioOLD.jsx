import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';


const FormProfileEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState("");
    const[bank_estimated_date,setEstimated_Bank_Date]=useState("");
    const[bank_date,setBank_Date]=useState("");
    const[customer_ammount,setCustomer_Ammount]=useState("");
    const[cust_estimated_date,setEstimated_Cust_Date]=useState("");
    const[cust_date,setCust_Date]=useState("");
    const[msg,setMsg]=useState("");
    const{id} = useParams();

    const formatDateToInput = (dateString) => {
      if(dateString === null || dateString =="" || dateString === NaN){
          return ""
      }
      dateString=dateString.split('T')[0];
      const [year, month, day] = dateString.split('-');
      return `${year}-${month}-${day}`;
  };

    useEffect(()=>{
        const getEkxorimenoTimologioById = async() =>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`, {timeout: 5000});
                setTimologia_Id(response.data.timologia_id);
                setBank_Ammount(response.data.bank_ammount);
                setEstimated_Bank_Date(formatDateToInput(response.data.bank_estimated_date));
                setBank_Date(formatDateToInput(response.data.bank_date));
                setCustomer_Ammount(response.data.customer_ammount);
                setEstimated_Cust_Date(formatDateToInput(response.data.cust_estimated_date));
                setCust_Date(formatDateToInput(response.data.cust_date));
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
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossOrigin="anonymous" />
<div className="container">
    <div className="row">
      <div className="col-lg-5 col-md-6">
        <div className="mb-2 d-flex" style={{zIndex:"10"}}>
        </div>
        <div className="mb-2 d-flex">

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
              <span className="w-5 text-black font-weight-normal">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
              <label className="media-body"> {bank_estimated_date}</label>
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
              <span className="w-5 text-black font-weight-normal">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ: &nbsp;</span>
              <label className="media-body"> {cust_estimated_date}</label>
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