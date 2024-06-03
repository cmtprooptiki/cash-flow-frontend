import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditParadotea = () => {
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState("");
    const[erga_id,setErga_id]=useState("");
    const[timologia_id,setTimologia_id]=useState("");
    const [percentage_vat, setPercentage_Vat] = useState(0.24); // Default percentage_vat
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("");
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("");

    const [erga, setErga] = useState([])

    const[msg,setMsg]=useState("");

    const handleErgaChange = (e) => {
        setErga_id(e.target.value);
    };

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(() => {
        const getParadoteaById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/paradotea/${id}`);
                setPart_Number(response.data.part_number);
                setTitle(response.data.title);
                setDelivery_Date(response.data.delivery_date);
                setPercentage(response.data.percentage);
                setErga_id(response.data.erga_id);
                setTimologia_id(response.data.timologia_id);
                setAmmount(response.data.ammount);
                setAmmount_Vat(response.data.ammount_vat);
                setAmmount_Total(response.data.ammount_total);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2);
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3);
            }
            catch (error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getParadoteaById();

        const getErga = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/erga`);
                setErga(response.data);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getErga();
    }, [id]);

    useEffect(() => {
        // Recalculate VAT whenever the percentage or ammount changes
        const vat = parseFloat(ammount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
    }, [ammount, percentage, percentage_vat]);

    const handlePercentageChange = (e) => {
        const newPercentage = e.target.value;
        setPercentage_Vat(newPercentage);
        const vat = parseFloat(ammount) * parseFloat(newPercentage);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(ammount) + vat).toFixed(2));
    };

    const handleAmmountChange = (e) => {
        const newAmmount = e.target.value;
        setAmmount(newAmmount);
        const vat = parseFloat(newAmmount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(newAmmount) + vat).toFixed(2));
    };

    const updateParadotea = async(e) =>{
        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/paradotea/${id}`, {
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
    };

    return(
        <div>
        <h1 className='title'>Διαχείριση Παραδοτέων</h1>
        <h2 className='subtitle'>Επεξεργασία Παραδοτέων</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateParadotea}>
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
                        <label className="label">ΕΡΓΟ</label>
                        <div className="control">
                            <select className="input" onChange={handleErgaChange} value={erga_id}>
                                <option value="" disabled>Επιλέξτε ΕΡΓΟ</option>
                                {erga.map((ergo, index) => (
                                <option key={index} value={ergo.id}>{ergo.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                    <div className="field">
                            <label  className="label">ΑΡΧΙΚΟ ΠΟΣΟ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount} onChange= {handleAmmountChange} placeholder='ΑΡΧΙΚΟ ΠΟΣΟ'/>
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
                            <button type="submit" className="button is-success is-fullwidth">Ενημέρωση</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    )
}

export default FormEditParadotea