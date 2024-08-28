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

const FormProfileTimologia = () => {
  const[invoice_date,setInvoice_date]=useState("");
  const[ammount_no_tax,setAmmount_no_tax]=useState("");
  const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
  const[actual_payment_date,setActual_Payment_Date]=useState("");
  const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
  const[comments,setComments]=useState("");
  const[invoice_number,setInvoice_Number]=useState("");
  const [status_paid, setStatus_Paid] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);
  const [erga_id, setErga_id] = useState(null);
  const [erga, setErga] = useState([]);
  const [uniqueErga2, setUniqueErga2] = useState([]); // State to store unique `erga` data


  const [paradotea, setParadoteaByErgo] = useState([]);
  const[fullParadotea,setFullParadotea]=useState([])


    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getTimologioById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/timologia/${id}`);
                setInvoice_date(response.data.invoice_date);
                setAmmount_no_tax(response.data.ammount_no_tax);
                setAmmount_Tax_Incl(response.data.ammount_tax_incl);
                setActual_Payment_Date(response.data.actual_payment_date);
                setAmmount_Of_Income_Tax_Incl(response.data.ammount_of_income_tax_incl);
                setComments(response.data.comments);
                setInvoice_Number(response.data.invoice_number);
                setStatus_Paid(response.data.status_paid);

                const paradoteaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`);
                const paradoteaData = paradoteaResponse.data

                const ergaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`);
                const ergaData = ergaResponse.data;

                setErga(ergaData);
                setSelectedParadoteaDetails(paradoteaData);
                const fullParadoteaResponse = await axios.get(`${apiBaseUrl}/paradotea`);
                setFullParadotea(fullParadoteaResponse.data);

                const itemsWithTimologiaId = fullParadotea.filter(paradoteo => paradoteo.timologia_id === parseInt(id));
                const unselectedParadotea = itemsWithTimologiaId.filter(paradoteo => 
                    !selectedParadoteaDetails.some(selected => selected.id === paradoteo.id)
                );
    
                console.log(unselectedParadotea)
                
    
                // console.log("Done")

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

    const clearFormFields = () => {
        setSelectedOptions([]);
        setSelectedParadoteaDetails([]);
    }

    const handleErgaStart = async(e) => {
        console.log(e)
        const selectedId = e.erga.id;
        setErga_id(selectedId);
        console.log(selectedId)
        clearFormFields();
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${parseInt(e.timologia_id)}`);
                const paradoteaByErgoId = response.data;
                setParadoteaByErgo(paradoteaByErgoId.filter(paradoteo=>paradoteo.erga.id===selectedId))
                // Filter by timologia_id and then map over the filtered array
                console.log(paradoteaByErgoId);
                const selected = paradoteaByErgoId
                .filter(paradoteo => paradoteo.timologia_id === e.timologia_id)
                .map(paradoteo => ({
                    value: paradoteo.id,
                    label: paradoteo.title
                }));

                setSelectedOptions(selected);
                
                

                console.log(selected);
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    };

    const handleParadoteaChange2 = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        console.log("Selected option paradotea CHANGE", selectedOptions)

        const selectedIds = selectedOptions.map(options2 => options2.value);
        const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
        setSelectedParadoteaDetails(selectedDetails);
    };

    const options = paradotea.map(paradoteo => ({
        value: paradoteo.id,
        label: paradoteo.title
    }));
    const options2 = paradotea.map(paradoteo => ({
        value: paradoteo.id,
        label: paradoteo.title
    }));

    useEffect(()=>{
        const selectedIds = selectedOptions.map(option => option.value);
        const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
        setSelectedParadoteaDetails(selectedDetails);
    },[selectedOptions,id])

    useEffect(() => {
        if (erga.length > 0) {
            // Step 1: Filter the rows where timologia_id equals the given id
            const filteredErga = erga.filter(ergo => ergo.timologia_id === parseInt(id));
    
            // Step 2: Create a Set to ensure unique erga names and map the filtered array
            const uniqueErga = Array.from(new Set(filteredErga.map(ergo => ergo.erga.id)))
            .map(id => {      
                return filteredErga.find(ergo => ergo.erga.id === id);
            });
    
            setUniqueErga2(uniqueErga);
            console.log(uniqueErga2)
            
        }
        }, [erga, id]);
    useEffect(()=>{
        if(uniqueErga2.length>0){
            handleErgaStart(uniqueErga2[0]);
        }
    },[uniqueErga2,id])
    // handleErgaStart(uniqueErga2[0]);
        // .map(id2 => {
        //     return erga.find(ergo => (ergo.erga.id === id2 && ergo.timologia_id === id));
        // })
        // .filter(ergo => ergo !== undefined); 


    
    return(


<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Τιμολόγιο</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κωδικός Τιμολογίου</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{invoice_number}</div>
           
        </li>

        <li>
        <div className="field">
                                <label className="label">Παραδοτεα</label>
                                <div className="control">
                                    <Select
                                        isMulti
                                        value={selectedOptions}
                                        onChange={handleParadoteaChange2}
                                        options={options2}
                                        classNamePrefix="react-select"
                                        isDisabled={true}
                                    />
                                </div>
                            </div>
        </li>

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Κατάσταση Τιμολογίου:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={status_paid} className="mr-2" />
               
            </div>
          
        </li>
 

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία Τιμολόγισης</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(invoice_date)} inline showWeek />


            </div>

           
        </li>
   
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία Εξόφλισης</div>
            <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(actual_payment_date)} inline showWeek />


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
                    <span className="block text-500 font-medium mb-3">Ποσό χωρίς Φ.Π.Α.</span>
                    <div className="text-900 font-medium text-xl">{ammount_no_tax} €</div>
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
                    <span className="block text-500 font-medium mb-3">Ποσό με Φ.Π.Α.</span>
                    <div className="text-900 font-medium text-xl">{ammount_tax_incl} €</div>
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
                    <span className="block text-500 font-medium mb-3">Ποσό Είσπραξη με Φ.Π.Α.</span>
                    <div className="text-900 font-medium text-xl">{ammount_of_income_tax_incl} €</div>
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
            <div className="text-500 w-6 md:w-2 font-medium">Παρατηρήσεις</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{comments}</div>
           
        </li>
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
//             <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >ΤΙΜΟΛΟΓΙΟ</h2>
            
//           </div>
        
//         <div className="mb-2 d-flex">
          
//           <ul className="list-unstyled">
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span><label className="media-body"> {invoice_date}</label>
//             </li>
          
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α: &nbsp;</span>
//               <label className="media-body"> {ammount_no_tax}</label>
//             </li>
           
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΜΕ Φ.Π.Α: &nbsp;</span>
//               <label className="media-body"> {ammount_tax_incl}</label>
//             </li>


//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ: &nbsp;</span>
//               <label className="media-body"> {actual_payment_date}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ με Φ.Π.Α: &nbsp;</span>
//               <label className="media-body"> {ammount_of_income_tax_incl}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΑΡΑΤΗΡΗΣΕΙΣ: &nbsp;</span>
//               <label className="media-body"> {comments}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ: &nbsp;</span>
//               <label className="media-body"> {invoice_number}</label>
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

export default FormProfileTimologia;