import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';


import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';
import { Provider } from 'react-redux';

const FormProfileYpoxreoseis = () =>
{
    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[total_owed_ammount,setTotal_Owed_Ammount]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState("");
    const[erga_id,setErga_Id]=useState("");
    const[provider, setProvider]=useState("");

    const [tags,setTags] = useState([])

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getYpoxreoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/ypoquery/${id}`, {timeout: 5000});
                setProvider(response.data.ypoxreoseis.provider)
                setErga_Id(response.data.ypoxreoseis.erga_id)
                setInvoice_date(response.data.ypoxreoseis.invoice_date);
                setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
                setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);
                setTags(response.data.tags)
            }
            catch(error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getYpoxreoseisById();
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΥΠΟΧΡΕΩΣΗ</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΑΡΟΧΟΣ: &nbsp;</span><label className="media-body"> {provider}</label>
            </li>
          
            <li className="media">
              <span className="w-5 text-black font-weight-normal">Εργο Id: &nbsp;</span>
              <label className="media-body"> {erga_id}</label>
            </li>
           
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span>
              <label className="media-body"> {invoice_date}</label>
            </li>


            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΥΠΟΧΡΕΩΣΗΣ: &nbsp;</span>
              <label className="media-body"> {total_owed_ammount}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΦΠΑ: &nbsp;</span>
              <label className="media-body"> {ammount_vat}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">TAGS: &nbsp;</span>
              <label className="media-body"> {tags}</label>
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

export default FormProfileYpoxreoseis