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
import {format} from 'date-fns';

const FormEditErgo= ({id, onHide}) => {
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
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null)
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null)
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null)
    const[erga_cat_id,setErga_cat_id]=useState("")
    const [customer, setCustomers] = useState([]);
    const [erga_cat, setErgo_Cat] = useState([]);
    const[erga_cat_name,setErga_cat_name]=useState(null)
    const[msg,setMsg]=useState("");
    const [statuses, setStatuses] = useState(['Σχεδίαση', 'Υπογεγραμμένο', 'Ολοκληρωμένο', 'Αποπληρωμένο', 'Ακυρωμένο'])


    const handleColorChange = (color) => {
        setColor(color.hex);
    };

    const handleStatusChange = async (e) =>
        {
            const selectedStatus = e.value;
            setStatus(selectedStatus)
        }

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

    useEffect(()=>{
        const getErgoById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/erga/${id}`, {timeout: 5000});
                setName(response.data.name);
                setColor(response.data.color);
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
                const response = await axios.get(`${apiBaseUrl}/customer`, {timeout: 5000});
                setCustomers(response.data);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getCustomers();

        const getErga_Cat = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/ergacat`, {timeout: 5000});
                setErgo_Cat(response.data);
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
      // Convert dates to UTC format before sending to the server
      
      const formatToUTC = (date) => {
        return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
    };

    const updateErgo = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/erga/${id}`, {
                logoImage:logoImage,
                name:name,
                color:color,
                sign_ammount_no_tax:sign_ammount_no_tax,
                sign_date:formatToUTC(sign_date),
                status:status,
                estimate_start_date:formatToUTC(estimate_start_date),
                project_manager:project_manager,
                customer_id:customer_id,
                shortname: shortname,
                ammount: ammount,
                ammount_vat: ammount_vat,
                ammount_total: ammount_total,
                estimate_payment_date:formatToUTC( estimate_payment_date),
                estimate_payment_date_2: formatToUTC(estimate_payment_date_2),
                estimate_payment_date_3: formatToUTC(estimate_payment_date_3),
                erga_cat_id:erga_cat_id
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        
        );
        onHide();
        window.location.reload();


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

    const HandleAmmountChange = async(e) =>
    {
        setAmmount(e.value);
        setAmmount_Total(ammount_vat + e.value);
    }
    
    const HandleAmmountVatChange = async(e) =>
    {
        setAmmount_Vat(e.value);
        setAmmount_Total(ammount + e.value);
    }




  return (
    <div>
        <h1 className='title'>Διαχείριση Εργων</h1>
        <h2 className='subtitle'>Επεξεργασία Εργου</h2>
                <form onSubmit={updateErgo}>
                    <p className='has-text-centered'>{msg}</p>

                    <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="card p-fluid">
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεια Έργου</span></Divider></div>
                        
                                <div className="field">
                                    <label  className="label">Εργο</label>
                                    <div className="control">
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
                                </div>
                            </div>

                                

                                <div className="field">
                                    <label  className="label">Χρώμα</label>
                                    <div className="control">
                                        <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} />
                                    </div>
                                </div>

                                <div className="field">
                                    <label  className="label">Κατάσταση έργου</label>
                                    <div className="control">
                                        <Dropdown value={status} onChange={(e) => handleStatusChange(e)} options={statuses} virtualScrollerOptions={{ itemSize: 38 }} 
                                        placeholder="Select Status" className="w-full md:w-14rem" required/>

                                    </div>
                                </div>

                                <div className="field">
                                    <label  className="label">Project Μanager</label>
                                    <div className="control">
                                        <InputText type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>

                                    </div>
                                </div>

                                <div className="field">
                                <label className="label">Όνομα Πελάτη</label>
                                        <div className="control">
                                  
                                            <Dropdown value={customer_name} onChange={(e) => {handleCustomerChange(e)}} options={customer} optionLabel="name" 
                                            placeholder="Επιλέξτε ΠΕΛΑΤΗ" className="w-full md:w-14rem" />
                                        </div>
                                </div>

                                <div className="field">
                                    <label  className="label">Ακρώνυμο Έργου</label>
                                    <div className="control">
                                        <InputText type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/>

                                    </div>
                                </div>

                                

                                <div className="field">
                                    <label className="label" >Κατηγορία Έργου</label>
                                        <div className="control">

                                            <Dropdown value={erga_cat_name} onChange={(e) => {handleCategoryChange(e)}} options={erga_cat} optionLabel="name" 
                                            placeholder="Επιλέξτε Κατηγορία" className="w-full md:w-14rem" />
                                        </div>
                                </div>
                                
                                <div className="field">
                                    <label  className="label">Ημερομηνία υπογραφής σύμβασης</label>
                                    <div className="control">
                                        <Calendar value={new Date(sign_date)} onChange={(e) => setSignDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                                    </div>
                                </div>
                                
                                

                            </div>
                        
                        <div className="card p-fluid">
                        <div className=""><Divider><span className="p-tag text-lg">Εκτιμήσεις</span></Divider></div>
                                
                        <div>

                        <div className="field">
                            <label  className="label">Ημερομηνία έναρξης (εκτίμηση)</label>
                            <div className="control">
                                <Calendar value={new Date(estimate_start_date)} onChange={(e) => setEstimateStartDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                            </div>
                        </div>


                        </div>        
                        

                        </div>
                        </div>
                    <div className="col-12 md:col-6">
                    <div className="card p-fluid">
                        <div className=""><Divider align="center"><span className="p-tag text-lg">Ποσό Πληρωμής</span></Divider></div>
                                
                        <div>

                        <div className="field">
                            <label  className="label">Ποσό (καθαρή αξία)</label>
                            <div className="control">
                                <InputNumber className="input" value={ammount} mode="decimal" minFractionDigits={2}  onChange={(e)=> HandleAmmountChange(e)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' />

                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">Ποσό ΦΠΑ</label>
                            <div className="control">
                                <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> HandleAmmountVatChange(e)} placeholder='ΠΟΣΟ ΦΠΑ'/>

                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">Σύνολο</label>
                            <div className="control">
                                <InputNumber className="input" mode="decimal" minFractionDigits={2} value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ' readOnly/>

                            </div>
                        </div>

                        
                       
                        <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                            </div>
                        </div>
                        </div>

                        </div>
                        
                        </div>
                        </div>

                       
                    

                 
                </form>
           
       
    </div>
  )
}

export default FormEditErgo