import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';
import Select from 'react-select';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';
import apiBaseFrontUrl from '../../apiFrontConfig';

const FormProfileErgo= () => {
const[logoImage,setLogoImage]=useState(null);
  const[name,setName]=useState("");
  const [color, setColor] = useState("white");
  const[sign_ammount_no_tax,setSignAmmountNoTax]=useState(0.00);
  const[sign_date,setSignDate]=useState("");
  const[status,setStatus]=useState("");
  const[estimate_start_date,setEstimateStartDate]=useState("");
  const[project_manager,setProjectManager]=useState("")
  const[customer_id,setCustomerId]=useState("")
  const[shortname,setShortName]=useState("")
  const[ammount,setAmmount]=useState(0.00)
  const[ammount_vat,setAmmount_Vat]=useState(0.00)
  const[ammount_total,setAmmount_Total]=useState(0.00)
  const[estimate_payment_date,setEstimate_Payment_Date]=useState("")
  const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("")
  const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("")
  const[erga_cat_id,setErga_cat_id]=useState("")

  const[msg,setMsg]=useState("");


  const{id} = useParams();




  useEffect(()=>{
      const getErgoById = async()=>{
        try {
            const response=await axios.get(`${apiBaseUrl}/erga/${id}`);
            setLogoImage(response.data.logoImage);
            setName(response.data.name);
            setColor(response.data.color);
            setSignAmmountNoTax(response.data.sign_ammount_no_tax);
            setSignDate(formatDateToInput(response.data.sign_date));

            setStatus(response.data.status);
            setEstimateStartDate(formatDateToInput(response.data.estimate_start_date));
            setProjectManager(response.data.project_manager);
            setCustomerId(response.data.customer_id);
            setShortName(response.data.shortname)
            setAmmount(response.data.ammount)
            setAmmount_Vat(response.data.ammount_vat)
            setAmmount_Total(response.data.ammount_total)
            setEstimate_Payment_Date(formatDateToInput(response.data.estimate_payment_date))
            setEstimate_Payment_Date_2(formatDateToInput(response.data.estimate_payment_date_2))
            setEstimate_Payment_Date_3(formatDateToInput(response.data.estimate_payment_date_3))
            setErga_cat_id(response.data.erga_cat_id)
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
    getErgoById();
    },[id]);

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


    return (
		<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Έργο</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">

    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Λογότυπο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><img src={`${apiBaseUrl}/${logoImage}`} alt={logoImage} className="w-6rem shadow-2 border-round" /></div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Έργο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{name}</div>
           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ακρώνυμο έργου</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={shortname} className="mr-2" />
               
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κατηγορία Έργου Id: </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><a href= {`${apiBaseFrontUrl}/ergacat/edit/${erga_cat_id}`}>{erga_cat_id}</a></div>
           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Id Πελάτη: </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><a href= {`${apiBaseFrontUrl}/customer/profile/${customer_id}`}>{customer_id}</a></div>
           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Project Manager: </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{project_manager}</div>
           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Χρώμα:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={color} className="mr-2" />
               
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κατάσταση έργου</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={status} className="mr-2" />
               
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Συμβατική αξία (καθαρό ποσό):</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={formatCurrency(sign_ammount_no_tax)} className="mr-2" />
               
            </div>
          
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία Υπογραφής Σύμβασης:</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(sign_date)} inline showWeek />


            </div>

           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία έναρξης (εκτίμηση):</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(estimate_start_date)} inline showWeek />


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
                    <span className="block text-500 font-medium mb-3">Ποσό (καθαρή αξία)</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(ammount)} </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
        
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
            {/* <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span> */}
        </div>
    </div>

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Σύνολο</span>
                    <div className="text-900 font-medium text-xl">{formatCurrency(ammount_total)} </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            {/* <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span> */}
        </div>
    </div>
        </div>
        <Divider />

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία πληρωμής (εκτίμηση):</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(estimate_payment_date)} inline showWeek />


            </div>

           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία πληρωμής (εκτίμηση 2)</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(estimate_payment_date_2)} inline showWeek />


            </div>

           
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία πληρωμής (εκτίμηση 3)</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(estimate_payment_date_3)} inline showWeek />


            </div>

           
        </li>


        </div>
	);

  
}

export default FormProfileErgo;