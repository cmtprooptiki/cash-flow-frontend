import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { SketchPicker } from 'react-color';

import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
        
import { format } from 'date-fns';

        


const FormAddErga = () => {
    const [logoImage, setLogoImage] = useState(null); // New state for profile image

    const[name,setName]=useState("");
    const [color, setColor] = useState("#ffffff");
    const[sign_ammount_no_tax,setSignAmmountNoTax]=useState(0);
    const[sign_date,setSignDate]=useState("");
    const[status,setStatus]=useState(null);
    const[estimate_start_date,setEstimateStartDate]=useState("");
    const[project_manager,setProjectManager]=useState("")
    const[customer_id,setCustomerId]=useState("")
    const[customer_name,setCustomerName]=useState(null)
    const[customer,setCustomer]=useState([])
    const[shortname,setShortName]=useState("")
    const[ammount,setAmmount]=useState(0)
    const[ammount_vat,setAmmount_Vat]=useState(0)
    const[ammount_total,setAmmount_Total]=useState(0)
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null)
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null)
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null)
    const[erga_cat_id,setErga_cat_id]=useState(null)
    const[erga_cat_name,setErga_cat_name]=useState(null)
    const[erga_cat,setErga_Cat]=useState([])
    const[msg,setMsg]=useState("");
    const [statuses, setStatuses] = useState(['Σχεδίαση', 'Υπογεγραμμένο', 'Ολοκληρωμένο', 'Αποπληρωμένο', 'Ακυρωμένο'])
    

    const handleColorChange = (color) => {
        setColor(color.hex);
    };

    useEffect(()=>{
        getCustomer()
        getErga_Cat()
    },[]);

    const getCustomer = async() =>{
        const response = await axios.get(`${apiBaseUrl}/customer`, {timeout: 5000});
        setCustomer(response.data);
    }

    const getErga_Cat = async() => 
        {
            const response = await axios.get(`${apiBaseUrl}/ergacat`, {timeout: 5000});
            setErga_Cat(response.data);
        }

    const handleCustomerChange = async (e) => {
        const selectedId = e.target.value.id;
        const selectedName = e.value;
        // console.log("selected id: ",selectedId)
        // console.log("selected name: ",selectedName)

        setCustomerId(selectedId)
        setCustomerName(selectedName)
    }

    const handleStatusChange = async (e) =>
    {
        const selectedStatus = e.value;
        setStatus(selectedStatus)
    }

    const handleCategoryChange = async (e) => {
        const selectedId = e.target.value.id;
        const selectedName = e.value;
        setErga_cat_id(selectedId)
        setErga_cat_name(selectedName)
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


    const navigate = useNavigate();


      // Convert dates to UTC format before sending to the server
      const formatToUTC = (date) => {
        return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
    };

    const saveErgo = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/erga`, {
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
            });
            navigate("/erga");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

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
        <h1 className='title'>Προσθήκη Έργου</h1>
        <form onSubmit={saveErgo}>
        <div className="grid">
            <div className="col-12 md:col-6">
                {/* <div className="content">
               
                    <p className='has-text-centered'>{msg}</p> */}
                    <div className="card p-fluid">
                        {/* <div className="col-4 card is-shadowless"> */}
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Έργου</span></Divider></div>
                        
                            {/* <div className="grid card-content"> */}
                                <div className="field">
                                    <label  className="label">Έργο</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/> */}
                                        <InputText type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'  />
                                    </div>
                                </div>

                                <div className="field">
                                <label className="label">Λογότυπο Έργου</label> {/* New field for profile image */}
                                <div className="control">
                                    <input type="file" className="input" onChange={(e) => setLogoImage(e.target.files[0])} accept="image/*" />
                                </div>
                            

                                <div className="field">
                                    <label  className="label">Χρώμα</label>
                                    <div className="control">
                                    {/* <SketchPicker color={color} onChange={handleColorChange} /> */}
                                        <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} />
                                    </div>
                                </div>

                                {/* <div className="field col-6">
                                    <label  className="label ">Συμβατική αξία (καθαρό ποσό)</label>
                                    <div className="control">
                                        <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>

                                    </div>
                                </div> */}
                                <div className="field">
                                    <label  className="label">Κατάσταση έργου</label>
                                    <div className="control">
                                        
                                        {/* <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/> */}
                                        <Dropdown value={status} onChange={(e) => handleStatusChange(e)} options={statuses} virtualScrollerOptions={{ itemSize: 38 }} 
                                        placeholder="Επιλέξτε Κατάσταση" className="w-full md:w-14rem" required/>

                                    </div>
                                </div>

                                <div className="field">
                                    <label  className="label">Project Μanager</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/> */}
                                        <InputText type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>

                                    </div>
                                </div>

                                <div className="field">
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

                                <div className="field">
                                    <label  className="label">Ακρώνυμο Έργου</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/> */}
                                        <InputText type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/>

                                    </div>
                                </div>

                                

                                <div className="field">
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

                        <div className="card p-fluid">
                    <div className=""><Divider><span className="p-tag text-lg">Ημερομηνίες</span></Divider></div>
                <div className="formgrid grid">
                        
                        <div className="field col-12 md:col-8">
                            <label  className="label">Ημερομηνία υπογραφής σύμβασης</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={sign_date} onChange={(e)=> setSignDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/> */}
                                <Calendar value={sign_date} onChange={(e) => setSignDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                            </div>
                        </div>
                        <div className="field col-12 md:col-8">
                            <label  className="label">Ημερομηνία έναρξης (εκτίμηση)</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={estimate_start_date} onChange={(e)=> setEstimateStartDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/> */}
                                <Calendar value={estimate_start_date} onChange={(e) => setEstimateStartDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div>  
                        {/* <Divider align="center">
                            <span className="p-tag text-lg">Εκτιμήσεις</span>
                        </Divider> */}
                        <div className="col-12 md:col-6">
                            <div className="card p-fluid">
                                {/* <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση)</label>
                                    <div className="control">
                                        <Calendar value={estimate_payment_date} onChange={(e) => setEstimate_Payment_Date(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
                                    </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση 2)</label>
                                    <div className="control">
                                        <Calendar value={estimate_payment_date_2} onChange={(e) => setEstimate_Payment_Date_2(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
                                    </div>
                                    <div className="control">
                            <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">Ημερομηνία πληρωμής (εκτίμηση 3)</label>
                                    <div className="control">
                                        <Calendar value={estimate_payment_date_3} onChange={(e) => setEstimate_Payment_Date_3(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
                                    </div>
                                    <div className="control">
                            <Button label="Clear" onClick={clearDate2} className="p-button-secondary mt-2" type="button"/>
                        </div>
                                </div> */}
                                
                                
                        <Divider align="center">
                            <span className="p-tag text-lg">Ποσό Πληρωμής</span>
                        </Divider>
                        <div>
                        <div className="field">
                            <label  className="label">Ποσό  (καθαρή αξία)</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/> */}
                                {/* <InputNumber className="input" value={ammount} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' /> */}
                                <InputNumber className="input" value={ammount} mode="decimal" minFractionDigits={2}  onChange={(e)=> HandleAmmountChange(e)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' />
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">Ποσό ΦΠΑ</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/> */}
                                <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> HandleAmmountVatChange(e)} placeholder='ΠΟΣΟ ΦΠΑ'/>

                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">Σύνολο</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/> */}
                                <InputNumber className="input" mode="decimal" minFractionDigits={2} value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ' readOnly/>

                            </div>
                        </div>
                       
                        <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                            </div>
                        </div>
                    {/* </div> */}
                    
                    </div>
                    </div>
                    </div>
                
          
        </div>
        </form>
    </div>
  )
}

export default FormAddErga