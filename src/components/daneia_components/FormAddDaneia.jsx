import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddDaneia = () => {
    const [loan_type, setLoan_Type] = useState("");
    const [timologia_id, setTimologia_Id] = useState("");
    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const saveDaneia = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/daneia`, {
            loan_type:loan_type,
            timologia_id:timologia_id,
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
                            <input type="text" className="input" value={loan_type} onChange={(e)=> setLoan_Type(e.target.value)} placeholder='ΤΥΠΟΣ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΤΙΜΟΛΟΓΙΑ ID</label>
                        <div className="control">
                            <input type="text" className="input" value={timologia_id} onChange={(e)=> setTimologia_Id(e.target.value)} placeholder='ΤΙΜΟΛΟΓΙΑ ID'/>
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