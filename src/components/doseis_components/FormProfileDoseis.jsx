import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';

const FormProfileDoseis = ({ id: propId, onHide }) =>
{
    const [ammount, setAmmount] = useState("");
    const [estimate_payment_date,setEstimate_Payment_Date] = useState("")
    const [status, setStatus] = useState("");
    const [actual_payment_date, setActual_Payment_Date] = useState("")
    const [ypoxreoseis_id,setYpoxreoseis_Id] = useState("")
    const[msg,setMsg]=useState("");

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const id = propId !== undefined ? propId : paramId;
    // const{id} = useParams();

    useEffect(()=>{
        const getDoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/doseis/${id}`, {timeout: 5000});
                setAmmount(response.data.ammount);
                setActual_Payment_Date(formatDateToInput(response.data.actual_payment_date));
                setEstimate_Payment_Date(formatDateToInput(response.data.estimate_payment_date));
                setStatus(response.data.status);
                setYpoxreoseis_Id(response.data.ypoxreoseis_id);
            }
            catch(error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDoseisById();
    }, [id]);

    const formatDateToInput = (dateString) => {
      if(dateString === null || dateString =="" || dateString === NaN){
          return ""
      }
      dateString=dateString.split('T')[0];
      const [year, month, day] = dateString.split('-');
      return `${year}-${month}-${day}`;
  };



  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
  return(


<div>
<div className="surface-0">
  
    <div className="font-medium text-3xl text-900 mb-3">ΔΟΣΕΙΣ</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
      <div className="text-500 w-6 md:w-2 font-medium">Σύνδεση με Προμηθευτή:</div>
      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{ypoxreoseis_id}</div>
           
    </li>
    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />


    <div className="grid">


        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Εκτιμώμενη ημερομηνία πληρωμής</div>
                    {/* <div className="text-600">Plan description</div> */}
                    
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <div className="flex align-items-center">
                      
                     

                        <Calendar value={new Date(estimate_payment_date)} inline showWeek />

                    </div>
              
                </div>
            </div>
        </div>

        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Πραγματική Ημερομηνία Πληρωμής</div>
                    {/* <div className="text-600">Plan description</div> */}
                    
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <div className="flex align-items-center">
                      
                     

                        <Calendar value={new Date(actual_payment_date)} inline showWeek />

                    </div>
              
                </div>
            </div>
        </div>

        </div>

        <div className="grid">

</div>
   
        
    
   
        
   

     
    </ul>
</div>
<Divider />

<div className="grid">
  

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό Δόσης</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(ammount)} </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>


 

</div>
<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κατάσταση Δόσης</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={status} className="mr-2" />
               
            </div>
          
        </li>

</div>
  )
}

export default FormProfileDoseis;