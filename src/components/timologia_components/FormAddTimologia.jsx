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
    const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);


    useEffect(()=>{
        getErga()
    },[]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getErgaforTimologia`);
        //console.log(response.data)
        setErga(response.data);
    }
    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setTempErga(selectedId);
        clearFormFields();
        //console.log(selectedId)
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteaByErgoId/${selectedId}`);
                const paradoteaByErgoId = response.data;
                //console.log(paradoteaByErgoId)
                setParadoteaByErgo(paradoteaByErgoId)
                // setBank_Ammount((timologio[0].totalek)*0.8 || ""); // Assuming `bank_ammount` is part of the response data
                // setCustomer_Ammount((timologio[0].totalek)*0.2 || "")
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    }

    const clearFormFields = () => {
        // setInvoice_date("");
        // setAmmount_no_tax("");
        // setAmmount_Tax_Incl("");
        // setActual_Payment_Date("");
        // setAmmount_Of_Income_Tax_Incl("");
        // setComments("");
        // setInvoice_Number("");
        setSelectedOptions([]);
        setSelectedParadoteaDetails([]);
    }
    

    
  const handleParadoteaChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    console.log(selectedOptions)

    const selectedIds = selectedOptions.map(option => option.value);
    const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
    setSelectedParadoteaDetails(selectedDetails);
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
            invoice_number: invoice_number
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




{/* Ippos experiment */}

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

            {/*End of ippos experiment */}


                <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={invoice_date} onChange={(e)=> setInvoice_date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ'/>
                        </div>
                    </div>
                {/*
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
                    */}
                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="date" className="input" value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} placeholder='ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ'/>
                        </div>
                    </div>
                    {/*
                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_of_income_tax_incl} onChange={(e)=> setAmmount_Of_Income_Tax_Incl(e.target.value)} placeholder='ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α'/>
                        </div>
                    </div>
                */}

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