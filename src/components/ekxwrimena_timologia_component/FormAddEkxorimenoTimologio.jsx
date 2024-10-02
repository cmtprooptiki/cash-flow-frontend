import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';

const FormAddEkxorimenoTimologio = () =>
{
    const[timologia_id,setTimologia_Id]=useState("");
    const[bank_ammount,setBank_Ammount]=useState(0.00);
    const[bank_date,setBank_Date]=useState(null);
    const[bank_estimated_date,setEstimated_Bank_Date]=useState(null);

    const[customer_ammount,setCustomer_Ammount]=useState(0.00);
    const[cust_date,setCust_Date]=useState(null);
    const[cust_estimated_date,setEstimated_Cust_Date]=useState(null);
    const[status_bank_paid,setStatusBankPaid]=useState("no");
    const[status_customer_paid,setStatusCustomerPaid]=useState("no");
    const[comments,setComments]=useState("");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();


    const [timologia,setTimologia]=useState([]);

    useEffect(()=>{
        getTimologia()
    },[]);

    const getTimologia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getTim_From_Income`, {timeout: 5000});
        setTimologia(response.data);
    }

    const handleTimologiaChange = async (e) => {
        const selectedId = e.target.value;
        setTimologia_Id(selectedId);

        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getSumofchosenTim/${selectedId}`, {timeout: 5000});
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
        const updatedStatusBankPaid = bank_date ? "yes" : "no";
        const updatedStatusCustomerPaid = cust_date ? "yes" : "no";
        try{
            await axios.post(`${apiBaseUrl}/ek_tim`, {
            timologia_id: timologia_id,
            bank_ammount: bank_ammount,
            bank_date: bank_date,
            bank_estimated_date:bank_estimated_date,
            customer_ammount: customer_ammount,
            cust_date:cust_date,
            cust_estimated_date:cust_estimated_date,
            status_bank_paid:updatedStatusBankPaid,
            status_customer_paid:updatedStatusCustomerPaid,
            comments: comments,

            });
            navigate("/ek_tim");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

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
        <h1 className='title'>Προσθήκη Εκχωρημένου Τιμολογίου</h1>
                <form onSubmit={saveEkxorimena_Timologia}>
                <div className="grid">
      <div className="col-12 md:col-6">
          <div className="card p-fluid">
          <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Εκχωρημένου Τιμολογίου</span></Divider></div>
                <div className="field">
                        <label className="label">Τιμολόγιο</label>
                        <div className="control">
                            <select className='input' onChange={handleTimologiaChange} value={timologia_id}>
                                <option value="" disabled selected>Επιλέξτε Τιμολόγιο</option>
                                {timologia.filter(item => item.status_paid === "no").map((timologio, index) => (
                                    <option key={timologio.id} value={timologio.id}>{timologio.invoice_number}</option>
                                ))}
                            </select>
                        </div>
                    </div>





        
                    <div className="field">
                        <label className="label">Εκχώρηση (€)</label>
                        <div className="control">
                            {/* <input type="text" className="input" value={bank_ammount} onChange={(e) => setBank_Ammount(e.target.value)} placeholder='ΠΟΣΟ ΤΡΑΠΕΖΑΣ' /> */}
                            <InputNumber  id="bank_ammount" className="input" mode="decimal" minFractionDigits={2} value={bank_ammount}  onChange={(e)=> setBank_Ammount(e.value)}/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από τράπεζα (εκτίμηση)</label>
                        <div className="control">
                            <Calendar id="bank_estimated_date"  value={bank_estimated_date} onChange={(e)=> setEstimated_Bank_Date(e.target.value)} inline showWeek />
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από τράπεζα</label>
                        <div className="control">
                            <Calendar id="bank_date"  value={bank_date ? new Date(bank_date) : null} onChange={(e)=> setBank_Date(e.target.value)} inline showWeek />
                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearBankDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>

               

                    <div className="field">
                        <label  className="label">Υπόλοιπο από πελάτη (€)</label>
                        <div className="control">
                        <InputNumber  id="customer_ammount" className="input" mode="decimal" minFractionDigits={2} value={customer_ammount}  onChange={(e)=> setCustomer_Ammount(e.value)}/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από πελάτη (εκτίμηση)</label>
                        <div className="control">
                            <Calendar id="cust_estimated_date"  value={cust_estimated_date} onChange={(e)=> setEstimated_Cust_Date(e.target.value)} inline showWeek />
                        </div>
                    </div>


                    <div className="field">
                        <label  className="label">Ημερομηνία πληρωμής από πελάτη</label>
                        <div className="control">
                            <Calendar id="cust_date"  value={cust_date ? new Date(cust_date) : null} onChange={(e)=> setCust_Date(e.target.value)} inline showWeek />
                        </div>
                        <div className="control">
                            <Button label="Clear" onClick={clearCustDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                    </div>

                    <div className="field">
                    <label className="label">Σχόλια</label>
                    <div className="control">
                    <InputText id="comments" type="text" value={comments} onChange={(e)=> setComments(e.target.value)} />

                    </div>
                </div>

                    {/* <div className="field">
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
                        <div className="control">
                            <InputText id="status_customer_paid" type="text" value={status_customer_paid} onChange={(e)=> setStatusCustomerPaid(e.target.value)} />
                        </div>
                    </div> */}

                    {/* <div className="field">
    <label className="label">ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</label>
    <div className="control">
        <Dropdown
            id="status_customer_paid"
            value={status_customer_paid}
            options={[
                { label: "Πληρωμένο", value: "yes" },
                { label: "Απλήρωτο", value: "no" },
            ]}
            onChange={(e) => setStatusCustomerPaid(e.value)}
            placeholder="Επιλέξτε Κατάσταση Πληρωμής Πελάτη"
        />
    </div>
</div> */}

              

                    {/* <div className="field">
    <label className="label">ΚΑΤΑΣΤΑΣΗ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</label>
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
                        <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
                </form>
                </div>
                
    )



}

export default FormAddEkxorimenoTimologio;