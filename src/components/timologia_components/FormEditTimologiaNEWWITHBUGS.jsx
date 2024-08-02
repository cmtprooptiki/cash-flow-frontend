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

const FormEditTimologia = () => {
    const [invoice_date, setInvoice_date] = useState("");
    const [ammount_no_tax, setAmmount_no_tax] = useState("");
    const [ammount_tax_incl, setAmmount_Tax_Incl] = useState("");
    const [actual_payment_date, setActual_Payment_Date] = useState("");
    const [ammount_of_income_tax_incl, setAmmount_Of_Income_Tax_Incl] = useState("");
    const [comments, setComments] = useState("");
    const [invoice_number, setInvoice_Number] = useState("");
    const [status_paid, setStatus_Paid] = useState("");

    const [erga_id, setErga_id] = useState(null);
    const [erga, setErga] = useState([]);
    const [paradotea, setParadoteaByErgo] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedParadoteaDetails, setSelectedParadoteaDetails] = useState([]);

    const handleErgaChange = async (e) => {
        const selectedId = e.target.value;
        setErga_id(selectedId);
        clearFormFields();
        if (selectedId) {
            try {
                const response = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${selectedId}`);
                const paradoteaByErgoId = response.data;
                setParadoteaByErgo(paradoteaByErgoId)
            } catch (error) {
                console.error("Error fetching timologio data:", error);
            }
        }
    };

    const clearFormFields = () => {
        setSelectedOptions([]);
        setSelectedParadoteaDetails([]);
    }

    const handleParadoteaChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        console.log("Selected option paradotea CHANGE", selectedOptions)

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

    const { totalAmmount, totalAmmountVat, totalAmmountTotal } = calculateTotalAmounts();

    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timologioResponse = await axios.get(`${apiBaseUrl}/timologia/${id}`);
                const timologioData = timologioResponse.data;

                const paradoteaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`);
                const paradoteaData = paradoteaResponse.data

                const ergaResponse = await axios.get(`${apiBaseUrl}/getParadoteoAndErgoByTimologio/${id}`);
                const ergaData = ergaResponse.data;

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
            console.log("The response: ", response)
            await Promise.all(selectedParadoteaDetails.map(async (paradoteo) => {
                console.log("on promise.", paradoteo.id)
                await axios.patch(`${apiBaseUrl}/UpdateTimologia_idFromParadotea/${paradoteo.id}`, {
                    "timologia_id": timologiaId
                });
            }));

            console.log("Done")

            navigate("/timologia");
        }
        catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Remove duplicates from erga
    const uniqueErga = Array.from(new Set(erga.map(ergo => ergo.erga.id)))
        .map(id => {
            return erga.find(ergo => ergo.erga.id === id);
        });

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

                            <div className="field">
                                <label className="label">Εργα</label>
                                <div className="control">
                                    <select className="input" onChange={(e) => handleErgaChange(e)} defaultValue="">
                                        <option value="" disabled>Επιλέξτε Εργο</option>
                                        {uniqueErga.map((ergo, index) => (
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
                                    <InputText type="text" className="input" value={totalAmmount} readOnly />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Σύνολο Φ.Π.Α.</label>
                                <div className="control">
                                    <InputText type="text" className="input" value={totalAmmountVat} readOnly />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Σύνολο Τελικό Ποσό</label>
                                <div className="control">
                                    <InputText type="text" className="input" value={totalAmmountTotal} readOnly />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ημερομηνία Τιμολογίου</label>
                                <div className="control">
                                <Calendar id="invoice_date"  value={new Date(invoice_date)} onChange={(e)=> setInvoice_date(e.target.value)}  inline showWeek />

                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ημερομηνία Εξόφλισης</label>
                                <div className="control">
                                <Calendar id="actual_payment_date"  value={new Date(actual_payment_date)} onChange={(e)=> setActual_Payment_Date(e.target.value)} inline showWeek />                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Ποσό Φόρου Εισοδήματος</label>
                                <div className="control">
                                    <InputText type="text" className="input" value={ammount_of_income_tax_incl} onChange={(e) => setAmmount_Of_Income_Tax_Incl(e.target.value)} />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Σχόλια</label>
                                <div className="control">
                                    <InputTextarea value={comments} onChange={(e) => setComments(e.target.value)} />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Κατάσταση Πληρωμής</label>
                                <div className="control">
                                <InputText type="text" className="input" value={status_paid} onChange={(e)=> setStatus_Paid(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΤΙΜΟΛΟΓΙΟΥ'/>                                </div>
                            </div>

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

export default FormEditTimologia;
