import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiBaseUrl from '../../apiConfig';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Knob } from 'primereact/knob';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';

import { Ripple } from 'primereact/ripple';

const FormProfileParadotea=({ id: propId, onHide }) =>{
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState("");
    const[erga_id,setErga_id]=useState("");
    const[erga_name,setErga_name]=useState("");
    const[timologia_id,setTimologia_id]=useState("");
    const[timologia_invoice_number,setTimologia_Invoice_Number]=useState("");
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("");
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("");
    const[comments,setComments]=useState("");


    const[msg,setMsg]=useState("");

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const id = propId !== undefined ? propId : paramId;
    // const{id} = useParams();

    useEffect(()=>{
        const getParadoteaById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/paradotea/${id}`, {timeout: 5000});
                setPart_Number(response.data.part_number);
                setTitle(response.data.title);
                setDelivery_Date(response.data.delivery_date);
                setPercentage(response.data.percentage);
                setErga_id(response.data.erga_id);
                setErga_name(response.data.erga.name);
                setTimologia_id(response.data.timologia_id);
                if(response.data.timologia_id){
                    setTimologia_Invoice_Number(response.data.timologia.invoice_number);
                }else{
                    setTimologia_Invoice_Number(null)
                }
                // setTimologia_Invoice_Number(response.data.timologia.invoice_number);
                setAmmount(response.data.ammount);
                setAmmount_Vat(response.data.ammount_vat);
                setAmmount_Total(response.data.ammount_total);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2);
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3);
                setComments(response.data.comments);
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getParadoteaById();
    },[id]);

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    return(
<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Παραδοτέο</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Τίτλος παραδοτέου</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{title}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ανήκει στο Εργο:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={erga_name} className="mr-2" />
                
            </div>
          
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Σχόλιο:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={comments} className="mr-2" />
                
            </div>
          
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Αριθμός Τιμολογίου:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={timologia_invoice_number ? timologia_invoice_number : 'Δεν έχει κοπεί τιμολόγιο για το συγκεκριμένο παραδοτέο'} className="mr-2"   style={{ color: timologia_invoice_number ? '' : 'red' }}  />
                
            </div>
            
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Παραδοτέο (Αριθμός)</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{part_number}</div>
          
        </li>
        </ul>
        
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία υποβολής</div>
            {/* <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1"> */}

            <Calendar  value={new Date(delivery_date)} inline showWeek />


            {/* </div> */}
     
            <div className="text-500 w-6 md:w-2 font-medium">Εκτιμωμένη Ημερομηνία Πληρωμής</div>

            

            <TabView>
                {estimate_payment_date!=null&&(
                <TabPanel header="Ημερομηνία πληρωμής (εκτίμηση)">
                <Calendar value={new Date(estimate_payment_date)} inline showWeek />
                </TabPanel>
                )}
                {estimate_payment_date_2!=null&&(
                <TabPanel header="Ημερομηνία πληρωμής (εκτίμηση 2)">
                    <Calendar value={new Date(estimate_payment_date_2)} inline showWeek/>
                </TabPanel>
                )}
                {estimate_payment_date_3!=null&&(
                    <TabPanel header="Ημερομηνία πληρωμής (εκτίμηση 3)">
                        <Calendar value={new Date(estimate_payment_date_3)} inline showWeek/>
                    </TabPanel>
                )}
                
            </TabView>           
       
                
        <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ποσοστό σύμβασης</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
            
            <Knob value={percentage}  />

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
                    <span className="block text-500 font-medium mb-3">Ποσό  (καθαρή αξία)</span>
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
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

 

</div>
</div>
      

    );
}

export default FormProfileParadotea;