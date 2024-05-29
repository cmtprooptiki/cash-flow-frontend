import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { SketchPicker } from 'react-color';


const FormAddErga = () => {
    const[name,setName]=useState("");
    const [color, setColor] = useState("#ffffff");
    const[sign_ammount_no_tax,setSignAmmountNoTax]=useState("");
    const[sign_date,setSignDate]=useState("");
    const[status,setStatus]=useState("");
    const[estimate_start_date,setEstimateStartDate]=useState("");
    const[project_manager,setProjectManager]=useState("")
    const[customer_id,setCustomerId]=useState("")
    const[customer,setCustomer]=useState([])
    const[shortname,setShortName]=useState("")
    const[ammount,setAmmount]=useState("")
    const[ammount_vat,setAmmount_Vat]=useState("")
    const[ammount_total,setAmmount_Total]=useState("")
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("")
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("")
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("")
    const[erga_cat_id,setErga_cat_id]=useState(null)
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
        console.log(response.data)
        setCustomer(response.data);
    }

    const getErga_Cat = async() => 
        {
            const response = await axios.get(`${apiBaseUrl}/ergacat`);
            console.log(response.data)
            setErga_Cat(response.data);
        }

    const handleCustomerChange = async (e) => {
        const selectedId = e.target.value;
        //set(selectedId);
        console.log(selectedId)
        setCustomerId(selectedId)
    }

    const handleCategoryChange = async (e) => {
        const selectedId = e.target.value;
        //set(selectedId);
        console.log(selectedId)
        setErga_cat_id(selectedId)
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
                <div className="field">
                        <label  className="label">ΟΝΟΜΑ ΕΡΓΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΧΡΩΜΑ</label>
                        <div className="control">
                        <SketchPicker color={color} onChange={handleColorChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label"> ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.</label>
                        <div className="control">
                            <input type="text" className="input" value={sign_ammount_no_tax} onChange={(e)=> setSignAmmountNoTax(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={sign_date} onChange={(e)=> setSignDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)</label>
                        <div className="control">
                            <input type="date" className="input" value={estimate_start_date} onChange={(e)=> setEstimateStartDate(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">PROJECT MANAGER</label>
                        <div className="control">
                            <input type="text" className="input" value={project_manager} onChange={(e)=> setProjectManager(e.target.value)} placeholder='PROJECT MANAGER'/>
                        </div>
                    </div>

                    <div className="field">
                    <label className="label">Πελατης</label>
                            <div className="control">
                                <select className="input" onChange={(e) => handleCustomerChange(e)} defaultValue="">
                                    <option value="" disabled>Επιλέξτε ΠΕΛΑΤΗ</option>
                                        {customer.map((specific_customer, index) => (
                                            <option key={index} value={specific_customer.id}>{specific_customer.name}</option>
                                        ))}
                                </select>
                            </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΣΥΝΤΟΜΟΓΡΑΦΙΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={shortname} onChange={(e)=> setShortName(e.target.value)} placeholder='SHORTNAME'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΦΠΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΣΥΝΟΛΙΚΟ</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΠΟΣΟ ΣΥΝΟΛΙΚΟ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1</label>
                        <div className="control">
                            <input type="date" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2</label>
                        <div className="control">
                            <input type="date" className="input" value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3</label>
                        <div className="control">
                            <input type="date" className="input" value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
                        </div>
                    </div>
                    
                    {/* <div className="field">
                        <label  className="label">ID ΚΑΤΗΓΟΡΙΑΣ ΕΡΓΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={erga_cat_id} onChange={(e)=> setErga_cat_id(e.target.value)} placeholder='ID ΚΑΤΗΓΟΡΙΑΣ ΕΡΓΟΥ'/>
                        </div>
                    </div> */}

                    <div className="field">
                        <label className="label">Κατηγορία Έργου</label>
                            <div className="control">
                                <select className="input" onChange={(e) => handleCategoryChange(e)} defaultValue="">
                                    <option value="" disabled>Επιλέξτε Κατηγορία</option>
                                        {erga_cat.map((ergo_cat, index) => (
                                            <option key={index} value={ergo_cat.id}>{ergo_cat.name}</option>
                                        ))}
                                </select>
                            </div>
                    </div>
                    
                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-success is-fullwidth">Προσθήκη</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormAddErga