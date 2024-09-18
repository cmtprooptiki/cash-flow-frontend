import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import apiBaseUrl from '../../apiConfig';
import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';

const FormEditYpoxreoseis = () => {
    const [provider, setProvider] = useState("");
    const [erga_id, setErga_Id] = useState(null);
    const [erga, setErga] = useState([]);
    const [invoice_date, setInvoice_Date] = useState("");
    const [total_owed_ammount, setTotal_Owed_Ammount] = useState("");
    const [ammount_vat, setAmmount_Vat] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [msg, setMsg] = useState("");
    const [tagError, setTagError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getErga();
        getTags();
        getYpoxreoseisById();
    }, []);

    // useEffect(() => {
    //     if (erga.length > 0) {
    //         // Step 1: Filter the rows where timologia_id equals the given id
    //         const filteredErga = erga.filter(ergo => ergo.timologia_id === parseInt(id));
    
    //         // Step 2: Create a Set to ensure unique erga names and map the filtered array
    //         const uniqueErga = Array.from(new Set(filteredErga.map(ergo => ergo.erga.id)))
    //         .map(id => {      
    //             return filteredErga.find(ergo => ergo.erga.id === id);
    //         });
    
    //         setUniqueErga2(uniqueErga);
    //         //console.log(uniqueErga2)
            
    //     }
    //     }, [erga, id]);
    // useEffect(()=>{
    //     if(uniqueErga2.length>0){
    //         handleErgaStart(uniqueErga2[0]);
    //     }
    // },[uniqueErga2,id])

    const formatDateToInput = (dateString) => {
        console.log("YEEYHAHA: ", dateString)
        if(dateString === null || dateString =="" || dateString === NaN){
            return null
        }
        dateString=dateString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const getErga = async () => {
        const response = await axios.get(`${apiBaseUrl}/erga`);
        setErga(response.data);
    };

    const getTags = async () => {
        const response = await axios.get(`${apiBaseUrl}/tags`);
        setTags(response.data);
    };

    const getYpoxreoseisById = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery/${id}`);
            setProvider(response.data.ypoxreoseis.provider);
            setErga_Id(response.data.ypoxreoseis.erga_id);
            setInvoice_Date(formatDateToInput(response.data.ypoxreoseis.invoice_date));
            setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
            setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);

            const response2 = await axios.get(`${apiBaseUrl}/ypotags/${id}`)
            const formattedTags = response2.data.map(tag => ({
            value: tag.id,
            label: tag.name
        }));
        setSelectedTags(formattedTags);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions);
        if (selectedOptions.length > 0) {
            setTagError("");
        }
    };

    const updateYpoxreoseis = async (e) => {
        e.preventDefault();
        if (selectedTags.length === 0) {
            setTagError("Please select at least one tag.");
            return;
        }
        try {
            const tagIds = selectedTags.map(tag => tag.value);
            await axios.patch(`${apiBaseUrl}/ypoquery/${id}`, {
                provider: provider,
                erga_id: erga_id,
                invoice_date: invoice_date,
                total_owed_ammount: total_owed_ammount,
                ammount_vat: ammount_vat,
                tags_id: tagIds
            });
            navigate("/ypoquery");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const tagOptions = tags.map(tag => ({
        value: tag.id,
        label: tag.name
    }));

    const clearInvoiceDate = (e) => {
        e.preventDefault();  // Prevent form submission
        setInvoice_Date(null); // Clear the calendar date
    };



    return (


        <div >
        <h1 className='title'>Διαχείριση Υποχρέωσης</h1>
        <h2 className='subtitle'>Επεξεργασία Υποχρέωσης</h2>
        <form onSubmit={updateYpoxreoseis}>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="card p-fluid">
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Υποχρέωσης</span></Divider></div>

                        <div className="field">
                            <label htmlFor="name1">Προμηθευτής-έξοδο</label>
                            <div className="control">
                                <InputText id="provider" type="text" value={provider} onChange={(e) => setProvider(e.target.value)} />
                            </div>
                        </div>

                        <div className="field">
                                <label className="label">Εργα</label>
                                <div className="control">
                                    <select className="input" value={erga_id} onChange={(e) => setErga_Id(e.target.value)}>
                                        <option value="" disabled>Επιλέξτε Εργο</option>
                                        {erga.map((ergo, index) => (
                                            <option key={index} value={ergo.id}>{ergo.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        {/* <h1>{console.log(selectedParadoteaDetails)}</h1> */}
                        {/* <div className="field">
                                <label className="label">Εργα</label>
                                <div className="control">
                                    <select className="input" value={erga_id} onChange={(e) => setErga_Id(e.target.value)}>
                                        <option value="" disabled>Επιλέξτε Εργο</option>
                                        {erga.map((ergo, index) => (
                                            <option key={index} value={ergo.id}>{ergo.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
             */}

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
                            <label className="label">Ποσό (σύνολο)</label>
                            <div className="control">
                                <InputText type="text" className="input" value={total_owed_ammount}  />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Ποσό  ΦΠΑ</label>
                            <div className="control">
                                <InputText type="text" className="input" value={ammount_vat} readOnly />
                            </div>
                        </div>

                        <div className="field">
                                 <label className="label">Ετικέτες</label>
                                <div className="control">
                                    <Select
                                        isMulti
                                        value={selectedTags}
                                       onChange={handleTagChange}
                                        options={tagOptions}
                                       placeholder="Επιλέξτε Tags"
                                       classNamePrefix="react-select"
                                     />
                                     {tagError && <p className="help is-danger">{tagError}</p>}
                               </div>
                             </div>

                        <div className="field">
                            <label className="label">Ημερομηνία τιμολογίου</label>
                            <div className="control">
                            <Calendar id="invoice_date"  value={invoice_date} onChange={(e)=> setInvoice_Date(e.target.value)}  inline showWeek />

                            </div>
                            <div className="control">
                                <Button label="Clear" onClick={clearInvoiceDate} className="p-button-secondary mt-2" type="button"/>
                            </div>

                            
                            <Divider></Divider>
                        </div>
                        <Divider></Divider>
                        <Divider></Divider>


                       

                        <div className="field">
                            <Button type="submit" label="Ενημέρωση Τιμολογίου" />
                        </div>

                        {msg && <div className="notification is-danger">{msg}</div>}
                    </div>
                </div>
            </div>
        </form>
    </div>
        // <div>
        //     <h1 className='title'>Επεξεργασία Υποχρέωσης</h1>
        //     <div className="card is-shadowless">
        //         <div className="card-content">
        //             <div className="content">
        //                 <form onSubmit={updateYpoxreoseis}>
        //                     <p className='has-text-centered'>{msg}</p>
        //                     <div className="field">
        //                         <label className="label">Όνομα Παρόχου</label>
        //                         <div className="control">
        //                             <input type="text" className="input" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder='Όνομα Παρόχου' />
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <label className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
        //                         <div className="control">
        //                             <input type="date" className="input" value={invoice_date} onChange={(e) => setInvoice_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ' />
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <label className="label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΧΡΕΩΣΗΣ</label>
        //                         <div className="control">
        //                             <input type="text" className="input" value={total_owed_ammount} onChange={(e) => setTotal_Owed_Ammount(e.target.value)} placeholder='ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΧΡΕΩΣΗΣ' />
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <label className="label">Εργα</label>
        //                         <div className="control">
        //                             <select className="input" value={erga_id} onChange={(e) => setErga_Id(e.target.value)}>
        //                                 <option value="" disabled>Επιλέξτε Εργο</option>
        //                                 {erga.map((ergo, index) => (
        //                                     <option key={index} value={ergo.id}>{ergo.name}</option>
        //                                 ))}
        //                             </select>
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <label className="label">Tags</label>
        //                         <div className="control">
        //                             <Select
        //                                 isMulti
        //                                 value={selectedTags}
        //                                 onChange={handleTagChange}
        //                                 options={tagOptions}
        //                                 placeholder="Επιλέξτε Tags"
        //                                 classNamePrefix="react-select"
        //                             />
        //                             {tagError && <p className="help is-danger">{tagError}</p>}
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <label className="label">ΠΟΣΟ ΦΠΑ</label>
        //                         <div className="control">
        //                             <input type="text" className="input" value={ammount_vat} onChange={(e) => setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ' />
        //                         </div>
        //                     </div>
        //                     <div className="field">
        //                         <div className="control">
        //                             <button type="submit" className="button is-success is-fullwidth">Ενημέρωση</button>
        //                         </div>
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};

export default FormEditYpoxreoseis;