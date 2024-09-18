import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import { Divider } from 'primereact/divider';

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
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Πελάτης</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Πελάτης</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{name}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">ΑΦΜ:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{afm}</div>

          
        </li>
 

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Τηλέφωνο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{phone}</div>
          
        </li>
  
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Email</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{email}</div>
          
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Διεύθυνση</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{address}</div>
          
        </li>
   
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ταχυδρομικός κωδικός</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{postal_code}</div>
          
        </li>
       
    </ul>
</div>
<Divider />

</div>
	);

  
}

export default FormProfileCustomer;