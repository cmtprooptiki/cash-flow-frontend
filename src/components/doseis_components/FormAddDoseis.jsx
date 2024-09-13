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

const FormAddDoseis = () => {
    const [ammount, setAmmount] = useState("");
    const [actual_payment_date,setActual_Payment_Date] = useState(null)
    const [estimate_payment_date, setEstimate_Payment_Date] = useState("")
    const [status,setStatus] = useState("no")
    const [ypoxreoseis_id,setYpoxreoseisId] = useState("")

    const [totalOwedAmmount, setTotal_Owed_Ammount] = useState("");
    const [ammountVat, setAmmount_Vat] = useState("");


    const [ypoxreoseis,setYpoxreoseis]=useState([]);

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        getYpoxreoseis()
    },[]);

    const getYpoxreoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ypo`);
        console.log(response.data)
        setYpoxreoseis(response.data);
    }

    const handleYpoxreoseisChange = async (e) => {
        const selectedId = e.target.value;
        setYpoxreoseisId(selectedId)
        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery/${selectedId}`);
      
            setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
            setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);
          
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }

    }



    const saveDoseis = async (e) =>{
        const updatedStatus = actual_payment_date ? "yes" : "no";

        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/doseis`, {
            ammount:ammount,
            actual_payment_date:actual_payment_date,
            estimate_payment_date:estimate_payment_date,
            status:updatedStatus,
            ypoxreoseis_id:ypoxreoseis_id
            });
            navigate("/doseis");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    const clearDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setActual_Payment_Date(null); // Clear the calendar date
    };


    const formatCurrency = (value) => {
        // return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    return(

        <div >
        <h1 className='title'>Προσθήκη Δόσης</h1>
      <form onSubmit={saveDoseis}>
      <div className="grid">
      <div className="col-12 md:col-6">
          <div className="card p-fluid">
          <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Δόσης</span></Divider></div>

          <div className="field">
                    <label className="label">Ονομα Παρόχου</label>
                <div className="control">
                    <select className="input" onChange={(e) => handleYpoxreoseisChange(e)} defaultValue="">
                            <option value="" disabled>Επιλέξτε Πάροχο</option>
                            {ypoxreoseis.map((ypoxreosh, index) => (
                                <option key={index} value={ypoxreosh.id}>{ypoxreosh.provider}</option>
                            ))}
                        </select>
                    </div>
              </div>

              <div className="field">
                  <label htmlFor="name1">Συνολικό Ποσο Υποχρέωσης</label>
                  <div className="control">

                 <h2>{formatCurrency(Number(totalOwedAmmount)+Number(ammountVat))}</h2> 
                  </div>
              </div>

              <div className="field">
                  <label htmlFor="name1">ΠΟΣΟ ΔΟΣΗΣ</label>
                  <div className="control">

                  <InputText id="ammount" type="text" value={ammount} onChange={(e)=> setAmmount(e.target.value)} />
                  </div>
              </div>

                <div className="field">
                    <label htmlFor="estimate_payment_date">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΟΣΗΣ</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} inline showWeek />
                        </div>
                </div>


                <div className="field">
                    <label htmlFor="actual_payment_date">ΗΜΕΡΟΜΗΝΙΑ ΕΞΟΦΛΗΣΗΣ ΔΟΣΗΣ</label>
                    <div className="control">

                    <Calendar id="actual_payment_date"  value={actual_payment_date ? new Date(actual_payment_date) : null} onChange={(e)=> setActual_Payment_Date(e.target.value)} inline showWeek />
                        </div>

                    <div className="control">
                        <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
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

export default FormAddDoseis;