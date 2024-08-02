import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';


const FormProfileEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState("");
    const[bank_estimated_date,setEstimated_Bank_Date]=useState("");
    const[bank_date,setBank_Date]=useState("");
    const[customer_ammount,setCustomer_Ammount]=useState("");
    const[cust_estimated_date,setEstimated_Cust_Date]=useState("");
    const[cust_date,setCust_Date]=useState("");

    const[status_bank_paid,setStatusBankPaid]=useState("");
    const[status_customer_paid,setStatusCustomerPaid]=useState("");

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
                const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`);
                setTimologia_Id(response.data.timologia_id);
                setBank_Ammount(response.data.bank_ammount);
                setEstimated_Bank_Date(formatDateToInput(response.data.bank_estimated_date));
                setBank_Date(formatDateToInput(response.data.bank_date));
                setCustomer_Ammount(response.data.customer_ammount);
                setEstimated_Cust_Date(formatDateToInput(response.data.cust_estimated_date));
                setCust_Date(formatDateToInput(response.data.cust_date));
                setStatusCustomerPaid(response.data.status_customer_paid);
                setStatusBankPaid(response.data.status_bank_paid);
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
<div className="surface-0">
  
    <div className="font-medium text-3xl text-900 mb-3">Εκχωριμένο Τιμολόγιο</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
      <div className="text-500 w-6 md:w-2 font-medium">Σύνδεση με Τιμολόγιο:</div>
      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{timologia_id}</div>
           
    </li>
    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />


    <div className="grid">


        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Ημερομηνία πληρωμής απο Τράπεζα</div>
                    {/* <div className="text-600">Plan description</div> */}
                    
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <div className="flex align-items-center">
                      
                     

                        <Calendar value={new Date(bank_date)} inline showWeek />

                    </div>
              
                </div>
            </div>
        </div>

        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Εκτιμώμενη Ημερομηνία πληρωμής απο Τράπεζα</div>
                    {/* <div className="text-600">Plan description</div> */}
                    
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <div className="flex align-items-center">
                      
                     

                        <Calendar value={new Date(bank_estimated_date)} inline showWeek />

                    </div>
              
                </div>
            </div>
        </div>

        </div>

        <div className="grid">


<div className="col-12 lg:col-4">
    <div className="p-3 h-full">
        <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
            <div className="text-900 font-medium text-xl mb-2">Ημερομηνία πληρωμής απο Πελάτη</div>
            {/* <div className="text-600">Plan description</div> */}
            
            <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
            <div className="flex align-items-center">
              
             

            <Calendar value={new Date(cust_date)} inline showWeek />

            </div>
      
        </div>
    </div>
</div>

<div className="col-12 lg:col-4">
    <div className="p-3 h-full">
        <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
            <div className="text-900 font-medium text-xl mb-2">Εκτιμώμενη Ημερομηνία πληρωμής απο Πελάτη</div>
            {/* <div className="text-600">Plan description</div> */}
            
            <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
            <div className="flex align-items-center">
              
             

            <Calendar value={new Date(cust_estimated_date)} inline showWeek />

            </div>
      
        </div>
    </div>
</div>

</div>
   
        

   
        
   

     
    </ul>
</div>
<Divider />

<div className="grid">
  

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό είσπραξης απο Τράπεζα</span>
                    <div className="text-900 font-medium text-xl">{bank_ammount} €</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό Είσπραξης απο πελάτη</span>
                    <div className="text-900 font-medium text-xl">{customer_ammount} €</div>
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
            <div className="text-500 w-6 md:w-2 font-medium">Κατάσταση πληρωμής τράπεζας:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={status_bank_paid} className="mr-2" />
               
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κατάσταση πληρωμής πελάτη:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={status_customer_paid} className="mr-2" />
               
            </div>
          
        </li>

</div>

//         <div>
// 			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossOrigin="anonymous" />
// <div className="container">
//     <div className="row">
//       <div className="col-lg-5 col-md-6">
//         <div className="mb-2 d-flex" style={{zIndex:"10"}}>
//         </div>
//         <div className="mb-2 d-flex">

//         </div>

        
        
//       </div>
//       <div className="col-lg-7 col-md-6 pl-xl-3">
        
//         <div className='box'>
//           <div className="mb-2 d-flex">
//             <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΕΚΧΩΡΗΜΕΝΟ ΤΙΜΟΛΟΓΙΟ</h2>
            
//           </div>
        
//         <div className="mb-2 d-flex">
          
//           <ul className="list-unstyled">
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΤΙΜΟΛΟΓΙΟ ID:  &nbsp;</span><label className="media-body"> {timologia_id}</label>
//             </li>
          
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
//               <label className="media-body"> {bank_ammount}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
//               <label className="media-body"> {bank_estimated_date}</label>
//             </li>
           
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ: &nbsp;</span>
//               <label className="media-body"> {bank_date}</label>
//             </li>


//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΠΕΛΑΤΗ: &nbsp;</span>
//               <label className="media-body"> {customer_ammount}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ: &nbsp;</span>
//               <label className="media-body"> {cust_estimated_date}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ: &nbsp;</span>
//               <label className="media-body"> {cust_date}</label>
//             </li>

//           </ul>
//         </div>
        
       
          

//           </div>
    
//       </div>


      
//     </div>
//   </div>
// 		</div>
    )
}
export default FormProfileEkxorimenoTimologio;