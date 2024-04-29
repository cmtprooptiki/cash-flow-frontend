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
                timologia_id:timologia_id
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
                                <input type="text" className="input" value={delivery_date} onChange={(e)=> setDelivery_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ'/>
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