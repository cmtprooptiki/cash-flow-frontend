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

const FormAddDaneia = () => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState(0);
    const [status, setStatus] = useState("no");
    const [payment_date, setPayment_Date] = useState("")
    const [actual_payment_date, setActual_Payment_Date] = useState(null)

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const saveDaneia = async (e) =>{
        e.preventDefault();
        const updatedStatus = actual_payment_date ? "yes" : "no";
        try{
            await axios.post(`${apiBaseUrl}/daneia`, {
            name:name,
            ammount:ammount,
            status:updatedStatus,
            payment_date:payment_date,
            actual_payment_date:actual_payment_date
            });
            navigate("/daneia");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    const clearActualDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setActual_Payment_Date(null); // Clear the calendar date
    };

    const handleAmmountChange = async(e) =>
    {
        console.log(ammount, "Helloo ammount")
        setAmmount(e.value);
    }

    return(
        <div >
        <h1 className='title'>ΠΡΟΣΘΗΚΗ ΔΑΝΕΙΟΥ</h1>
      <form onSubmit={saveDaneia}>
      <div className="grid">
      <div className="col-12 md:col-6">
          <div className="card p-fluid">
          <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Δανείου</span></Divider></div>
          <div className="field">
                  <label htmlFor="name1">ΟΝΟΜΑ ΔΑΝΕΙΟΥ</label>
                  <div className="control">

                  <InputText id="name" type="text" value={name} onChange={(e)=> setName(e.target.value)} />
                  </div>
              </div>

              <div className="field">
                  <label htmlFor="name2">ΠΟΣΟ ΔΑΝΕΙΟΥ</label>
                  <div className="control">

                  <InputNumber  className="input" value={ammount} mode="decimal" minFractionDigits={2} onChange={(e)=> handleAmmountChange(e)} />
                  </div>
              </div>

              <div className="field">
                    <label htmlFor="payment_date">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ</label>
                    <div className="control">

                    <Calendar id="payment_date"  value={payment_date} onChange={(e)=> setPayment_Date(e.target.value)} inline showWeek />
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
                    <label className="label">Status</label>
                    <div className="control">
                    <InputText id="status" type="text" value={status} onChange={(e)=> setStatus(e.target.value)} />

                    </div>
                </div> */}

          </div>
          <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                            </div>
                        </div>
        </div>
        </div>
    </form>
    </div>
    )
}

export default FormAddDaneia;