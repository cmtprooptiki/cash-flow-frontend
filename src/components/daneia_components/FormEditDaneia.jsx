import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditDaneia= () => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState("");
    const [status, setStatus] = useState("");
    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getDaneiaById = async()=>{
            const response=await axios.get(`${apiBaseUrl}/daneia/${id}`);
            try
            {
                const response=await axios.get(`${apiBaseUrl}/daneia/${id}`);
                setName(response.data.name);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDaneiaById();
    }, [id]);

    const updateDaneio = async(e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/daneia/${id}`, {
                name:name,
                ammount:ammount,
                status:status,
            });

            navigate("/daneia");
        }
        catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
                }
        }
    };
    return(
        <div>
        <h1 className='title'>Διαχείριση Δανείου</h1>
        <h2 className='subtitle'>Επεξεργασία Δανείου</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateDaneio}>
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

export default FormEditDaneia