import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import apiBaseUrl from '../../apiConfig';
import Select from 'react-select';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';
import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
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
            setInvoice_Date(response.data.ypoxreoseis.invoice_date);
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

    return (
        <div>
            <h1 className='title'>Επεξεργασία Υποχρέωσης</h1>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={updateYpoxreoseis}>
                            <p className='has-text-centered'>{msg}</p>
                            <div className="field">
                                <label className="label">Όνομα Παρόχου</label>
                                <div className="control">
                                    <input type="text" className="input" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder='Όνομα Παρόχου' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                                <div className="control">
                                    <input type="date" className="input" value={invoice_date} onChange={(e) => setInvoice_Date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΧΡΕΩΣΗΣ</label>
                                <div className="control">
                                    <input type="text" className="input" value={total_owed_ammount} onChange={(e) => setTotal_Owed_Ammount(e.target.value)} placeholder='ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΧΡΕΩΣΗΣ' />
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
                                <label className="label">Tags</label>
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
                                <label className="label">ΠΟΣΟ ΦΠΑ</label>
                                <div className="control">
                                    <input type="text" className="input" value={ammount_vat} onChange={(e) => setAmmount_Vat(e.target.value)} placeholder='ΠΟΣΟ ΦΠΑ' />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type="submit" className="button is-success is-fullwidth">Ενημέρωση</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditYpoxreoseis;