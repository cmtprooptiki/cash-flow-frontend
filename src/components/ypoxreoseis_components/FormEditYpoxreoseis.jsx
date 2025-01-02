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
import { InputNumber } from 'primereact/inputnumber';
import { format } from 'date-fns';

const FormEditYpoxreoseis = ({ id, onHide }) => {
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
    const navigate = useNavigate();

    useEffect(() => {
        getErga();
        getTags();
        getYpoxreoseisById();
    }, []);

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
        const response = await axios.get(`${apiBaseUrl}/erga`, {timeout: 5000});
        setErga(response.data);
    };

    const getTags = async () => {
        const response = await axios.get(`${apiBaseUrl}/tags`, {timeout: 5000});
        setTags(response.data);
    };

    const getYpoxreoseisById = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery/${id}`, {timeout: 5000});
            setProvider(response.data.ypoxreoseis.provider);
            setErga_Id(response.data.ypoxreoseis.erga_id);
            setInvoice_Date(formatDateToInput(response.data.ypoxreoseis.invoice_date));
            setTotal_Owed_Ammount(response.data.ypoxreoseis.total_owed_ammount);
            setAmmount_Vat(response.data.ypoxreoseis.ammount_vat);

            const response2 = await axios.get(`${apiBaseUrl}/ypotags/${id}`, {timeout: 5000})
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
    // Convert dates to UTC format before sending to the server
    const formatToUTC = (date) => {
        return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
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
                invoice_date: formatToUTC(invoice_date),
                total_owed_ammount: total_owed_ammount,
                ammount_vat: ammount_vat,
                tags_id: tagIds
            });
            onHide();
            window.location.reload();
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
                        <div className="field">
                            <label className="label">Ποσό (σύνολο)</label>
                            <div className="control">
                            <InputNumber id="totalAmmount" className="input" mode="decimal" minFractionDigits={2} value={total_owed_ammount} onChange={(e) => setTotal_Owed_Ammount(e.value)} readOnly disabled/>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Ποσό  ΦΠΑ</label>
                            <div className="control">
                            <InputNumber  id="percentagevat" className="input" mode="decimal" minFractionDigits={2} value={ammount_vat} onChange={(e)=> setAmmount_Vat(e.value)} readOnly disabled/>

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
    );
};

export default FormEditYpoxreoseis;