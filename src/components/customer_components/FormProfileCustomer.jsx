import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import apiBaseUrl from '../../apiConfig';


const FormProfileCustomer= () => {
  const[name,setName]=useState("");
  const[afm,setAfm]=useState("");
  const[phone,setPhone]=useState("");
  const[email,setEmail]=useState("");
  const[address,setAddress]=useState("");
  const[postal_code,setPostalCode]=useState("")

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();




    useEffect(()=>{
      const getCustomerById = async()=>{
        try {
            const response=await axios.get(`${apiBaseUrl}/customer/${id}`);
            setName(response.data.name);
            setAfm(response.data.afm);
            setPhone(response.data.phone);

            setEmail(response.data.email);
            setAddress(response.data.address);
            setPostalCode(response.data.postal_code);
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
    getCustomerById();
    },[id]);



    return (
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
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >{name}</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal">Α.Φ.Μ.: &nbsp;</span><label className="media-body"> {afm}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΤΗΛΕΦΩΝΟ: &nbsp; </span>
              <label className="media-body"> {phone}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">EMAIL: &nbsp;</span>
              <label className="media-body"> {email}</label>
            </li>

            <li className="media">
              <span className="w-5 text-black font-weight-normal">ΔΙΕΥΘΗΝΣΗ: &nbsp;</span>
              <label className="media-body"> {address}</label>
            </li>
            <li className="media">
              <span className="w-5 text-black font-weight-normal">Τ.Κ.: &nbsp;</span>
              <label className="media-body"> {postal_code}</label>
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

export default FormProfileCustomer;