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

import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace"
import { format } from 'date-fns';

const FormAddMultiDoseis = () => {
    const [ammount, setAmmount] = useState(null);
    const [paramEndDate,setparamEndDate] = useState(null)
    const [paramStartDate, setParamStartDate] = useState("")
    const [status,setStatus] = useState("no")
    const [ypoxreoseis_id,setYpoxreoseisId] = useState("")
    const [doseis,setdoseis]=useState([])
    const [doseisSum,setdoseisSum]=useState(0)
    const [paramDay,setParamDay]=useState(1);
    const [paramStatus,setParamStatus]=useState({name: "no", code: "no"})
    const statusOptions = [
        { name: 'yes', code: 'yes' },
        { name: 'no', code: 'no' },
        
    ];

    const [totalOwedAmmount, setTotal_Owed_Ammount] = useState(0.0);
    const [ammountVat, setAmmount_Vat] = useState(0.0);
    

    const [ypoxreoseis,setYpoxreoseis]=useState([]);

    const [text, setText] = useState('');

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        getYpoxreoseis()
       
    },[]);
    useEffect(()=>{
        if(ypoxreoseis_id!==""){
            getdoseis()
        }
    },[ypoxreoseis_id]);

    const getYpoxreoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ypo`, {timeout: 5000});
        console.log(response.data)
        setYpoxreoseis(response.data);
    }
    const getdoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/doseis`, {timeout: 5000});
        const doseisData = response.data.filter(item => item.ypoxreoseis_id === parseInt(ypoxreoseis_id)  )
        var sumdoseis=0
        setdoseis(doseisData);
        doseisData.map((dosi)=>{
            sumdoseis+=parseFloat(dosi.ammount)

        })
        setdoseisSum(sumdoseis)

    }

    //used for ammount to check the limit required for ypoxreoseis
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
    


    const handleYpoxreoseisChange = async (e) => {
        const selectedId = e.target.value;
        setYpoxreoseisId(selectedId)
        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery/${selectedId}`, {timeout: 5000});
      
            setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
            setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);
          
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }

    }


      // Convert dates to UTC format before sending to the server
      const formatToUTC = (date) => {
        return date ? format(date, "yyyy-MM-dd'") : null;
    };

    const saveDoseis = async (e) =>{
        const updatedStatus = paramEndDate ? "yes" : "no";

        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/multidoseis`, {
            paramAmmount:ammount,
            paramStartDate:formatToUTC(paramStartDate),
            paramEndDate:formatToUTC(paramEndDate),
            paramStatus:paramStatus.name,
            paramYpoxreoseisId:parseInt(ypoxreoseis_id),
            paramDay:parseInt(paramDay)
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
        setparamEndDate(null); // Clear the calendar date
    };


    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    return(

        <div >
        <h1 className='title'>Προσθήκη Δόσεων</h1>
      <form onSubmit={saveDoseis}>
      <div className="grid">
      <div className="col-12 md:col-6">
          <div className="card p-fluid">
          <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Δόσης</span></Divider></div>

          <div className="field">
                    <label className="label">Προμηθευτής-έξοδο</label>
                <div className="control">
                    <select className="input" onChange={(e) => handleYpoxreoseisChange(e)} defaultValue="">
                            <option value="" disabled>Επιλέξτε Προμηθευτή</option>
                            {ypoxreoseis.map((ypoxreosh, index) => (
                                <option key={index} value={ypoxreosh.id}>{ypoxreosh.provider}</option>
                            ))}
                        </select>
                    </div>
              </div>

              <div className="field">
                  <label htmlFor="name1">Συνολικό Ποσο Υποχρέωσης</label>
                  <div className="control">

                 <span><h2>{formatCurrency(Number(totalOwedAmmount)+Number(ammountVat))}</h2> </span>
                  </div>
              </div>
              <div className="field">
                  <label htmlFor="name1">Συνολικό Ποσο Δόσεων</label>
                  <div className="control">

                 <span><h2>{formatCurrency(Number(doseisSum))}</h2> </span>
                  </div>
              </div>
              <div className="field">
                  <label htmlFor="name1">Υπόλοιπο</label>
                  <div className="control">

                 <span><p>Ποσο Υποχρεωσης({formatCurrency(Number(totalOwedAmmount)+Number(ammountVat))}) - Ποσο Δόσεων({formatCurrency(Number(doseisSum))}) = Υπόλοιπο({formatCurrency(Number(totalOwedAmmount)+Number(ammountVat)-Number(doseisSum))}) </p> </span>
                  </div>
              </div>

              <div className="field">
                  <label htmlFor="name1">Ποσό Δόσης</label>
                  <div className="control">

                  <InputNumber id="ammount"  keyfilter="pnum" mode="decimal" minFractionDigits={2} value={ammount} onChange={(e)=> CalculateMax(e)} max={Number(ammount)}/>


                  </div>
              </div>

                <div className="field">
                    <label htmlFor="estimate_payment_date">Επιλέξτε ημερομηνία Δόσης απο : </label>
                    <div className="control">

                    <Calendar id="paramaStartDate" value={paramStartDate} onChange={(e)=> setParamStartDate(e.target.value)} showIcon />
                    </div>
                </div>


                <div className="field">
                    <label htmlFor="actual_payment_date">έως</label>
                    <div className="control">

                    <Calendar id="paramaEndDate" value={paramEndDate ? new Date(paramEndDate) : null} onChange={(e)=> setparamEndDate(e.target.value)} showIcon />

                    </div>
                </div>

                <div className="field">
                  <label htmlFor="name1">Μερα Πληρωμης Δόσης</label>
                  <div className="control">

                  <InputNumber id="paramDay" type='int' value={paramDay} onChange={(e)=> setParamDay(e.value)} />


                  </div>
                </div>

                <div className="field">
                  <label htmlFor="name1">Κατάσταση Πληρωμης</label>
                  <div className="control">

                  <Dropdown value={paramStatus} onChange={(e) => setParamStatus(e.value)} options={statusOptions} optionLabel="name" 
                placeholder="Επιλέξτε κατάσταση Δόσης" className="w-full md:w-14rem" disabled />

                {console.log("Here is paramstatus", paramStatus)}


                  </div>
                </div>



           

           
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

export default FormAddMultiDoseis;