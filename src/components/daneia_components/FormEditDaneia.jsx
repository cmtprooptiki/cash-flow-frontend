import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditDaneia= () => {
    const [loan_type, setLoan_Type] = useState("");
    const [timologia_id, setTimologia_Id] = useState("");
    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getDaneiaById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/daneia/${id}`);
                setLoan_Type(response.data.loan_type);
                setTimologia_Id(response.timologia_id);
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
                loan_type:loan_type,
                timologia_id:timologia_id
            });

            navigate("/daneia")
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