import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const FormEditEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState(0);
    const[bank_date,setBank_Date]=useState(null);
    const[bank_estimated_date,setEstimated_Bank_Date]=useState(null);

    const[customer_ammount,setCustomer_Ammount]=useState(0);
    const[cust_date,setCust_Date]=useState(null);
    const[cust_estimated_date,setEstimated_Cust_Date]=useState(null);
    const[status_bank_paid,setStatusBankPaid]=useState("");
    const[status_customer_paid,setStatusCustomerPaid]=useState("");

    const [timologia, setTimologia] = useState([])
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

    const formatDateToInput = (dateString) => {
        if(dateString === null || dateString =="" || dateString === NaN){
            return null
        }
        dateString=dateString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const handleTimologiaChange = async (e) => {
        const selectedId = e.target.value;
        setTimologia_Id(selectedId);

        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getSumofchosenTim/${selectedId}`);
                const timologio = response.data;
                console.log(timologio)

                setBank_Ammount((timologio[0].totalek)*0.8 || ""); // Assuming `bank_ammount` is part of the response data
                setCustomer_Ammount((timologio[0].totalek)*0.2 || "")
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    };

    useEffect(()=>{
        const getEkxorimenoTimologioById = async() =>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`);
                setTimologia_Id(response.data.timologia_id);
                setBank_Ammount(response.data.bank_ammount);
                setEstimated_Bank_Date(formatDateToInput(response.data.bank_estimated_date));
                // var bank_est=formatDateToInput(response.data.bank_estimated_date);
                // bank_est=formatDateToDisplay(bank_est);
                //setEstimated_Bank_Date(bank_est);
                setBank_Date(formatDateToInput(response.data.bank_date));
                setCustomer_Ammount(response.data.customer_ammount);
                setEstimated_Cust_Date(formatDateToInput(response.data.cust_estimated_date));
                setCust_Date(formatDateToInput(response.data.cust_date));
                setStatusCustomerPaid(response.data.status_customer_paid);
                setStatusBankPaid(response.data.status_bank_paid);

            }
            catch(error)
            {
                setMsg(error.response.data.msg);
            }
        };
        getEkxorimenoTimologioById();
        
        const getTimologia = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/timologia`);
                setTimologia(response.data);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getTimologia();
    }, [id]);


    const UpdateEkxorimenoTimologio = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/ek_tim/${id}`, {
                timologia_id: timologia_id,
                bank_ammount: bank_ammount,
                bank_estimated_date:bank_estimated_date,
                bank_date: bank_date,
                customer_ammount: customer_ammount,
                cust_estimated_date:cust_estimated_date,
                cust_date:cust_date,
                status_bank_paid:status_bank_paid,
                status_customer_paid:status_customer_paid
            });

            navigate("/ek_tim");
        }
        catch(error)
        {
            if(error.response)
            {
                setMsg(error.response.data.msg);
            }
        }
    };

    return(
        <div>
        <h1 className='title'>Διαχείριση Εκχωριμένων Τιμολογίων</h1>
        <h2 className='subtitle'>Επεξεργασία Εκχωριμένων Τιμολογίων</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={UpdateEkxorimenoTimologio}>
                    <p className='has-text-centered'>{msg}</p>
                
                        {/* <div className="field">
                            <label className="label">ΤΙΜΟΛΟΓΙΑ</label>
                            <div className="control">
                                <select className="input" onChange={handleTimologiaChange} value={timologia_id}>
                                    <option value= "" disabled>Επιλέξτε ΤΙΜΟΛΟΓΙΟ</option>
                                {timologia.map((timologio, index) => (
                                <option key={index} value={timologio.id}>{timologio.invoice_number}</option>
                                ))}
                            </select>
                        </div>
                    </div> */}


                    {/* <div className="field">
                        <label  className="label">ΠΟΣΟ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={bank_ammount} onChange={(e)=> setBank_Ammount(e.target.value)} readOnly placeholder='ΠΟΣΟ ΤΡΑΠΕΖΑΣ'/>
                        </div>
                    </div> */}

                    <div className="field">
                    <label htmlFor="percentage">Ποσό Τράπεζας</label>
                    <div className="control">

                    <InputNumber  id="bank_ammount" className="input" mode="decimal" minFractionDigits={2} value={bank_ammount}  onChange={(e)=> setBank_Ammount(e.value)}/>
             </div>
                </div>

                    <div className="field">
                    <label htmlFor="estimate_bank_date">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
                    <div className="control">

                    <Calendar id="estimate_bank_date"  value={new Date(bank_estimated_date)} onChange={(e)=> setEstimated_Bank_Date(e.target.value)}  inline showWeek />
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
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                        <Calendar id="bank_date"  value={new Date(bank_date)} onChange={(e)=> setBank_Date(e.target.value)}  inline showWeek />

                        </div>
                    </div>

                    <div className="field">
                    <label htmlFor="percentage">Ποσό Πελάτη</label>
                    <div className="control">

                    <InputNumber  id="customer_ammount" className="input" mode="decimal" minFractionDigits={2} value={customer_ammount}  onChange={(e)=> setCustomer_Ammount(e.value)}/>
             </div>
                </div>
                    {/* <div className="field">
                        <label  className="label">ΠΟΣΟ ΠΕΛΑΤΗ</label>
                        <div className="control">
                            <input type="text" className="input" value={customer_ammount} onChange={(e)=> setCustomer_Ammount(e.target.value)} readOnly placeholder='ΠΟΣΟ ΠΕΛΑΤΗ'/>
                        </div>
                    </div> */}


                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
                        <div className="control">
                        <Calendar id="cust_estimated_date"  value={new Date(cust_estimated_date)} onChange={(e)=> setEstimated_Cust_Date(e.target.value)}  inline showWeek />

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
                        <div className="control">
                        <Calendar id="cust_date"  value={new Date(cust_date)} onChange={(e)=> setCust_Date(e.target.value)}  inline showWeek />

                        </div>
                    </div>

                    <div className="field">
                    <label htmlFor="status_customer_paid">Kατάσταση πληρωμής πελάτη</label>
                    <div className="control">

                    <InputText id="status_customer_paid" type="text" value={status_customer_paid} onChange={(e)=> setStatusCustomerPaid(e.target.value)} />
                    </div>
                </div>

                    {/* <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
                        <div className="control">
                            <input type="text" className="input" value={status_customer_paid} onChange={(e)=> setStatusCustomerPaid(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ'/>
                        </div>
                    </div> */}

                    <div className="field">
                    <label htmlFor="status_customer_paid">Kατάσταση πληρωμής τράπεζας</label>
                    <div className="control">

                    <InputText id="status_bank_paid" type="text" value={status_bank_paid} onChange={(e)=> setStatusBankPaid(e.target.value)} />
                    </div>
                </div>
                    
                    {/* <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={status_bank_paid} onChange={(e)=> setStatusBankPaid(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ'/>
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

export default FormEditEkxorimenoTimologio