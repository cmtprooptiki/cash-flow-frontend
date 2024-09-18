import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';


import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';
import { Provider } from 'react-redux';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';

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
                const response=await axios.get(`${apiBaseUrl}/ypoquery/${id}`);
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

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return(
<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Υποχρέωση</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Προμηθευτής-έξοδο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{provider}</div>
           
        </li>

 

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία τιμολογίου</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(invoice_date)} inline showWeek />


            </div>

           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ετικέτα:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={tags} className="mr-2" />
                
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ανήκει στο Έργο:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={erga_id ? erga_id : 'Δεν σχετίζεται με καποιο εργο η συγκεκριμένη υποχρέωση'} className="mr-2"   style={{ color: erga_id ? '' : 'red' }}  />
                
            </div>
            
        </li>
   
    

     
    </ul>
</div>
<Divider />

<div className="grid">
  
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Ποσό (σύνολο)</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(total_owed_ammount)} </div>
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
                    <span className="block text-500 font-medium mb-3">Ποσό ΦΠΑ</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(ammount_vat)} </div>
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


</div>


//         <div>
// 			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossorigin="anonymous" />
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
//             <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΥΠΟΧΡΕΩΣΗ</h2>
            
//           </div>
        
//         <div className="mb-2 d-flex">
          
//           <ul className="list-unstyled">
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΑΡΟΧΟΣ: &nbsp;</span><label className="media-body"> {provider}</label>
//             </li>
          
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">Εργο Id: &nbsp;</span>
//               <label className="media-body"> {erga_id}</label>
//             </li>
           
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span>
//               <label className="media-body"> {invoice_date}</label>
//             </li>


//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΥΠΟΧΡΕΩΣΗΣ: &nbsp;</span>
//               <label className="media-body"> {total_owed_ammount}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΦΠΑ: &nbsp;</span>
//               <label className="media-body"> {ammount_vat}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">TAGS: &nbsp;</span>
//               <label className="media-body"> {tags}</label>
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

export default FormProfileYpoxreoseis