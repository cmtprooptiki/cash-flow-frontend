import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

import Select from 'react-select';

const FormAddTimologia = () => {

    const[tempErga,setTempErga]=useState("");

    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_no_tax,setAmmount_no_tax]=useState("");
    const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState("");
    const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
    const[comments,setComments]=useState("");
    const[invoice_number,setInvoice_Number]=useState("");
    const[status_paid,setStatus_Paid]=useState("");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const [erga,setErga]=useState([]);
    const [paradotea,setParadoteaByErgo]=useState([]);


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);


    useEffect(()=>{
        getErga()
    },[]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getErgaforTimologia`);
        setErga(response.data);
    }
    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setTempErga(selectedId);
        clearFormFields();
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteaByErgoId/${selectedId}`);
                const paradoteaByErgoId = response.data;
                setParadoteaByErgo(paradoteaByErgoId)
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    }

    const clearFormFields = () => {
        setSelectedOptions([]);
        setSelectedParadoteaDetails([]);
    }
    

    
  const handleParadoteaChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    console.log(selectedOptions)

    const selectedIds = selectedOptions.map(option => option.value);
    const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
    setSelectedParadoteaDetails(selectedDetails);
  };


    const options = paradotea.map(paradoteo => ({
        value: paradoteo.id,
        label: paradoteo.title
      }));

      const calculateTotalAmounts = () => {
        let totalAmmount = 0;
        let totalAmmountVat = 0;
        let totalAmmountTotal = 0;

        selectedParadoteaDetails.forEach(item => {
            totalAmmount += item.ammount;
            totalAmmountVat += item.ammount_vat;
            totalAmmountTotal += item.ammount_total;
        });


        return {
            totalAmmount,
            totalAmmountVat,
            totalAmmountTotal
        };
    };

    const { totalAmmount, totalAmmountVat, totalAmmountTotal } = calculateTotalAmounts(selectedParadoteaDetails);

    const saveTimologia = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post(`${apiBaseUrl}/timologia`, {
            invoice_date:invoice_date,

            ammount_no_tax:totalAmmount,
            ammount_tax_incl:totalAmmountVat,
            actual_payment_date: actual_payment_date,
            ammount_of_income_tax_incl: totalAmmountTotal,
            comments: comments,
            invoice_number: invoice_number,
            status_paid:status_paid

            });

            const timologiaId = response.data.id; // Get the ID of the newly added timologio
            console.log("The response: ", response)
            await Promise.all(selectedParadoteaDetails.map(async (paradoteo) => {
                console.log(paradoteo.id)
                await axios.patch(`${apiBaseUrl}/UpdateTimologia_idFromParadotea/${paradoteo.id}`, {
                    "timologia_id": timologiaId
                });
            }));

            console.log("Done")
            
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

                                <div className="field">
                                <label className="label">Σύνολο Ποσό</label>
                                <div className="control">
                                    <input type="text" className="input" value={totalAmmount}  readOnly />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Σύνολο Φ.Π.Α.</label>
                                <div className="control">
                                    <input type="text" className="input" value={totalAmmountVat}  readOnly />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Σύνολο Ποσό με Φ.Π.Α.</label>
                                <div className="control">
                                    <input type="text" className="input" value={totalAmmountTotal}  readOnly />
                                </div>
                            </div>



                <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={invoice_date} onChange={(e)=> setInvoice_date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} placeholder='ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ'/>
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
                        <label  className="label">ΚΑΤΑΣΤΑΣΗ ΤΙΜΟΛΟΓΙΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={status_paid} onChange={(e)=> setStatus_Paid(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΤΙΜΟΛΟΓΙΟΥ'/>
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