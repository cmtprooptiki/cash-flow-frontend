import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

import { Divider } from 'primereact/divider';

const FormEditParadotea = ({ id, onHide }) => {
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState(0);
    const[erga_id,setErga_id]=useState("");
    const[timologia_id,setTimologia_id]=useState("");
    const [percentage_vat, setPercentage_Vat] = useState(0.24); // Default percentage_vat
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null);
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null);

    const[comments,setComments]=useState(null);


    const [erga, setErga] = useState([])

    const[msg,setMsg]=useState("");

    const handleErgaChange = (e) => {
        setErga_id(e.target.value);
    };

    const navigate = useNavigate();

    // const{id} = useParams();

    useEffect(() => {
        const getParadoteaById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/paradotea/${id}`, {timeout: 5000});
                setPart_Number(response.data.part_number);
                setTitle(response.data.title);
                setDelivery_Date(response.data.delivery_date);
                setPercentage(response.data.percentage);
                setErga_id(response.data.erga_id);
                setTimologia_id(response.data.timologia_id);
                setAmmount(response.data.ammount);
                setAmmount_Vat(response.data.ammount_vat);
                setAmmount_Total(response.data.ammount_total);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2);
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3);
                setComments(response.data.comments);

            }
            catch (error)
            {
                if(error.response)
                {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getParadoteaById();

        const getErga = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
                setErga(response.data);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getErga();
    }, [id]);

    useEffect(() => {
        // Recalculate VAT whenever the percentage or ammount changes
        const vat = parseFloat(ammount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
    }, [ammount, percentage, percentage_vat]);

    const handlePercentageChange = (e) => {
        const newPercentage = e.value;
        setPercentage_Vat(newPercentage);
        const vat = parseFloat(ammount) * parseFloat(newPercentage);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(ammount) + vat).toFixed(2));
    };

    const handleAmmountChange = (e) => {
        const newAmmount = e.value;
        setAmmount(newAmmount);
        const vat = parseFloat(newAmmount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(newAmmount) + vat).toFixed(2));
    };

    const updateParadotea = async(e) =>{
        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/paradotea/${id}`, {
                part_number:part_number,
                title:title,
                delivery_date:delivery_date,
                percentage:percentage,
                erga_id:erga_id,
                timologia_id:timologia_id,
                ammount:ammount,
                ammount_vat: ammount_vat,
                ammount_total:ammount_total,
                estimate_payment_date: estimate_payment_date,
                estimate_payment_date_2: estimate_payment_date_2,
                estimate_payment_date_3: estimate_payment_date_3,
                comments:comments

            });
            onHide();
            window.location.reload();
            // navigate("/paradotea");
        }
        catch(error)
        {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };

    const formatDate = (value) => {
        let date = new Date(value);
        let epochDate = new Date('1970-01-01T00:00:00Z');
        if (date.getTime() === epochDate.getTime()) 
        {
            return null;
        }
        if (!isNaN(date)) {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
        } else {
            return "Invalid date";
        }
    };

    const clearDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setEstimate_Payment_Date_2(null); // Clear the calendar date
    };

    const clearDate2 = (e) => {
        e.preventDefault();  // Prevent form submission
        setEstimate_Payment_Date_3(null); // Clear the calendar date
    }

    return(

        <div >
               <h1 className='title'>Διαχείριση Παραδοτέου</h1>
               <h2 className='subtitle'>Επεξεργασία Παραδοτέου</h2> 
        <form onSubmit={updateParadotea}>
        <div className="grid">
        <div className="col-12 md:col-6">
            <div className="card p-fluid">
                <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Παραδοτέου</span></Divider></div>

                <div className="field">
                    <label htmlFor="name1">Τίτλος Παραδοτέου</label>
                    <div className="control">

                    <InputText id="name1" type="text" value={title} onChange={(e)=> setTitle(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="parnum1">Παραδοτέο (Αριθμός)</label>
                    <div className="control">

                    <InputText id="parnum1" type="text"  value={part_number} onChange={(e)=> setPart_Number(e.target.value)}  />
                     </div>
                </div>
                <div className="field">
            <label className="label">Εργα</label>
            <div className="control">
                {/* <Dropdown 
                    value={erga_name} 
                    options={erga} 
                    onChange={(e)=> {handleErgaChange(e)}} 
                    optionLabel="name" 
                    placeholder="Επιλέξτε Εργο"
                /> */}
                  <select className="input" onChange={(e) => handleErgaChange(e)} value={erga_id}  disabled={true} >
                                    <option value="" disabled>Επιλέξτε Εργο</option>
                                        {erga.map((ergo, index) => (
                                            <option key={index} value={ergo.id}>{ergo.name}</option>
                                        ))}
                                </select>
            </div>
        </div>

                {/* <div className="field">
                        <label htmlFor="state">Ανήκει στο Εργο</label>
                        <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)}
                        options={dropdownItems} optionLabel="name" placeholder="Select One">

                        </Dropdown>


                    </div> */}

                <div className="field">
                    <label htmlFor="deliverydate1">Ημερομηνία υποβολής</label>
                    <div className="control">

                    <Calendar id="deliverydate1"  value={new Date(delivery_date)} onChange={(e)=> setDelivery_Date(e.target.value)} inline showWeek />
</div>
                </div>
            </div>

            <div className="card p-fluid">
            <div className=""><Divider><span className="p-tag text-lg">Εκτιμήσεις</span></Divider></div>
            <div className="formgrid grid">
                

                    <div className="field col-12 md:col-8">
                   
                    <label htmlFor="estimate_payment_date">Ημερομηνία πληρωμής (εκτίμηση)</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={new Date(estimate_payment_date)} onChange={(e)=> setEstimate_Payment_Date(e.target.value)}  inline showWeek />
                   </div>
                         </div>

                    <div className="field col-12 md:col-8">
                    <label htmlFor="estimate_payment_date_2">Ημερομηνία πληρωμής  (εκτίμηση 2)</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date_2"  value={estimate_payment_date_2 ? new Date(estimate_payment_date_2) : null} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)}  inline showWeek />
</div>
<div className="control">
                            <Button label="Clear" onClick={clearDate} className="p-button-secondary mt-2" type="button"/>
                        </div>
                
                    </div>

                    <div className="field col-12 md:col-8">
                    <label htmlFor="estimate_payment_date_3">Ημερομηνία πληρωμής  (εκτίμηση 3)</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date_3"  value={estimate_payment_date_3 ? new Date(estimate_payment_date_3) : null} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)}  inline showWeek />
</div>
<div className="control">
                            <Button label="Clear" onClick={clearDate2} className="p-button-secondary mt-2" type="button"/>
                        </div>
                
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 md:col-6">
            <div className="card p-fluid">
            <div className=""><Divider><span className="p-tag text-lg">Οικονομικά Στοιχεία</span></Divider></div>
                <div className="field">
                    <label htmlFor="percentage">Ποσοστό σύμβασης</label>
                    <div className="control">

                    <InputNumber  id="percentage" className="input" mode="decimal" minFractionDigits={2} value={percentage}  onChange={(e)=> setPercentage(e.value)}/>
             </div>
                </div>
                   
                <div className="field">
                    <label htmlFor="percentagevat">Ποσοστό ΦΠΑ</label>
                    <div className="control">

                    <InputNumber  id="percentagevat" className="input" mode="decimal" minFractionDigits={2} value={percentage_vat} onChange={handlePercentageChange} />
                   </div>
                </div>

                <div className="field">
                    <label htmlFor="ammount">Ποσό  (καθαρή αξία)</label>
                    <div className="control">

                    <InputNumber  id="ammount" className="input" mode="decimal" minFractionDigits={2}  value={ammount} onChange={handleAmmountChange}/>
              </div>
              
                </div>

                <div className="field">
                    <label htmlFor="ammount_vat">Ποσό ΦΠΑ</label>
                    <div className="control">
                    <InputNumber  className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.value)} placeholder='ΠΟΣΟ ΦΠΑ' readOnly/>
                    {/* <InputNumber  id="ammount_vat" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} readOnly /> */}
               </div>
                </div>

                <div className="field">
                    <label htmlFor="total_ammount">Σύνολο</label>
                    <InputNumber className="input" mode="decimal" minFractionDigits={2}  id="total_ammount" value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} readOnly />
                </div>

                <label htmlFor="comments">Σχόλιο Παραδοτέου</label>
                    <div className="control">

                    <InputText id="comments" type="text" value={comments} onChange={(e)=> setComments(e.target.value)} />
                    </div>

            </div>
            

            <div >

            <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                            </div>
                        </div>

                
                {/* <div className="field">
                <div className="control">

                    <button type="submit" label="Προσθήκη" onSubmit={saveParadotea} className="button is-success is-fullwidth">Προσθήκη</button>
                    </div>
                </div> */}
            </div>

           
        </div>

       
    </div>
    </form>

                                        
    </div>




    //     <div>
    //     <h1 className='title'>Διαχείριση Παραδοτέων</h1>
    //     <h2 className='subtitle'>Επεξεργασία Παραδοτέων</h2>
    //     <div className="card is-shadowless">
    //         <div className="card-content">
    //             <div className="content">
    //             <form onSubmit={updateParadotea}>
    //                 <p className='has-text-centered'>{msg}</p>
    //             <div className="field">
    //                     <label  className="label">ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ</label>
    //                     <div className="control">
    //                         <input type="text" className="input" value={part_number} onChange={(e)=> setPart_Number(e.target.value)} placeholder='ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ'/>
    //                     </div>
    //                 </div>
    //                 <div className="field">
    //                     <label  className="label">ΤΙΤΛΟΣ ΠΑΡΑΔΟΤΕΟΥ</label>
    //                     <div className="control">
    //                         <input type="text" className="input" value={title} onChange={(e)=> setTitle(e.target.value)} placeholder='ΤΙΤΛΟΣ ΠΑΡΑΔΟΤΕΟΥ'/>
    //                     </div>
    //                 </div>
    //                 <div className="field">
    //                     <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ</label>
    //                     <div className="control">
    //                         <input type="date" className="input" value={delivery_date} onChange={(e)=> setDelivery_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ'/>
    //                     </div>
    //                 </div>
    //                 <div className="field">
    //                     <label  className="label">ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ</label>
    //                     <div className="control">
    //                         <input type="text" className="input" value={percentage} onChange={(e)=> setPercentage(e.target.value)} placeholder='ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ'/>
    //                     </div>
    //                 </div>

    //                 <div className="field">
    //                     <label className="label">Ποσοστό ΦΠΑ</label>
    //                             <div className="control">
    //                                 <input type="text" className="input" value={percentage_vat} onChange={handlePercentageChange} placeholder='Ποσοστό ΦΠΑ' />
    //                             </div>
    //                     </div>

    //                 <div className="field">
    //                     <label className="label">ΕΡΓΟ</label>
    //                     <div className="control">
    //                         <select className="input" onChange={handleErgaChange} value={erga_id}>
    //                             <option value="" disabled>Επιλέξτε ΕΡΓΟ</option>
    //                             {erga.map((ergo, index) => (
    //                             <option key={index} value={ergo.id}>{ergo.name}</option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 </div>



    //                 <div className="field">
    //                         <label  className="label">ΑΡΧΙΚΟ ΠΟΣΟ</label>
    //                         <div className="control">
    //                             <input type="text" className="input" value={ammount} onChange= {handleAmmountChange} placeholder='ΑΡΧΙΚΟ ΠΟΣΟ'/>
    //                         </div>
    //                     </div>

    //                     <div className="field">
    //                         <label  className="label">ΠΟΣΟ ΦΠΑ</label>
    //                         <div className="control">
    //                             <input type="text" className="input" value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.target.value)} readOnly placeholder='ΠΟΣΟ ΦΠΑ'/>
    //                         </div>
    //                     </div>

    //                     <div className="field">
    //                         <label  className="label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</label>
    //                         <div className="control">
    //                             <input type="text" className="input" value={ammount_total} onChange={(e)=> setAmmount_Total(e.target.value)} readOnly placeholder='ΣΥΝΟΛΙΚΟ ΠΟΣΟ'/>
    //                         </div>
    //                     </div>

    //                     <div className="field">
    //                         <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1</label>
    //                         <div className="control">
    //                             <input type="date" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1'/>
    //                         </div>
    //                     </div>

    //                     <div className="field">
    //                         <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2</label>
    //                         <div className="control">
    //                             <input type="date" className="input" value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2'/>
    //                         </div>
    //                     </div>

    //                     <div className="field">
    //                         <label  className="label">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3</label>
    //                         <div className="control">
    //                             <input type="date" className="input" value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)} placeholder='ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3'/>
    //                         </div>
    //                     </div>

                    
                    
                    
    //                 <div className="field">
    //                     <div className="control">
    //                         <button type="submit" className="button is-success is-fullwidth">Ενημέρωση</button>
    //                     </div>
    //                 </div>
    //             </form>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    )
}

export default FormEditParadotea