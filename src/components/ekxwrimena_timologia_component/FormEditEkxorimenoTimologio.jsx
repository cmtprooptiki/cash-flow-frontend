import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const FormEditEkxorimenoTimologio = ({ id: propId, onHide }) =>
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
    const [comments, setComments] = useState(null);

    const [timologia, setTimologia] = useState([])
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    // const{id} = useParams();
    const { id: paramId } = useParams();
    const id = propId !== undefined ? propId : paramId;

    const formatDateToInput = (dateString) => {
        console.log("YEEYHAHA: ", dateString)
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
                const response = await axios.get(`${apiBaseUrl}/getSumofchosenTim/${selectedId}`, {timeout: 5000});
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
                const response=await axios.get(`${apiBaseUrl}/ek_tim/${id}`, {timeout: 5000});
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
                setComments(response.data.comments);

            }
            catch(error)
            {
                setMsg(error.response.data.msg);
            }
        };
        getEkxorimenoTimologioById();
        
        const getTimologia = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
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
        const updatedStatusBankPaid = bank_date ? "yes" : "no";
        const updatedStatusCustomerPaid = cust_date ? "yes" : "no";

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
                status_bank_paid:updatedStatusBankPaid,
                status_customer_paid:updatedStatusCustomerPaid,
                comments: comments,

            });
            if(paramId === undefined)
                {
                    onHide();
                    window.location.reload();
                }
                else
                {
                    navigate(-1);
                }

            // navigate("/ek_tim");
        }
        catch(error)
        {
            if(error.response)
            {
                setMsg(error.response.data.msg);
            }
        }
    };

    const clearBankDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setBank_Date(null); // Clear the calendar date
    };

    const clearCustDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setCust_Date(null); // Clear the calendar date
    };

    return(
        <div>
        <h1 className='title'>Διαχείριση Εκχωριμένων Τιμολογίων</h1>
        <h2 className='subtitle'>Επεξεργασία Εκχωριμένων Τιμολογίων</h2>
        <div className="grid">
        <div className="col-12 md:col-6">
            <div className="card p-fluid">
                <div className="content">
                <form onSubmit={UpdateEkxorimenoTimologio}>

                    <p className='has-text-centered'>{msg}</p>
                

                    <div className="field">
                    <label htmlFor="percentage">Εκχώρηση (€)</label>
                    <div className="control">

                    <InputNumber  id="bank_ammount" className="input" mode="decimal" minFractionDigits={2} value={bank_ammount}  onChange={(e)=> setBank_Ammount(e.value)}/>
             </div>
                </div>

                    <div className="field">
                    <label htmlFor="estimate_bank_date">Ημερομηνία πληρωμής από τράπεζα (εκτίμηση)</label>
                    <div className="control">

                    <Calendar id="estimate_bank_date"  value={new Date(bank_estimated_date)} onChange={(e)=> setEstimated_Bank_Date(e.target.value)}  inline showWeek />
                    </div>
                
                    </div>



                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από τράπεζα</label>
                        <div className="control">
                        <Calendar id="bank_date"  value={bank_date ? new Date(bank_date) : null} onChange={(e)=> setBank_Date(e.target.value)}  inline showWeek />

                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearBankDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>

                    <div className="field">
                    <label htmlFor="percentage">Υπόλοιπο από πελάτη (€)</label>
                    <div className="control">

                    <InputNumber  id="customer_ammount" className="input" mode="decimal" minFractionDigits={2} value={customer_ammount}  onChange={(e)=> setCustomer_Ammount(e.value)}/>
             </div>
                </div>
                

                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από πελάτη (εκτίμηση)</label>
                        <div className="control">
                        <Calendar id="cust_estimated_date"  value={new Date(cust_estimated_date)} onChange={(e)=> setEstimated_Cust_Date(e.target.value)}  inline showWeek />

                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από πελάτη</label>
                        <div className="control">
                        <Calendar id="cust_date"  value={cust_date ? new Date(cust_date) : null} onChange={(e)=> setCust_Date(e.target.value)}  inline showWeek />

                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearCustDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>

                    <div className="field">
                                <label className="label">Σχόλια</label>
                                <div className="control">
                                    <InputTextarea value={comments} onChange={(e) => setComments(e.target.value)} />
                                </div>
                            </div>

                {/* <div className="field">
                                <label className="label">Kατάσταση πληρωμής πελάτη</label>
                                <div className="control">
                                    <Dropdown
                                        id="status_customer_paid"
                                        value={status_customer_paid}
                                        options={[
                                            { label: "Πληρωμένο", value: "yes" },
                                            { label: "Απλήρωτο", value: "no" },
                                        ]}
                                        onChange={(e) => setStatusCustomerPaid(e.value)}
                                        placeholder="Επιλέξτε Κατάσταση Πληρωμής απο Πελάτη"
                                    />
                                </div>
                            </div> */}





                {/* <div className="field">
                                <label className="label">Kατάσταση πληρωμής τράπεζας</label>
                                <div className="control">
                                    <Dropdown
                                        id="status_bank_paid"
                                        value={status_bank_paid}
                                        options={[
                                            { label: "Πληρωμένο", value: "yes" },
                                            { label: "Απλήρωτο", value: "no" },
                                        ]}
                                        onChange={(e) => setStatusBankPaid(e.value)}
                                        placeholder="Επιλέξτε Κατάσταση Πληρωμής απο Τράπεζα"
                                    />
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
    </div>
    )

}

export default FormEditEkxorimenoTimologio