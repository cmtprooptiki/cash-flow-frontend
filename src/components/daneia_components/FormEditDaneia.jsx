import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const FormEditDaneia= ({id: propId, onHide}) => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState("");
    const [status, setStatus] = useState("");
    const [payment_date, setPayment_Date] = useState("")
    const [actual_payment_date, setActual_Payment_Date] = useState(null)
    const[msg,setMsg]=useState("");

    const [statuses, setStatuses] = useState(["yes", "no"])

    const navigate = useNavigate();

    // const{id} = useParams();

    const { id: paramId } = useParams();
    const id = propId !== undefined ? propId : paramId;

    const formatDateToInput = (dateString) => {
        if(dateString === null || dateString =="" || dateString === NaN){
            return null
        }
        dateString=dateString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };
    const handleStatusChange = async (e) =>
        {
            const selectedStatus = e.value;
            setStatus(selectedStatus)
        }

    useEffect(()=>{
        const getDaneiaById = async()=>{
            //const response=await axios.get(`${apiBaseUrl}/daneia/${id}`, {timeout: 5000});
            try
            {
                const response=await axios.get(`${apiBaseUrl}/daneia/${id}`, {timeout: 5000});
                setName(response.data.name);
                setAmmount(response.data.ammount);
                setStatus(response.data.status);
                setPayment_Date(formatDateToInput(response.data.payment_date))
                setActual_Payment_Date(formatDateToInput(response.data.actual_payment_date))
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
        const updateStatus = actual_payment_date ? "yes": "no";
        try{
            await axios.patch(`${apiBaseUrl}/daneia/${id}`, {
                name:name,
                ammount:ammount,
                status:updateStatus,
                payment_date:payment_date,
                actual_payment_date:actual_payment_date
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


            // navigate("/daneia");
        }
        catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
                }
        }
    };

    const clearActualDate = (e) => {
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
                <form onSubmit={updateDaneio}>
                    <p className='has-text-centered'>{msg}</p>

                    <div className="field">
                    <label htmlFor="percentage">Ονομα Δανείου</label>
                    <div className="control">

                    <InputText  id="name" className="input"  value={name}  onChange={(e)=> setName(e.value)}/>
             </div>
                </div>
                    <div className="field">
                    <label htmlFor="percentage">Ποσό Δανείου</label>
                    <div className="control">

                    <InputNumber  id="ammount" className="input" mode="decimal" minFractionDigits={2} value={ammount}  onChange={(e)=> setAmmount(e.value)}/>
             </div>
                </div>


                <div className="field">
                    <label htmlFor="estimate_payment_date">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={new Date(payment_date)} onChange={(e)=> setPayment_Date(e.target.value)}  inline showWeek />
                    </div>
                
                </div>
                <div className="field">
                    <label htmlFor="payment_date">ΠΡΑΓΑΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ</label>
                    <div className="control">

                        <Calendar id="payment_date"  value={actual_payment_date ? new Date(actual_payment_date) : null} onChange={(e)=> setActual_Payment_Date(e.target.value)} inline showWeek />
                    </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearActualDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                </div>

                    {/* <div className="field">
                    <label htmlFor="status">Kατάσταση Δανείου</label>
                    <div className="control">

                    <Dropdown value={status} onChange={(e) => handleStatusChange(e)} options={statuses} virtualScrollerOptions={{ itemSize: 38 }} 
                                        placeholder="Επιλέξτε Κατάσταση" className="w-full md:w-14rem" required/>
                    </div>
                </div> */}

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

export default FormEditDaneia