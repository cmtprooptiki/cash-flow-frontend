import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';

const FormProfileDoseis = () =>
{
    const [ammount, setAmmount] = useState("");

    const [estimate_payment_date,setEstimate_Payment_Date] = useState("")

    const [status, setStatus] = useState("");

    const [actual_payment_date, setActual_Payment_Date] = useState("")

    const [ypoxreoseis_id,setYpoxreoseis_Id] = useState("")


    const[msg,setMsg]=useState("");


    const{id} = useParams();

    useEffect(()=>{
        const getDoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/doseis/${id}`);
                setAmmount(response.data.ammount);
                setActual_Payment_Date(response.data.actual_payment_date)
                
                setEstimate_Payment_Date(response.data.estimate_payment_date)
                setStatus(response.data.status);
                setYpoxreoseis_Id(response.data.ypoxreoseis_id)
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDoseisById();
    }, [id]);

    return(
        <div>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossorigin="anonymous" />
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΠΡΟΦΙΛ ΔΟΣΗΣ</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΠΟΣΟ ΔΟΣΗΣ: &nbsp;</span><label className="media-body"> {ammount}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ: &nbsp;</span><label className="media-body"> {actual_payment_date}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ : &nbsp;</span><label className="media-body"> {estimate_payment_date}</label>
            </li>
            
            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΚΑΤΑΣΤΑΣΗ ΔΟΣΗΣ: &nbsp;</span><label className="media-body"> {status}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ID ΥΠΟΧΡΕΩΣΕΙΣ : &nbsp;</span><label className="media-body"> {ypoxreoseis_id}</label>
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

export default FormProfileDoseis