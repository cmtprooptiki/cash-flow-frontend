import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditDoseis = ()=>
{
    const[ammount,setAmmount]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const [actual_payment_date, setActual_Payment_Date] = useState("");
    const [status,setStatus] = useState("")
    const[ypoxreoseis_id,setYpoxreoseis_Id] = useState("");
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const[msg,setMsg]=useState("");



    const handleYpoxreoseisChange = async (e) => {
        const selectedId = e.target.value;
        setYpoxreoseis_Id(selectedId)
    }

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(() => {
        const getDoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/doseis/${id}`, {timeout: 5000});
                setActual_Payment_Date(response.data.actual_payment_date)
                setYpoxreoseis_Id(response.data.ypoxreoseis_id);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
            }
            catch (error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDoseisById();

        const getYpoxreoseis = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/ypo`, {timeout: 5000});
                setYpoxreoseis(response.data);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getYpoxreoseis();
    }, [id]);

    const updateDoseis = async(e) =>{
        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/doseis/${id}`, {
                ammount:ammount,
                actual_payment_date:actual_payment_date,
                estimate_payment_date: estimate_payment_date,
                status:status,
                ypoxreoseis_id:ypoxreoseis_id

            });

            navigate("/doseis");
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
        <h1 className='title'>Διαχείριση Δόσης</h1>
        <h2 className='subtitle'>Επεξεργασία Δόσεων</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateDoseis}>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΔΟΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount} onChange={(e)=> setAmmount(e.target.value)} placeholder='ΠΟΣΟ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} placeholder='ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΔΑΝΕΙΟΥ'/>
                        </div>
                    </div>


                    <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΔΟΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={status} onChange={(e)=> setStatus(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΔΟΣΗΣ'/>
                        </div>
                    </div>


                    <div className="field">
                            <label className="label">Υποχρεώσεις</label>
                            <div className="control">
                                <select className="input" onChange={(e) => handleYpoxreoseisChange(e)} defaultValue="">
                                    <option value="" disabled>Επιλέξτε Υποχρέωση</option>
                                        {ypoxreoseis.map((ypoxreosh, index) => (
                                            <option key={index} value={ypoxreosh.id}>{ypoxreosh.provider}</option>
                                        ))}
                                </select>
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

export default FormEditDoseis