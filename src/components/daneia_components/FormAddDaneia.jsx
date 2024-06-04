import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddDaneia = () => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState("");
    const [status, setStatus] = useState("");
    const [payment_date, setPayment_Date] = useState(null)

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const saveDaneia = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/daneia`, {
            name:name,
            ammount:ammount,
            status:status,
            payment_date:payment_date
            });
            navigate("/daneia");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return(
        <div>
        <h1 className='title'>Προσθήκη Δανείου</h1>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveDaneia}>
                <p className='has-text-centered'>{msg}</p>
                <div className="field">
                        <label  className="label">ΤΥΠΟΣ ΔΑΝΕΙΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΤΥΠΟΣ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΔΑΝΕΙΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΔΑΝΕΙΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>


                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ</label>
                        <div className="control">
                            <input type="date" className="input" value={payment_date} onChange={(e)=> setPayment_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ'/>
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

export default FormAddDaneia;