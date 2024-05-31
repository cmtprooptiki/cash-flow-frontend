import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddParadotea = () => {
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState("");
    const[erga_id,setErga_id]=useState("");
    const[timologia_id,setTimologia_id]=useState(null);
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null);
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null);
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null);

    const [percentage_vat, setPercentage_Vat] = useState(0.24); // Default percentage_vat

    const [erga,setErga]=useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const[tempErga,setTempErga]=useState("");
    

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        getErga()
    },[]);

    useEffect(() => {
        // Recalculate VAT whenever the percentage or ammount changes
        const vat = parseFloat(ammount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
    }, [ammount, percentage, percentage_vat]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/erga`);
        console.log(response.data)
        setErga(response.data);
    }
    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setTempErga(selectedId);
        console.log(selectedId)
        setErga_id(selectedId)
    }

    const handleAmmountChange = (e) => {
        const newAmmount = e.target.value;
        setAmmount(newAmmount);
        const vat = parseFloat(newAmmount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(newAmmount) + vat).toFixed(2));
    };

    const handlePercentageChange = (e) => {
        const newPercentage = e.target.value;
        setPercentage_Vat(newPercentage);
        const vat = parseFloat(ammount) * parseFloat(newPercentage);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(ammount) + vat).toFixed(2));
    };

    const saveParadotea = async (e) => {
        e.preventDefault();
        try
        {
            console.log({
                part_number,
                title,
                delivery_date,
                percentage,
                erga_id,
                timologia_id,
                ammount,
                ammount_vat,
                ammount_total,
                estimate_payment_date,
                estimate_payment_date_2,
                estimate_payment_date_3
            });
            await axios.post(`${apiBaseUrl}/paradotea`, {
                part_number:part_number,
                title:title,
                delivery_date:delivery_date,
                percentage:percentage,
                erga_id:erga_id,
                timologia_id:timologia_id,
                ammount:ammount,
                ammount_vat: ammount_vat,
                ammount_total:ammount_total,
                estimate_payment_date: estimate_payment_date,
                estimate_payment_date_2: estimate_payment_date_2,
                estimate_payment_date_3: estimate_payment_date_3
        });

        navigate("/paradotea");
        }
        catch(error)
        {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div>
            <h1 className='title'>Προσθήκη Παραδοτέα</h1>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                    <form onSubmit={saveParadotea}>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field">
                            <label  className="label">ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ</label>
                            <div className="control">
                                <input type="text" className="input" value={part_number} onChange={(e)=> setPart_Number(e.target.value)} placeholder='ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ'/>
                            </div>
                        </div>
                        <div className="field">
                            <label  className="label">ΤΙΤΛΟΣ ΠΑΡΑΔΟΤΕΟΥ</label>
                            <div className="control">
                                <input type="text" className="input" value={title} onChange={(e)=> setTitle(e.target.value)} placeholder='ΤΙΤΛΟΣ ΠΑΡΑΔΟΤΕΟΥ'/>
                            </div>
                        </div>
    
                        <div className="field">
                            <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ</label>
                            <div className="control">
                                <input type="date" className="input" value={delivery_date} onChange={(e)=> setDelivery_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ'/>
                            </div>
                        </div>
                        <div className="field">
                            <label  className="label">ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ</label>
                            <div className="control">
                                <input type="text" className="input" value={percentage} onChange={(e)=> setPercentage(e.target.value)} placeholder='ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ'/>
                            </div>
                        </div>
                        <div className="field">
                        <label className="label">Ποσοστό ΦΠΑ</label>
                                <div className="control">
                                    <input type="text" className="input" value={percentage_vat} onChange={handlePercentageChange} placeholder='Ποσοστό ΦΠΑ' />
                                </div>
                        </div>
                        <div className="field">
                            <label className="label">Εργα</label>
                            <div className="control">
                                <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
                                    <option value="" disabled>Επιλέξτε Εργο</option>
                                        {erga.map((ergo, index) => (
                                            <option key={index} value={ergo.id}>{ergo.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    {/*
                        <div className="field">
                            <label  className="label">ΤΙΜΟΛΟΓΙΑ ID</label>
                            <div className="control">
                                <input type="text" className="input" value={timologia_id} onChange={(e)=> setTimologia_id(e.target.value)} placeholder='ΤΙΜΟΛΟΓΙΑ ID'/>
                            </div>
                        </div>

                    */}

                        <div className="field">
                            <label  className="label">ΑΡΧΙΚΟ ΠΟΣΟ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount} onChange={handleAmmountChange} placeholder='ΑΡΧΙΚΟ ΠΟΣΟ'/>
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">ΠΟΣΟ ΦΠΑ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} readOnly placeholder='ΠΟΣΟ ΦΠΑ'/>
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} readOnly placeholder='ΣΥΝΟΛΙΚΟ ΠΟΣΟ'/>
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

export default FormAddParadotea