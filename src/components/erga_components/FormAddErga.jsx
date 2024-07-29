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
        
        
        
        


const FormAddErga = () => {
    const[name,setName]=useState("");
    const [color, setColor] = useState("#ffffff");
    const[sign_ammount_no_tax,setSignAmmountNoTax]=useState("");
    const[sign_date,setSignDate]=useState("");
    const[status,setStatus]=useState("");
    const[estimate_start_date,setEstimateStartDate]=useState("");
    const[project_manager,setProjectManager]=useState("")
    const[customer_id,setCustomerId]=useState("")
    const[customer_name,setCustomerName]=useState(null)
    const[customer,setCustomer]=useState([])
    const[shortname,setShortName]=useState("")
    const[ammount,setAmmount]=useState(null)
    const[ammount_vat,setAmmount_Vat]=useState(null)
    const[ammount_total,setAmmount_Total]=useState(null)
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("")
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("")
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("")
    const[erga_cat_id,setErga_cat_id]=useState(null)
    const[erga_cat_name,setErga_cat_name]=useState(null)
    const[erga_cat,setErga_Cat]=useState([])
    const[msg,setMsg]=useState("");

    const handleColorChange = (color) => {
        setColor(color.hex);
    };

    useEffect(()=>{
        getCustomer()
        getErga_Cat()
    },[]);

    const getCustomer = async() =>{
        const response = await axios.get(`${apiBaseUrl}/customer`);
        setCustomer(response.data);
    }

    const getErga_Cat = async() => 
        {
            const response = await axios.get(`${apiBaseUrl}/ergacat`);
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

    const handleCategoryChange = async (e) => {
        const selectedId = e.target.value.id;
        const selectedName = e.value;
        setErga_cat_id(selectedId)
        setErga_cat_name(selectedName)
    }


    const navigate = useNavigate();

    const saveErgo = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/erga`, {
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
            });
            navigate("/erga");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

  return (
    <div>
        <h1 className='title'>Προσθήκη Έργου</h1>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveErgo}>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="grid nested-grid">
                        <div className="col-4 card is-shadowless">
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεια Έργου</span></Divider></div>
                        
                            <div className="grid card-content">
                                <div className="field col-6">
                                    <label  className="label">ΟΝΟΜΑ ΕΡΓΟΥ</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/> */}
                                        <InputText type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ' />
                                    </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label">ΧΡΩΜΑ</label>
                                    <div className="control">
                                    {/* <SketchPicker color={color} onChange={handleColorChange} /> */}
                                        <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} />
                                    </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label "> ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/> */}
                                        <InputText keyfilter="num" className="input" value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>

                                    </div>
                                </div>
                                <div className="field col-6">
                                    <label  className="label">ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/> */}
                                        <InputText type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/>

                                    </div>
                                </div>

                                <div className="field col-6">
                                    <label  className="label">PROJECT MANAGER</label>
                                    <div className="control">
                                        {/* <input type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/> */}
                                        <InputText type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>

                                    </div>
                                </div>

                                <div className="field col-6">
                                <label className="label">Πελατης</label>
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
                                    <label  className="label">ΣΥΝΤΟΜΟΓΡΑΦΙΑ</label>
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
                            <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={sign_date} onChange={(e)=> setSignDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/> */}
                                <Calendar value={sign_date} onChange={(e) => setSignDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                            </div>
                        </div>
                        <div className="field col-4">
                            <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)</label>
                            <div className="control">
                                {/* <input type="date" className="input" value={estimate_start_date} onChange={(e)=> setEstimateStartDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/> */}
                                <Calendar value={estimate_start_date} onChange={(e) => setEstimateStartDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                            </div>
                        </div>
                        <Divider align="center">
                            <span className="p-tag text-lg">Εκτιμήσεις</span>
                        </Divider>
                        <div className="col-12">
                            <div className="grid">
                                <div className="field col-4">
                                    <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/> */}
                                        <Calendar value={estimate_payment_date} onChange={(e) => setEstimate_Payment_Date(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
                                    </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/> */}
                                        <Calendar value={estimate_payment_date_2} onChange={(e) => setEstimate_Payment_Date_2(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
                                    </div>
                                </div>

                                <div className="field col-4">
                                    <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3</label>
                                    <div className="control">
                                        {/* <input type="date" className="input" value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/> */}
                                        <Calendar value={estimate_payment_date_3} onChange={(e) => setEstimate_Payment_Date_3(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <Divider align="center">
                            <span className="p-tag text-lg">Ποσά Πληρωμής</span>
                        </Divider>
                        <div className="field col-4">
                            <label  className="label">ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/> */}
                                <InputNumber className="input" value={ammount} mode="decimal" minFractionDigits={2} onChange={(e)=> setAmmount(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/>

                            </div>
                        </div>

                        <div className="field col-4">
                            <label  className="label">ΠΟΣΟ ΦΠΑ</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/> */}
                                <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.value)} placeholder='ΠΟΣΟ ΦΠΑ'/>

                            </div>
                        </div>

                        <div className="field col-4">
                            <label  className="label">ΠΟΣΟ ΣΥΝΟΛΙΚΟ</label>
                            <div className="control">
                                {/* <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/> */}
                                <InputNumber className="input" mode="decimal" minFractionDigits={2} value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/>

                            </div>
                        </div>
                       
                        <div className="field col-offset-11">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* <div className="field">
                        <label  className="label">ΟΝΟΜΑ ΕΡΓΟΥ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ' />
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΧΡΩΜΑ</label>
                        <div className="control">
                            <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} />
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label"> ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.</label>
                        <div className="control">
                            <InputText type="text" className="input" value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ</label>
                        <div className="control">
                            <Calendar value={sign_date} onChange={(e) => setSignDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/>

                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)</label>
                        <div className="control">
                            <Calendar value={estimate_start_date} onChange={(e) => setEstimateStartDate(e.target.value)} inline showWeek placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">PROJECT MANAGER</label>
                        <div className="control">
                            <InputText type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>

                        </div>
                    </div>

                    <div className="field">
                    <label className="label">Πελατης</label>
                            <div className="control">
                                
                                <Dropdown value={customer_name} onChange={(e) => {handleCustomerChange(e)}} options={customer} optionLabel="name" 
                                placeholder="Επιλέξτε ΠΕΛΑΤΗ" className="w-full md:w-14rem" />
                            </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΣΥΝΤΟΜΟΓΡΑΦΙΑ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/>

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/>

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΦΠΑ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/>

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΣΥΝΟΛΙΚΟ</label>
                        <div className="control">
                            <InputText type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/>

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1</label>
                        <div className="control">
                            <Calendar value={estimate_payment_date} onChange={(e) => setEstimate_Payment_Date(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2</label>
                        <div className="control">
                            <Calendar value={estimate_payment_date_2} onChange={(e) => setEstimate_Payment_Date_2(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3</label>
                        <div className="control">
                            <Calendar value={estimate_payment_date_3} onChange={(e) => setEstimate_Payment_Date_3(e.target.value)} inline showWeek placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
                        </div>
                    </div>
                    

                    <div className="field">
                        <label className="label">Κατηγορία Έργου</label>
                            <div className="control">
                                
                                <Dropdown value={erga_cat_name} onChange={(e) => {handleCategoryChange(e)}} options={erga_cat} optionLabel="name" 
                                placeholder="Επιλέξτε Κατηγορία" className="w-full md:w-14rem" />
                            </div>
                    </div>
                    
                    <div className="field">
                        <div className="control">
                            <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                        </div>
                    </div> */}
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormAddErga