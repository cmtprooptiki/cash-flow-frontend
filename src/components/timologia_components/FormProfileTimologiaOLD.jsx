import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';


import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';

const FormProfileTimologia = () => {
  const[invoice_date,setInvoice_date]=useState("");
  const[ammount_no_tax,setAmmount_no_tax]=useState("");
  const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
  const[actual_payment_date,setActual_Payment_Date]=useState("");
  const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
  const[comments,setComments]=useState("");
  const[invoice_number,setInvoice_Number]=useState("");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getTimologioById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/timologia/${id}`, {timeout: 5000});
                setInvoice_date(response.data.invoice_date);
                setAmmount_no_tax(response.data.ammount_no_tax);
                setAmmount_Tax_Incl(response.data.ammount_tax_incl);
                setActual_Payment_Date(response.data.actual_payment_date);
                setAmmount_Of_Income_Tax_Incl(response.data.ammount_of_income_tax_incl);
                setComments(response.data.comments);
                setInvoice_Number(response.data.invoice_number);
            }
            catch(error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getTimologioById();
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΤΙΜΟΛΟΓΙΟ</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span><label className="media-body"> {invoice_date}</label>
            </li>
          
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α: &nbsp;</span>
              <label className="media-body"> {ammount_no_tax}</label>
            </li>
           
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΜΕ Φ.Π.Α: &nbsp;</span>
              <label className="media-body"> {ammount_tax_incl}</label>
            </li>


            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ: &nbsp;</span>
              <label className="media-body"> {actual_payment_date}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ με Φ.Π.Α: &nbsp;</span>
              <label className="media-body"> {ammount_of_income_tax_incl}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΑΡΑΤΗΡΗΣΕΙΣ: &nbsp;</span>
              <label className="media-body"> {comments}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span>
              <label className="media-body"> {invoice_number}</label>
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

export default FormProfileTimologia;