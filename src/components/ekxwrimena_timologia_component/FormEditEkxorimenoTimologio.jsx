import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState("");
    const[bank_date,setBank_Date]=useState("");
    const[customer_ammount,setCustomer_Ammount]=useState("");
    const[cust_date,setCust_Date]=useState("");
    const [timologia, setTimologia] = useState([])
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

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
                setBank_Date(response.data.bank_date);
                setCustomer_Ammount(response.data.customer_ammount);
                setCust_Date(response.data.cust_date);
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
                bank_date: bank_date,
                customer_ammount: customer_ammount,
                cust_date:cust_date
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
                        <label  className="label">ΤΙΜΟΛΟΓΙΟ ID</label>
                        <div className="control">
                            <input type="text" className="input" value={timologia_id} onChange={(e)=> setTimologia_Id(e.target.value)} placeholder='ΤΙΜΟΛΟΓΙΟ ID'/>
                        </div>
                    </div> */}

                        <div className="field">
                            <label className="label">ΤΙΜΟΛΟΓΙΑ</label>
                            <div className="control">
                                <select className="input" onChange={handleTimologiaChange} value={timologia_id}>
                                    <option value= "" disabled>Επιλέξτε ΤΙΜΟΛΟΓΙΟ</option>
                                {timologia.map((timologio, index) => (
                                <option key={index} value={timologio.id}>{timologio.invoice_number}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={bank_ammount} onChange={(e)=> setBank_Ammount(e.target.value)} readOnly placeholder='ΠΟΣΟ ΤΡΑΠΕΖΑΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={bank_date} onChange={(e)=> setBank_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ'/>
                        </div>
                    </div>


                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΠΕΛΑΤΗ</label>
                        <div className="control">
                            <input type="text" className="input" value={customer_ammount} onChange={(e)=> setCustomer_Ammount(e.target.value)} readOnly placeholder='ΠΟΣΟ ΠΕΛΑΤΗ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
                        <div className="control">
                            <input type="date" className="input" value={cust_date} onChange={(e)=> setCust_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ'/>
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

export default FormEditEkxorimenoTimologio