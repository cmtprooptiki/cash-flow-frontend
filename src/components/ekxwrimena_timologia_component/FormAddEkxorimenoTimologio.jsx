import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState("");
    const[bank_date,setBank_Date]=useState(null);
    const[customer_ammount,setCustomer_Ammount]=useState("");
    const[cust_date,setCust_Date]=useState(null);
    const[msg,setMsg]=useState("");

    const navigate = useNavigate();


    const [timologia,setTimologia]=useState([]);

    useEffect(()=>{
        getTimologia()
    },[]);

    const getTimologia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getTim_From_Income`);
        setTimologia(response.data);
    }

    const handleTimologiaChange = async (e) => {
        const selectedId = e.target.value;
        setTimologia_Id(selectedId);

        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getSumofchosenTim/${selectedId}`);
                const timologio = response.data;

                setBank_Ammount((timologio[0].totalek)*0.8 || ""); // Assuming `bank_ammount` is part of the response data
                setCustomer_Ammount((timologio[0].totalek)*0.2 || "")
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    }




    const saveEkxorimena_Timologia = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/ek_tim`, {
            timologia_id: timologia_id,
            bank_ammount: bank_ammount,
            bank_date: bank_date,
            customer_ammount: customer_ammount,
            cust_date:cust_date
            });
            navigate("/ek_tim");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return(
        <div>
        <h1 className='title'>Προσθήκη Εκχωρημένου Τιμολογίου</h1>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveEkxorimena_Timologia}>
                <p className='has-text-centered'>{msg}</p>

                <div className="field">
                        <label className="label">Τιμολόγιο</label>
                        <div className="control">
                            <select className='input' onChange={handleTimologiaChange} value={timologia_id}>
                                <option value="" disabled selected>Επιλέξτε Τιμολόγιο</option>
                                {timologia.map((timologio, index) => (
                                    <option key={timologio.id} value={timologio.id}>{timologio.invoice_number}</option>
                                ))}
                            </select>
                        </div>
                    </div>





        
                    <div className="field">
                        <label className="label">ΠΟΣΟ ΤΡΑΠΕΖΑΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={bank_ammount} onChange={(e) => setBank_Ammount(e.target.value)} placeholder='ΠΟΣΟ ΤΡΑΠΕΖΑΣ' />
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
                            <input type="text" className="input" value={customer_ammount} onChange={(e)=> setCustomer_Ammount(e.target.value)} placeholder='ΠΟΣΟ ΠΕΛΑΤΗ'/>
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

export default FormAddEkxorimenoTimologio;