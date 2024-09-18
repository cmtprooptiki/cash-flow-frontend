import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { SketchPicker } from 'react-color';

import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';


const FormEditErgo= () => {
    const[name,setName]=useState("");
    const [logoImage, setLogoImage] = useState(""); // New state for profile image
    const [previewImage, setPreviewImage] = useState(''); // State for previewing selected image

    const [color, setColor] = useState("#ffffff");
    const[sign_ammount_no_tax,setSignAmmountNoTax]=useState(0);
    const[sign_date,setSignDate]=useState("");
    const[status,setStatus]=useState("");
    const[estimate_start_date,setEstimateStartDate]=useState("");
    const[project_manager,setProjectManager]=useState("")
    const[customer_id,setCustomerId]=useState("")
    const[customer_name,setCustomerName]=useState(null)
    const[shortname,setShortName]=useState("")
    const[ammount,setAmmount]=useState(0)
    const[ammount_vat,setAmmount_Vat]=useState(0)
    const[ammount_total,setAmmount_Total]=useState(0)
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("")
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null)
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null)
    const[erga_cat_id,setErga_cat_id]=useState("")
    const [customer, setCustomers] = useState([]);
    const [erga_cat, setErgo_Cat] = useState([]);
    const[erga_cat_name,setErga_cat_name]=useState(null)
    const[msg,setMsg]=useState("");


    const handleColorChange = (color) => {
        setColor(color.hex);
    };

    const handleCustomerChange = (e) => {
        const selectedid=e.target.value.id
        console.log(selectedid)
        setCustomerId(selectedid);
        const selectedName = e.value;
        setCustomerName(selectedName)
    };
    const handleCategoryChange = async (e) => {
        const selectedId = e.target.value.id;
        const selectedName = e.value;
        setErga_cat_id(selectedId)
        setErga_cat_name(selectedName)
    }

    const handleErgo_Cat = (e) => {
        setErga_cat_id(e.target.value);
    };

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getErgoById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/erga/${id}`);
                setName(response.data.name);
                setColor(response.data.color);
                setSignAmmountNoTax(response.data.sign_ammount_no_tax);
                setSignDate(response.data.sign_date);

                setStatus(response.data.status);
                setEstimateStartDate(response.data.estimate_start_date);
                setProjectManager(response.data.project_manager);
                setCustomerId(response.data.customer_id);
                setShortName(response.data.shortname)
                setAmmount(response.data.ammount)
                setAmmount_Vat(response.data.ammount_vat)
                setAmmount_Total(response.data.ammount_total)
                setEstimate_Payment_Date(response.data.estimate_payment_date)
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2)
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3)
                setErga_cat_id(response.data.erga_cat_id)
                setLogoImage(response.data.logoImage);
                // If profileImage URL is available, set previewImage for immediate display
        if (response.data.logoImage) {
            setPreviewImage(`${apiBaseUrl}/${response.data.logoImage}`); // Construct full image URL
          }
                
                
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getErgoById();

        const getCustomers = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/customer`);
                setCustomers(response.data);
                // setCustomerName(response.data)
                // console.log(response.data)
                // for(let i in response.data){
                //     if(response.data[i].id==customer_id){
                //         setCustomerName(response.data[i])
                        
                //     }
                    
                // }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getCustomers();

        const getErga_Cat = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/ergacat`);
                setErgo_Cat(response.data);
                // setErga_cat_name(response.data)
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getErga_Cat();
        
    }, [id]);

    useEffect(() => {
        // This useEffect is responsible for executing getdropdowns
        // only when the customer data and customer_id are available.
        const getdropdownsCustomer = () => {
          if (customer && customer_id && !customer_name) {
            console.log("customer ",customer)
            console.log("customer id ",customer_id)
            console.log("customer name",customer_name)

            console.log("Executing getdropdowns...");
            const selectedCustomer = customer.find(c => c.id === customer_id );
            if (selectedCustomer) {
                
                setCustomerName(selectedCustomer);
                
              
              console.log("Customer found and set:", selectedCustomer);
            } else {
              console.log("Customer not found");
            }
          }
        };
      
        getdropdownsCustomer();
      }, [customer, customer_id, customer_name]);
      useEffect(() => {
        // This useEffect is responsible for executing getdropdowns
        // only when the customer data and customer_id are available.
        const getdropdownsCat = () => {
           
          if (erga_cat && erga_cat_id && !erga_cat_name) {
            console.log("erga ",erga_cat)
            console.log("erga id",erga_cat_id)
            console.log("erga name",erga_cat_name)

            console.log("Executing getdropdowns...");
            const selectedErga = erga_cat.find(c => c.id === erga_cat_id);
            if (selectedErga) {
                
                setErga_cat_name(selectedErga);
                console.log("hello")
                
              
              console.log("erga found and set:", selectedErga);
            } else {
              console.log("erga not found");
            }
          }
        };
      
        getdropdownsCat();
      }, [erga_cat, erga_cat_id, erga_cat_name]);

    const updateErgo = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/erga/${id}`, {
                logoImage:logoImage,
                name:name,
                color:color,
                sign_ammount_no_tax:sign_ammount_no_tax,
                sign_date:sign_date,
                status:status,
                estimate_start_date:estimate_start_date,
                project_manager:project_manager,
                customer_id:customer_id,
                shortname: shortname,
                ammount: ammount,
                ammount_vat: ammount_vat,
                ammount_total: ammount_total,
                estimate_payment_date: estimate_payment_date,
                estimate_payment_date_2: estimate_payment_date_2,
                estimate_payment_date_3: estimate_payment_date_3,
                erga_cat_id:erga_cat_id
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        
        );

            navigate("/erga");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setLogoImage(selectedFile); // Update state for server-side update
    
        // Preview the selected image immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      };

      const clearDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setEstimate_Payment_Date_2(null); // Clear the calendar date
    };

    const clearDate2 = (e) => {
        e.preventDefault();  // Prevent form submission
        setEstimate_Payment_Date_3(null); // Clear the calendar date
    }




  return (
    <div>
        <h1 className='title'>Διαχείριση Εργων</h1>
        <h2 className='subtitle'>Επεξεργασία Εργου</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateErgo}>
                    <p className='has-text-centered'>{msg}</p>

                    <div className="grid nested-grid">
                        <div className="col-4 card is-shadowless">
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεια Έργου</span></Divider></div>
                        
                            <div className="grid card-content">
                                <div className="field col-6">
                                    <label  className="label">Εργο</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/> */}
                                        <InputText type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ' />
                                    </div>
                                </div>

                                <div className="field">
                 
                 <div className='mt-auto'>
                 {previewImage ? ( // Conditionally render preview image if available
                     <Avatar image={previewImage} shape="circle" size="xlarge" />
                 ) : (
                     logoImage ? ( // Otherwise, if profileImage URL exists, render it directly
                     <Avatar
                         image={`${apiBaseUrl}/${logoImage}`}
                         shape="circle"
                         size="xlarge"
                     />
                     ) : ( // Default placeholder if no image is available
                     <Avatar shape="circle" size="xlarge" icon="pi pi-user" />
                     )
                 )}
                 </div>
                 <label className="label">Λογότυπο</label> {/* New field for profile image */}

                 <div className="control">
                     <input type="file" className="input"  onChange={handleImageChange} accept="image/*" />
                 {/* {console.log(logoImage.name)} */}
                 </div>
             </div>

                                

                                <div className="field col-6">
                                    <label  className="label">Χρώμα</label>
                                    <div className="control">
                                    {/* <SketchPicker color={color} onChange={handleColorChange} /> */}
                                        <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} />
                                    </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label ">Συμβατική αξία (καθαρό ποσό)</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/> */}
                                        <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>

                                    </div>
                                </div>
                                <div className="field col-6">
                                    <label  className="label">Κατάσταση έργου</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/> */}
                                        <InputText type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/>

                                    </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label">Project Μanager</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/> */}
                                        <InputText type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>

                                    </div>
                                </div>

                                <div className="field col-6">
                                <label className="label">Όνομα Πελάτη</label>
                                        <div className="control">
                                            {/* <select className="input" onChange={(e) => handleCustomerChange(e)} defaultValue="">
                                                <option value="" disabled>Επιλέξτε ΠΕΛΑΤΗ</option>
                                                    {customer.map((specific_customer, index) => (
                                                        <option key={index} value={specific_customer.id}>{specific_customer.name}</option>
                                                    ))}
                                            </select> */}
                                            <Dropdown value={customer_name} onChange={(e) => {handleCustomerChange(e)}} options={customer} optionLabel="name" 
                                            placeholder="Επιλέξτε ΠΕΛΑΤΗ" className="w-full md:w-14rem" />
                                        </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label">Ακρώνυμο Έργου</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/> */}
                                        <InputText type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/>

                                    </div>
                                </div>

                                

                                <div className="field col-6 ">
                                    <label className="label" >Κατηγορία Έργου</label>
                                        <div className="control">
                                            {/* <select className="input" onChange={(e) => handleCategoryChange(e)} defaultValue="">
                                                <option value="" disabled>Επιλέξτε Κατηγορία</option>
                                                    {erga_cat.map((ergo_cat, index) => (
                                                        <option key={index} value={ergo_cat.id}>{ergo_cat.name}</option>
                                                    ))}
                                            </select> */}
                                            <Dropdown value={erga_cat_name} onChange={(e) => {handleCategoryChange(e)}} options={erga_cat} optionLabel="name" 
                                            placeholder="Επιλέξτε Κατηγορία" className="w-full md:w-14rem" />
                                        </div>
                                </div>
                                
                                
                                
                               

                            </div>
                        </div>
                        
                        <div className="field col-4">
                            <label  className="label">Ημερομηνία υπογραφής σύμβασης</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={sign_date} onChange={(e)=> setSignDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/> */}
                                <Calendar value={new Date(sign_date)} onChange={(e) => setSignDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                            </div>
                        </div>
                        <div className="field col-4">
                            <label  className="label">Ημερομηνία έναρξης (εκτίμηση)</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={estimate_start_date} onChange={(e)=> setEstimateStartDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/> */}
                                <Calendar value={new Date(estimate_start_date)} onChange={(e) => setEstimateStartDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                            </div>
                        </div>
                        <Divider align="center">
                            <span className="p-tag text-lg">Εκτιμήσεις</span>
                        </Divider>
                        <div className="col-12">
                            <div className="grid">
                                <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση)</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/> */}
                                        <Calendar value={new Date(estimate_payment_date)} onChange={(e) => setEstimate_Payment_Date(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
                                    </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση 2)</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/> */}
                                        <Calendar value={estimate_payment_date_2 ? new Date(estimate_payment_date_2) : null} onChange={(e) => setEstimate_Payment_Date_2(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
                                    </div>
                                    <div className="control">
                            <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση 3)</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/> */}
                                        <Calendar value={estimate_payment_date_3 ? new Date(estimate_payment_date_3) : null} onChange={(e) => setEstimate_Payment_Date_3(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
                                    </div>
                                    <div className="control">
                            <Button label="Clear" onClick={clearDate2} className="p-button-secondary mt-2" type="button"/>
                        </div>
                                </div>
                                
                            </div>
                        </div>
                        <Divider align="center">
                            <span className="p-tag text-lg">Ποσό Πληρωμής</span>
                        </Divider>
                        <div className="field col-4">
                            <label  className="label">Ποσό (καθαρή αξία)</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/> */}
                                <InputNumber className="input" value={ammount} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' />

                            </div>
                        </div>

                        <div className="field col-4">
                            <label  className="label">Ποσό ΦΠΑ</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/> */}
                                <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.value)} placeholder='ΠΟΣΟ ΦΠΑ'/>

                            </div>
                        </div>

                        <div className="field col-4">
                            <label  className="label">Σύνολο</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/> */}
                                <InputNumber className="input" mode="decimal" minFractionDigits={2} value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/>

                            </div>
                        </div>
                       
                        <div className="field col-offset-11">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                            </div>
                        </div>
                    </div>

                 
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormEditErgo