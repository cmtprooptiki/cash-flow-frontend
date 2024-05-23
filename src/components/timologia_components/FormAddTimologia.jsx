import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

import Select from 'react-select';
// import 'react-select/dist/react-select.css'; 

const FormAddTimologia = () => {

    const[tempErga,setTempErga]=useState("");

    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_no_tax,setAmmount_no_tax]=useState("");
    const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState("");
    const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
    const[comments,setComments]=useState("");
    const[invoice_number,setInvoice_Number]=useState("");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const [erga,setErga]=useState([]);
    const [paradotea,setParadoteaByErgo]=useState([]);


    const [selectedOptions, setSelectedOptions] = useState([]);


    useEffect(()=>{
        getErga()
    },[]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getErgaforTimologia`);
        console.log(response.data)
        setErga(response.data);
    }
    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setTempErga(selectedId);
        console.log(selectedId)
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteaByErgoId/${selectedId}`);
                const paradoteaByErgoId = response.data;
                console.log(paradoteaByErgoId)
                setParadoteaByErgo(paradoteaByErgoId)
                // setBank_Ammount((timologio[0].totalek)*0.8 || ""); // Assuming `bank_ammount` is part of the response data
                // setCustomer_Ammount((timologio[0].totalek)*0.2 || "")
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    }
    

    
  const handleParadoteaChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    // Additional logic to handle change
  };

    // const handleParadoteaChange = async (e) => {
    //     // const selectedId = e.target.value;
    //     // setTempErga(selectedId);
    //     console.log("work")
    //     // if (selectedId) {
    //     //     try {
    //     //         const response = await axios.get(`${apiBaseUrl}/getParadoteaByErgoId/${selectedId}`);
    //     //         const paradoteaByErgoId = response.data;
    //     //         console.log(paradoteaByErgoId)
    //     //         setParadoteaByErgo(paradoteaByErgoId)
    //     //         // setBank_Ammount((timologio[0].totalek)*0.8 || ""); // Assuming `bank_ammount` is part of the response data
    //     //         // setCustomer_Ammount((timologio[0].totalek)*0.2 || "")
    //     //     } catch (error) {
    //     //         console.error("Error fetching timologio data:", error);
    //     //     }
    //     // }
    // }

    const options = paradotea.map(paradoteo => ({
        value: paradoteo.id,
        label: paradoteo.title
      }));

    const saveTimologia = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/timologia`, {
            invoice_date:invoice_date,

            ammount_no_tax:ammount_no_tax,
            ammount_tax_incl:ammount_tax_incl,
            actual_payment_date: actual_payment_date,
            ammount_of_income_tax_incl: ammount_of_income_tax_incl,
            comments: comments,
            invoice_number: invoice_number
            });
            navigate("/timologia");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return(
        <div>
        <h1 className='title'>Προσθήκη Τιμολογίου</h1>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveTimologia}>
                <p className='has-text-centered'>{msg}</p>


                <div className="field">
    <label className="label">Εργα</label>
    <div className="control">
        <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
            <option value="" disabled>Επιλέξτε Εργο</option>
            {erga.map((ergo, index) => (
                <option key={index} value={ergo.erga.id}>{ergo.erga.name}</option>
            ))}
        </select>
    </div>
</div>

<div className="field">
      <label className="label">Παραδοτεα</label>
      <div className="control">
        <Select
          isMulti
          value={selectedOptions}
          onChange={handleParadoteaChange}
          options={options}
          placeholder="Επιλέξτε Παραδοτεα"
          classNamePrefix="react-select"
        />
      </div>
    </div>

{/* <div className="field">
    <label className="label">Παραδοτεα</label>
    <div className="control">
        <select isMulti className="input" onChange={(e) => handleParadoteaChange(e)} defaultValue="">
            <option value="" disabled>Επιλέξτε Παραδοτεο</option>
            {paradotea.map((paradoteo, index) => (
                <option key={index} value={paradoteo.id}>{paradoteo.title}</option>
            ))}
        </select>
    </div>
</div> */}


                <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={invoice_date} onChange={(e)=> setInvoice_date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ'/>
                        </div>
                    </div>
        
                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_no_tax} onChange={(e)=> setAmmount_no_tax(e.target.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΜΕ Φ.Π.Α</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_tax_incl} onChange={(e)=> setAmmount_Tax_Incl(e.target.value)} placeholder='ΠΟΣΟ ΜΕ Φ.Π.Α'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} placeholder='ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_of_income_tax_incl} onChange={(e)=> setAmmount_Of_Income_Tax_Incl(e.target.value)} placeholder='ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΑΡΑΤΗΡΗΣΕΙΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={comments} onChange={(e)=> setComments(e.target.value)} placeholder='ΠΑΡΑΤΗΡΗΣΕΙΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={invoice_number} onChange={(e)=> setInvoice_Number(e.target.value)} placeholder='ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ'/>
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

export default FormAddTimologia