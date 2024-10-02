import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import apiBaseUrl from '../../apiConfig';
import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import CustomToast from '../CustomToast';
import { InputNumber } from 'primereact/inputnumber';



const FormEditTimologia = () => {
    const [invoice_date, setInvoice_date] = useState("");
    const [ammount_no_tax, setAmmount_no_tax] = useState("");
    const [ammount_tax_incl, setAmmount_Tax_Incl] = useState("");
    const [actual_payment_date, setActual_Payment_Date] = useState(null);
    const [ammount_of_income_tax_incl, setAmmount_Of_Income_Tax_Incl] = useState("");
    const [comments, setComments] = useState("");
    const [invoice_number, setInvoice_Number] = useState("");
    const [status_paid, setStatus_Paid] = useState("");

    const [erga_id, setErga_id] = useState(null);
    const [erga, setErga] = useState([]);
    const [paradotea, setParadoteaByErgo] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);

    const [filteredErga, setFilteredErga] = useState([]); // State to store unique `erga` data
    const [uniqueErga2, setUniqueErga2] = useState([]); // State to store unique `erga` data

    const[calcdata,setcalcdata]=useState([])

    const[fullParadotea,setFullParadotea]=useState([])

    // const handleErgaChange = async (e) => {
    //     const selectedId = e.target.value;
    //     setErga_id(selectedId);
    //     clearFormFields();
    //     if (selectedId) {
    //         try {
    //             const response = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${selectedId}`, {timeout: 5000});
    //             const paradoteaByErgoId = response.data;
    //             setParadoteaByErgo(paradoteaByErgoId)
    //         } catch (error) {
    //             console.error("Error fetching timologio data:", error);
    //         }
    //     }
    // };
    const handleErgaStart = async(e) => {
        console.log(e)
        const selectedId = e.erga.id;
        setErga_id(selectedId);
        console.log(selectedId)
        clearFormFields();
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${parseInt(e.timologia_id)}`, {timeout: 5000});
                const paradoteaByErgoId = response.data;
                setParadoteaByErgo(paradoteaByErgoId.filter(paradoteo=>paradoteo.erga.id===selectedId))
                // Filter by timologia_id and then map over the filtered array
                console.log(paradoteaByErgoId);
                const selected = paradoteaByErgoId
                .filter(paradoteo => paradoteo.timologia_id === e.timologia_id)
                .map(paradoteo => ({
                    value: paradoteo.id,
                    label: paradoteo.title
                }));

                setSelectedOptions(selected);
                
                

                console.log(selected);
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    };
    

    const clearFormFields = () => {
        setSelectedOptions([]);
        setSelectedParadoteaDetails([]);
    }

    // const handleParadoteaChange = (selectedOptions) => {
    //     setSelectedOptions(selectedOptions);
    //     console.log("Selected option paradotea CHANGE", selectedOptions)

    //     const selectedIds = selectedOptions.map(option => option.value);
    //     const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
    //     setSelectedParadoteaDetails(selectedDetails);
    // };
    const handleParadoteaChange2 = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        console.log("Selected option paradotea CHANGE", selectedOptions)

        const selectedIds = selectedOptions.map(options2 => options2.value);
        const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
        setSelectedParadoteaDetails(selectedDetails);
    };

    const options = paradotea.map(paradoteo => ({
        value: paradoteo.id,
        label: paradoteo.title
    }));
    const options2 = paradotea.map(paradoteo => ({
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

        return {
            totalAmmount,
            totalAmmountVat,
            totalAmmountTotal
        };
    };

    const { totalAmmount, totalAmmountVat, totalAmmountTotal } = calculateTotalAmounts();

    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timologioResponse = await axios.get(`${apiBaseUrl}/timologia/${id}`, {timeout: 5000});
                const timologioData = timologioResponse.data;

                const paradoteaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`, {timeout: 5000});
                const paradoteaData = paradoteaResponse.data

                const ergaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`, {timeout: 5000});
                const ergaData = ergaResponse.data;

                const fullParadoteaResponse = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
                setFullParadotea(fullParadoteaResponse.data);

                // Set states with fetched data
                setInvoice_date(timologioData.invoice_date);
                setAmmount_no_tax(timologioData.ammount_no_tax);
                setAmmount_Tax_Incl(timologioData.ammount_tax_incl);
                setActual_Payment_Date(timologioData.actual_payment_date);
                setAmmount_Of_Income_Tax_Incl(timologioData.ammount_of_income_tax_incl);
                setComments(timologioData.comments);
                setInvoice_Number(timologioData.invoice_number);
                setStatus_Paid(timologioData.status_paid);
                setSelectedParadoteaDetails(paradoteaData);
                setErga(ergaData);
            } catch (error) {
                setMsg(error.response.data.msg);
            }
        };

        fetchData();
    }, [id]);
    useEffect(()=>{
        const selectedIds = selectedOptions.map(option => option.value);
        const selectedDetails = paradotea.filter(item => selectedIds.includes(item.id));
        setSelectedParadoteaDetails(selectedDetails);
    },[selectedOptions,id])

    const updateTimologio = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${apiBaseUrl}/timologia/${id}`, {
                invoice_date: invoice_date,
                ammount_no_tax: totalAmmount,
                ammount_tax_incl: totalAmmountVat,
                actual_payment_date: actual_payment_date,
                ammount_of_income_tax_incl: totalAmmountTotal,
                comments: comments,
                invoice_number: invoice_number,
                status_paid: status_paid
            });

            const timologiaId = response.data.id; // Get the ID of the newly added timologio
            // console.log("The response: ", response)
            // console.log("show timid",timologiaId)
            await Promise.all(selectedParadoteaDetails.map(async (paradoteo) => {
                // console.log("show par test",paradoteo)
                // console.log("on promise.", paradoteo.id)
                await axios.patch(`${apiBaseUrl}/UpdateTimologia_idFromParadotea/${paradoteo.id}`, {
                    "timologia_id": id
                });
            }));
            console.log(fullParadotea)
            ///delete all not in bar

            // Step 1: Filter fullParadotea for items with timologia_id === id
            const itemsWithTimologiaId = fullParadotea.filter(paradoteo => paradoteo.timologia_id === parseInt(id));

            // Step 2: Identify items not present in selectedParadotea
            const unselectedParadotea = itemsWithTimologiaId.filter(paradoteo => 
                !selectedParadoteaDetails.some(selected => selected.id === paradoteo.id)
            );

            console.log(unselectedParadotea)
            await Promise.all(unselectedParadotea.map(async (paradoteo) => {
                // console.log("show par test",paradoteo)
                // console.log("on promise.", paradoteo.id)
                await axios.patch(`${apiBaseUrl}/UpdateTimologia_idFromParadotea/${paradoteo.id}`, {
                    "timologia_id": null
                });
            }));

            // console.log("Done")

            navigate("/timologia");
        }
        catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Remove duplicates from erga
    // const uniqueErga = Array.from(new Set(erga.map(ergo => ergo.erga.id)))
    //     .map(id => {
            
    //         return erga.find(ergo => ergo.erga.id === id);
    //     });

    useEffect(() => {
        if (erga.length > 0) {
            // Step 1: Filter the rows where timologia_id equals the given id
            const filteredErga = erga.filter(ergo => ergo.timologia_id === parseInt(id));
    
            // Step 2: Create a Set to ensure unique erga names and map the filtered array
            const uniqueErga = Array.from(new Set(filteredErga.map(ergo => ergo.erga.id)))
            .map(id => {      
                return filteredErga.find(ergo => ergo.erga.id === id);
            });
    
            setUniqueErga2(uniqueErga);
            console.log(uniqueErga2)
            
        }
        }, [erga, id]);
    useEffect(()=>{
        if(uniqueErga2.length>0){
            handleErgaStart(uniqueErga2[0]);
        }
    },[uniqueErga2,id])
    // handleErgaStart(uniqueErga2[0]);
        // .map(id2 => {
        //     return erga.find(ergo => (ergo.erga.id === id2 && ergo.timologia_id === id));
        // })
        // .filter(ergo => ergo !== undefined); 

    return (
        <div >
            <h1 className='title'>Διαχείριση Τιμολογίου</h1>
            <h2 className='subtitle'>Επεξεργασία Τιμολογίου</h2>
            <form onSubmit={updateTimologio}>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="card p-fluid">
                            <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Τιμολογίου</span></Divider></div>

                            <div className="field">
                                <label htmlFor="name1">Κωδικός Τιμολογίου</label>
                                <div className="control">
                                    <InputText id="invoice_number" type="text" value={invoice_number} onChange={(e) => setInvoice_Number(e.target.value)} />
                                </div>
                            </div>
                            {/* <h1>{console.log(selectedParadoteaDetails)}</h1> */}
                            {/* <div className="field">
                                <label className="label">Εργα</label>
                                <div className="control">
                                    
                                    <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
                                        <option value="" disabled>Επιλέξτε Εργο</option>
                                        {uniqueErga.map((ergo, index) => (
                                            <option key={index} value={ergo.erga.id} disabled>{ergo.erga.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}
                            <div className="field">
                                <label className="label">Εργα</label>
                                <div className="control">
                                    {uniqueErga2.length>0 && <div><InputText id="ergo"className="input" value={uniqueErga2[0].erga.name} readOnly disabled/>
                                    {/*<label htmlFor="ergo">{uniqueErga2[0].erga.name}</label>*/}</div>}
                                    
                                    
                                    {/* <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
                                        <option value="" disabled>Επιλέξτε Εργο</option>
                                        {uniqueErga.map((ergo, index) => (
                                            <option key={index} value={ergo.erga.id} disabled>{ergo.erga.name}</option>
                                        ))}
                                    </select> */}
                                </div>
                            </div>

                            {/* <div className="field">
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
                            </div> */}
                            <div className="field">
                                <label className="label">Παραδοτεα</label>
                                <CustomToast  txtmsg="Υπαρχει η δυνατότητα τιμολόγισης ενός η και περισόττερων παραδοτέων που αφορούν το ίδιο Εργο"/>

                                <div className="control">
                                    <Select
                                        isMulti
                                        value={selectedOptions}
                                        onChange={handleParadoteaChange2}
                                        options={options2}
                                        placeholder="Επιλέξτε Παραδοτεα"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ποσό τιμολογίου  (καθαρή αξία)</label>
                                <div className="control">
                                <InputNumber className="input" value={totalAmmount} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_no_tax(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly disabled /> 
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ποσό Φ.Π.Α.</label>
                                <div className="control">
                                <InputNumber className="input" value={totalAmmountVat} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_Tax_Incl(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly disabled/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Πληρωτέο</label>
                                <div className="control">
                                <InputNumber className="input" value={totalAmmountTotal} mode="decimal" minFractionDigits={2}  onChange={(e)=> setAmmount_Of_Income_Tax_Incl(e.value)} placeholder='ΠΟΣΟ ΧΩΡΙΣ ΦΠΑ' readOnly disabled/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ημερομηνία έκδοσης τιμολογίου</label>
                                <div className="control">
                                <Calendar id="invoice_date"  value={new Date(invoice_date)} onChange={(e)=> setInvoice_date(e.target.value)}  inline showWeek />

                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)</label>
                                <div className="control">
                                <Calendar id="actual_payment_date"  value={new Date(actual_payment_date)} onChange={(e)=> setActual_Payment_Date(e.target.value)} inline showWeek />                                </div>
                            </div>

                            {/* <div className="field">
                                <label className="label">Πληρωτέο</label>
                                <div className="control">
                                    <InputText type="text" className="input" value={ammount_of_income_tax_incl} onChange={(e) => setAmmount_Of_Income_Tax_Incl(e.target.value)} />
                                </div>
                            </div> */}

                            <div className="field">
                                <label className="label">Σχόλια</label>
                                <div className="control">
                                    <InputTextarea value={comments} onChange={(e) => setComments(e.target.value)} />
                                </div>
                            </div>

                            {/* <div className="field">
                                <label className="label">Κατάσταση Πληρωμής</label>
                                <div className="control">
                                <InputText type="text" className="input" value={status_paid} onChange={(e)=> setStatus_Paid(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΤΙΜΟΛΟΓΙΟΥ'/>                                </div>
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
           

                            <div className="field">
                                <Button type="submit" label="Ενημέρωση Τιμολογίου" disabled={selectedOptions.length === 0} />
                            </div>

                            {msg && <div className="notification is-danger">{msg}</div>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormEditTimologia;
