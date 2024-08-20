import React,{useState, useEffect,useMemo } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';

const FormAddParadotea2 = () => {
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState(0);
    const[erga_id,setErga_id]=useState("");
    // const[erga_name,setErgaName]=useState(null);

    const[timologia_id,setTimologia_id]=useState(null);
    const[ammount,setAmmount]=useState(0);
    const[ammount_vat,setAmmount_Vat]=useState(0);
    const[ammount_total,setAmmount_Total]=useState(0);
    const[estimate_payment_date,setEstimate_Payment_Date]=useState(null);
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState(null);
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState(null);

    const [percentage_vat, setPercentage_Vat] = useState(0.24); // Default percentage_vat

    const [erga,setErga]=useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const[tempErga,setTempErga]=useState("");
    

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getErga();
    }, []);

    // const [dropdownItem, setDropdownItem] = useState(null);
    

    // const dropdownItems = useMemo(
    //     () => erga.map(ergo => ({ name: ergo.name, code: ergo.id })),
    //     [erga]
    // );
    // const dropdownItems = useMemo(
    //     () => [
    //         { name: 'Option 1', code: 'Option 1' },
    //         { name: 'Option 2', code: 'Option 2' },
    //         { name: 'Option 3', code: 'Option 3' }
    //     ],
    //     []
    // );

    // useEffect(() => {
    //     if (dropdownItems.length > 0) {
    //         setDropdownItem(dropdownItems[0]);
    //     }
    // }, [dropdownItems]);



    useEffect(() => {
        // Recalculate VAT whenever the percentage or ammount changes
        const vat = parseFloat(ammount) * parseFloat(percentage_vat);
        setAmmount_Vat(vat.toFixed(2));
    }, [ammount, percentage, percentage_vat]);

    const getErga = async() =>{
        const response = await axios.get(`${apiBaseUrl}/erga`);
        console.log(response.data)
        setErga(response.data);
    }
    // const handleErgaChange = async (e) => {
    //     // const selectedId = e.value;
    //     // setTempErga(selectedId);
    //     // console.log(selectedId)
    //     // setErga_id(selectedId)
    //     setDropdownItem(e.value);

        
    // }

    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        // const selectedName=e.value;
        setTempErga(selectedId);
        console.log("Erga id",selectedId)
        setErga_id(selectedId);
        // setErgaName(selectedName);
        // console.log("name",selectedName)
    }


    const handleAmmountChange = (e) => {
        const newAmmount = e.value;
        console.log("hrere is new ammoutn",newAmmount);
        setAmmount(newAmmount);
        const vat = parseFloat(newAmmount) * parseFloat(percentage_vat);
        console.log("vat parsed",vat);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(newAmmount) + vat).toFixed(2));
    };

    const handlePercentageChange = (e) => {
        const newPercentage = e.value;
        setPercentage_Vat(newPercentage);
        const vat = parseFloat(ammount) * parseFloat(newPercentage);
        setAmmount_Vat(vat.toFixed(2));
        setAmmount_Total((parseFloat(ammount) + vat).toFixed(2));
    };

    const saveParadotea = async (e) => {
        e.preventDefault();
        try
        {
            await axios.post(`${apiBaseUrl}/paradotea`, {
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
                estimate_payment_date_3: estimate_payment_date_3
        });

        navigate("/esoda_step3");
        }
        catch(error)
        {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div >
          <h1 className='title'>Προσθήκη Παραδοτέου</h1>
        <form onSubmit={saveParadotea}>
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
                    <label htmlFor="parnum1">Αριθμός Παραδοτέου</label>
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
                  <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
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
                    <label htmlFor="deliverydate1">Ημερομηνία Παράδοσης</label>
                    <div className="control">

                    <Calendar id="deliverydate1"  value={delivery_date} onChange={(e)=> setDelivery_Date(e.target.value)} inline showWeek />
</div>
                </div>
            </div>

            <div className="card p-fluid">
            <div className=""><Divider><span className="p-tag text-lg">Εκτιμήσεις</span></Divider></div>
                <div className="formgrid grid">
                

                    <div className="field col-12 md:col-8">
                   
                    <label htmlFor="estimate_payment_date">Εκτιμωμένη Ημερομηνία Πληρωμής 1</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date"  value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)}  inline showWeek />
                   </div>
                         </div>

                    <div className="field col-12 md:col-8">
                    <label htmlFor="estimate_payment_date_2">Εκτιμωμένη Ημερομηνία Πληρωμής 2</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date_2"  value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)}  inline showWeek />
</div>
                
                    </div>

                    <div className="field col-12 md:col-8">
                    <label htmlFor="estimate_payment_date_3">Εκτιμωμένη Ημερομηνία Πληρωμής 3</label>
                    <div className="control">

                    <Calendar id="estimate_payment_date_3"  value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)}  inline showWeek />
</div>
                
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 md:col-6">
            <div className="card p-fluid">
            <div className=""><Divider><span className="p-tag text-lg">Οικονομικά Στοιχεία</span></Divider></div>
                <div className="field">
                    <label htmlFor="percentage">Ποσοστό επί του Συμβατικού</label>
                    <div className="control">

                    <InputNumber  id="percentage" className="input" mode="decimal" minFractionDigits={2} onChange={(e)=> setPercentage(e.value)}/>
             </div>
                </div>
                   
                <div className="field">
                    <label htmlFor="percentagevat">Ποσοστό ΦΠΑ</label>
                    <div className="control">

                    <InputNumber  id="percentagevat" className="input" mode="decimal" minFractionDigits={2} value={percentage_vat} onChange={handlePercentageChange} />
                   </div>
                </div>

                <div className="field">
                    <label htmlFor="ammount">Αρχικό Ποσό</label>
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
                    <label htmlFor="total_ammount">Συνολικό Ποσό</label>
                    <InputNumber className="input" mode="decimal" minFractionDigits={2}  id="total_ammount" value={ammount_total} onChange={(e)=> setAmmount_Total(e.value)} readOnly />
                </div>
            </div>

            <div >

            <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
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
      )

}

export default FormAddParadotea2