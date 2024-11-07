import React,{useState,useEffect,useRef } from 'react'
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

import { Toast } from 'primereact/toast'; // Import Toast component
import { Tooltip } from 'primereact/tooltip'; // For optional tooltip on info icon
import { PrimeIcons } from 'primereact/api';  // Import PrimeIcons
import CustomToast from '../CustomToast';
import { format } from 'date-fns';

const FormAddTimologia = () => {

    const[tempErga,setTempErga]=useState("");

    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_no_tax,setAmmount_no_tax]=useState("");
    const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState(null);
    const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
    const[comments,setComments]=useState(null);
    const[invoice_number,setInvoice_Number]=useState("");
    const[status_paid,setStatus_Paid]=useState("no");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const [erga,setErga]=useState([]);
    const [paradotea,setParadoteaByErgo]=useState([]);


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);

    const[parEightPercent,setparEightPercent]=useState(0.0)
    const[parEfor,setParEfor]=useState(0.0)
    const[loipaExo,setLoipaExo]=useState(0.0)
    // const toast = useRef(""); // Reference for the toast


    useEffect(()=>{
        getErga()
    },[]);

    // const showInfo = (text) => {
    //     toast.current.show({
    //         severity: 'info',
    //         summary: 'Πληροφορία',
    //         detail: text,
    //         life: 3000,
    //     });
    // };
    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/getErgaforTimologia`, {timeout: 5000});
        setErga(response.data);
    }
    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setTempErga(selectedId);
        clearFormFields();
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteaByErgoId/${selectedId}`, {timeout: 5000});
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
            totalAmmount += Number(item.ammount);
            totalAmmountVat += Number(item.ammount_vat);
            totalAmmountTotal += Number(item.ammount_total);
        });
        totalAmmountTotal=totalAmmountTotal - parEightPercent - parEfor-loipaExo;

        return {
            totalAmmount,
            totalAmmountVat,
            totalAmmountTotal
        };
    };

    const { totalAmmount, totalAmmountVat, totalAmmountTotal } = calculateTotalAmounts(selectedParadoteaDetails);
    // Convert dates to UTC format before sending to the server
    const formatToUTC = (date) => {
        return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
    };
    const saveTimologia = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post(`${apiBaseUrl}/timologia`, {
            invoice_date:formatToUTC(invoice_date),

            ammount_no_tax:totalAmmount,
            ammount_tax_incl:totalAmmountVat,
            actual_payment_date: formatToUTC(actual_payment_date),
            ammount_of_income_tax_incl: totalAmmountTotal,
            ammount_parakratisi_eight:	parEightPercent,
            ammount_parakratisi_eforia: parEfor,
            ammount_loipa_exoda:loipaExo,
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

        <div >
          

        <h1 className='title'>Προσθήκη Τιμολογίου</h1>
      <form onSubmit={saveTimologia}>
      <div className="grid">
      <div className="col-12 md:col-6">
          <div className="card p-fluid">
          <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Τιμολογίου</span></Divider></div>

              <div className="field">
                  <label htmlFor="name1">Κωδικός Τιμολογίου</label>
                  <CustomToast txtmsg="Ο κωδικός που εχει δημιουργιθεί απο το λογηστίριο για το συγκεκριμένο τιμολόγιο"/>

                  <div className="control">

                  <InputText id="invoice_number" type="text" value={invoice_number} onChange={(e)=> setInvoice_Number(e.target.value)} />
                  </div>
              </div>

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
                <CustomToast  txtmsg="Υπαρχει η δυνατότητα τιμολόγισης ενός η και περισόττερων παραδοτέων που αφορούν το ίδιο Εργο"/>

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
                    <label className="label">Ποσό τιμολογίου  (καθαρή αξία)</label>
                    <div className="control">
                        <InputNumber className="input" value={totalAmmount} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_no_tax(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly />   
                    </div>
              </div>

              <div className="field">
                    <label className="label">Σύνολο Φ.Π.Α.</label>
                    <div className="control">
                    <InputNumber className="input" value={totalAmmountVat} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_Tax_Incl(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Παρακράτηση 8%</label>
                    <div className="control">
                    <InputNumber className="input" value={parEightPercent} mode="decimal" minFractionDigits={2}  onChange={(e)=> setparEightPercent(e.value)} placeholder='Παρακράτηση 8%'  />
                    </div>
                </div>


                <div className="field">
                    <label className="label">Παρακράτηση Εφορία</label>
                    <div className="control">
                    <InputNumber className="input" value={parEfor} mode="decimal" minFractionDigits={2}  onChange={(e)=> setParEfor(e.value)} placeholder='Παρακράτηση Εφορία'  />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Λοιπά Έξοδα</label>
                    <div className="control">
                    <InputNumber className="input" value={loipaExo} mode="decimal" minFractionDigits={2}  onChange={(e)=> setLoipaExo(e.value)} placeholder='Λοιπά έξοδα'  />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Πληρωτέο</label>
                    <div className="control">
                    <InputNumber className="input" value={totalAmmountTotal} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_Of_Income_Tax_Incl(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="invoice_date">Ημερομηνία έκδοσης τιμολογίου</label>
                    {/* <Button icon="pi pi-info-circle" className="p-button-rounded p-button-info p-button-text" onClick={(e)=> showInfo("message test")} /> */}
                    <CustomToast txtmsg="Η ημερομηνία που αναγράφεται πάνω στο τιμόλογιο που θέλουμε να καταχωρίσουμε"/>

                    <div className="control">

                    <Calendar id="invoice_date"  value={invoice_date} onChange={(e)=> setInvoice_date(e.target.value)} inline showWeek />
                        </div>
                </div>


                <div className="field">
                    <label htmlFor="actual_payment_date">Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)</label>
                    <CustomToast txtmsg="Εκτιμώμενη Ημερομηνία που επρόκειτο να πληρωθεί το τιμολόγιο.Εαν πληρωθεί τοτε μιλάμε για ημερομηνία εξόφλισης"/>
                    <div className="control">

                    <Calendar id="actual_payment_date"  value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} inline showWeek />
                        </div>
                </div>

                <div className="field">
                    <label className="label">Σχόλια</label>
                    <div className="control">
                    <InputText id="comments" type="text" value={comments} onChange={(e)=> setComments(e.target.value)} />

                    </div>
                </div>

                {/* <div className="field">
                    <label className="label">Κατασταση Τιμολογίου</label>
                    <div className="control">
                    <InputText id="comments" type="text" value={status_paid} onChange={(e)=> setStatus_Paid(e.target.value)} />

                    </div>
                </div> */}

<div className="field">
    <label className="label">Κατασταση Τιμολογίου</label>
    <div className="control">
        <Dropdown
            id="status_paid"
            value={status_paid}
            options={[
                { label: "Πληρωμένο", value: "yes" },
                { label: "Απλήρωτο", value: "no" },
            ]}
            onChange={(e) => setStatus_Paid(e.value)}
            placeholder="Επιλέξτε Κατάσταση Τιμολογίου"
        />
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

export default FormAddTimologia