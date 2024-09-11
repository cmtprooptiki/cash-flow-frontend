import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const FormEditDoseis = () =>
{
    const[ammount,setAmmount]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null);
    const [actual_payment_date, setActual_Payment_Date] = useState(null);
    const [status,setStatus] = useState("")
    const[ypoxreoseis_id,setYpoxreoseis_Id] = useState("");
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const[msg,setMsg]=useState("");

    const formatDateToInput = (dateString) => {
        if(dateString === null || dateString =="" || dateString === NaN){
            return null
        }
        dateString=dateString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

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
                const response=await axios.get(`${apiBaseUrl}/doseis/${id}`);
                setActual_Payment_Date(formatDateToInput(response.data.actual_payment_date))
                setYpoxreoseis_Id(response.data.ypoxreoseis_id);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
                setEstimate_Payment_Date(formatDateToInput(response.data.estimate_payment_date));
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
                const response = await axios.get(`${apiBaseUrl}/ypo`);
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

    const clearDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setActual_Payment_Date(null); // Clear the calendar date
    };

    return(
        <div>
        <h1 className='title'>Διαχείριση Δόσεων</h1>
        <h2 className='subtitle'>Επεξεργασία Δόσεις</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateDoseis}>
                    <p className='has-text-centered'>{msg}</p>
                
                        <div className="field">
                            <label className="label">ΠΑΡΟΧΟΙ</label>
                            <div className="control">
                                <select className="input" onChange={handleYpoxreoseisChange} value={ypoxreoseis_id}>
                                    <option value= "" disabled>Επιλέξτε ΠΑΡΟΧΟ</option>
                                {ypoxreoseis.map((ypoxreosh, index) => (
                                <option key={index} value={ypoxreosh.id}>{ypoxreosh.provider}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* <div className="field">
                        <label  className="label">ΠΟΣΟ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={bank_ammount} onChange={(e)=> setBank_Ammount(e.target.value)} readOnly placeholder='ΠΟΣΟ ΤΡΑΠΕΖΑΣ'/>
                        </div>
                    </div> */}

                    <div className="field">
                    <label htmlFor="percentage">Ποσό Δόσης</label>
                    <div className="control">

                    <InputNumber  id="ammount" className="input" mode="decimal" minFractionDigits={2} value={ammount}  onChange={(e)=> setAmmount(e.value)}/>
             </div>
                </div>

                    <div className="field">
                    <label htmlFor="estimate_payment_date">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΟΣΗΣ</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={new Date(estimate_payment_date)} onChange={(e)=> setEstimate_Payment_Date(e.target.value)}  inline showWeek />
                    </div>
                
                    </div>

{/* 
                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={bank_estimated_date} onChange={(e)=> setEstimated_Bank_Date(e.target.value)} placeholder='ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ'/>
                        </div>
                    </div> */}

                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΟΣΗΣ</label>
                        <div className="control">
                        <Calendar id="actual_payment_date"  value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)}  inline showWeek />

                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>


                    <div className="field">
                    <label htmlFor="status">Kατάσταση Δόσης</label>
                    <div className="control">

                    <InputText id="status" type="text" value={status} onChange={(e)=> setStatus(e.target.value)} />
                    </div>
                </div>

                    
                    <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                            </div>
                        </div>
                    
                 
                </form>
                </div>
            </div>
        </div>
    </div>
    )

}

export default FormEditDoseis;