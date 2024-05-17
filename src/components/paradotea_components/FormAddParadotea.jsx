import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddParadotea = () => {
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState("");
    const[erga_id,setErga_id]=useState("");
    const[timologia_id,setTimologia_id]=useState("");
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("");
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("");
    

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const saveParadotea = async (e) => {
        e.preventDefault();
        try
        {
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
                            <label  className="label">ΕΡΓΑ ID</label>
                            <div className="control">
                                <input type="text" className="input" value={erga_id} onChange={(e)=> setErga_id(e.target.value)} placeholder='ΕΡΓΑ ID'/>
                            </div>
                        </div>
    
                        <div className="field">
                            <label  className="label">ΤΙΜΟΛΟΓΙΑ ID</label>
                            <div className="control">
                                <input type="text" className="input" value={timologia_id} onChange={(e)=> setTimologia_id(e.target.value)} placeholder='ΤΙΜΟΛΟΓΙΑ ID'/>
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">ΑΡΧΙΚΟ ΠΟΣΟ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΑΡΧΙΚΟ ΠΟΣΟ'/>
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">ΠΟΣΟ ΦΠΑ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ'/>
                            </div>
                        </div>

                        <div className="field">
                            <label  className="label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</label>
                            <div className="control">
                                <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} placeholder='ΣΥΝΟΛΙΚΟ ΠΟΣΟ'/>
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