import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';


const FormProfileDaneia = () => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState("");

    const [status, setStatus] = useState("");

    const [payment_date, setPayment_Date] = useState(null)


    const[msg,setMsg]=useState("");


    const{id} = useParams();

    useEffect(()=>{
        const getDaneioById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/daneia/${id}`);
                setName(response.data.name);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
                setPayment_Date(response.data.payment_date)
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDaneioById();
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΤΥΠΟΣ ΔΑΝΕΙΟΥ: {name}</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΠΟΣΟ ΔΑΝΕΙΟΥ: &nbsp;</span><label className="media-body"> {ammount}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΚΑΤΑΣΤΑΣΗ ΔΑΝΕΙΟΥ: &nbsp;</span><label className="media-body"> {status}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ: &nbsp;</span><label className="media-body"> {payment_date}</label>
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

export default FormProfileDaneia