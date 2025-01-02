import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
const FormEditDoseis = ({ id: propId, onHide }) =>
{
    const[ammount,setAmmount]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null);
    const [actual_payment_date, setActual_Payment_Date] = useState(null);
    const [status,setStatus] = useState("")
    const[ypoxreoseis_id,setYpoxreoseis_Id] = useState("");
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const[msg,setMsg]=useState("");
    const [comment, setComment] = useState(null)

    const [totalOwedAmmount, setTotal_Owed_Ammount] = useState("");
    const [ammountVat, setAmmount_Vat] = useState("");

    const[doseis,setdoseis]=useState([])

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
    const { id: paramId } = useParams();
    const id = propId !== undefined ? propId : paramId;

    useEffect(() => {
        const getDoseisById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/doseis/${id}`, {timeout: 5000});
                setActual_Payment_Date(formatDateToInput(response.data.actual_payment_date))
                setYpoxreoseis_Id(response.data.ypoxreoseis_id);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
                setEstimate_Payment_Date(formatDateToInput(response.data.estimate_payment_date));
                setComment(response.data.comment)
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

    // Convert dates to UTC format before sending to the server
    const formatToUTC = (date) => {
    return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
};


    const updateDoseis = async(e) =>{

        const updatedStatus = actual_payment_date ? "yes" : "no";

        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/doseis/${id}`, {
                ammount:ammount,
                actual_payment_date:formatToUTC(actual_payment_date),
                estimate_payment_date: formatToUTC(estimate_payment_date),
                status:updatedStatus,
                ypoxreoseis_id:ypoxreoseis_id,
                comment: comment
            });
            if(paramId === undefined)
                {
                    onHide();
                    window.location.reload();
                }
                else
                {
                    window.location.reload();

                    navigate(-1);
                }
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
    ////these are used for the limiter of ammount
    useEffect(()=>{
        if(ypoxreoseis_id!=''){
            getdoseis();
            getYpoxreoseisId()
        }
        
    },[ypoxreoseis_id])
    const getdoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/doseis`, {timeout: 5000});
        var doseisData = response.data.filter(item => {
            if(item.ypoxreoseis_id === parseInt(ypoxreoseis_id) && item.id!==parseInt(id)){
                return true
            }
            return false
        })
        setdoseis(doseisData);
    }   
    const getYpoxreoseisId = async()=>{
        const response = await axios.get(`${apiBaseUrl}/ypoquery/${ypoxreoseis_id}`, {timeout: 5000});
        setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
        setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);
    }

    useEffect(() => { console.log("ammount updated ",ammount) }, [ammount])
    const CalculateMax= (event)=>{
        const sumYpo=Number(totalOwedAmmount)+Number(ammountVat)
        var sumdoseis=0
        const keyInputs=event.value
        doseis.map((dosi)=>{
            sumdoseis+=parseFloat(dosi.ammount)

        })
        const total=sumYpo-sumdoseis
        if(keyInputs>total){
            setAmmount(total)
        }else{
            setAmmount(Number(keyInputs))
        }
    }


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
                            <label className="label">Προμηθευτής-έξοδο</label>
                            <div className="control">
                                <select className="input" onChange={handleYpoxreoseisChange} value={ypoxreoseis_id}>
                                    <option value= "" disabled>Επιλέξτε Προμηθευτή</option>
                                {ypoxreoseis.map((ypoxreosh, index) => (
                                <option key={index} value={ypoxreosh.id}>{ypoxreosh.provider}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="field">
                    <label htmlFor="percentage">Ποσό Δόσης</label>
                    <div className="control">
                    <InputNumber id="ammount" className="input" keyfilter="pnum" mode="decimal" minFractionDigits={2}  value={ammount} onChange={(e)=> setAmmount(e.value)} />

             </div>
                </div>

                    <div className="field">
                    <label htmlFor="estimate_payment_date">Εκτιμώμενη ημερομηνία πληρωμής</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={new Date(estimate_payment_date)} onChange={(e)=> setEstimate_Payment_Date(e.target.value)}  inline showWeek />
                    </div>
                
                    </div>

                    <div className="field">
                        <label  className="label">Πραγματική ημερομηνία πληρωμής</label>
                        <div className="control">
                        <Calendar id="actual_payment_date"  value={actual_payment_date ? new Date(actual_payment_date) : null} onChange={(e)=> setActual_Payment_Date(e.target.value)}  inline showWeek />

                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>

                    <div className="field">
                <label  className="label">Comment</label>
                <div className="control">
                    <InputText  id="doy" className="input" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder='' />
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