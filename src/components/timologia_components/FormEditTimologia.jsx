import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditTimologia = () =>{
    const[invoice_date,setInvoice_date]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("");
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("");
    const[ammount_no_tax,setAmmount_no_tax]=useState("");
    const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
    const[estimate_tax,setEstimate_Tax]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState("");
    const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
    const[comments,setComments]=useState("");
    const[verified,setVerified]=useState("");


    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getTimologioById = async() =>{
            const response=await axios.get(`${apiBaseUrl}/timologia/${id}`);
            try
            {
                const response=await axios.get(`${apiBaseUrl}/timologia/${id}`);
                setInvoice_date(response.data.invoice_date);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2);
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3);
                setAmmount_no_tax(response.data.ammount_no_tax);
                setAmmount_Tax_Incl(response.data.ammount_tax_incl);
                setEstimate_Tax(response.data.estimate_tax);
                setActual_Payment_Date(response.data.actual_payment_date);
                setAmmount_Of_Income_Tax_Incl(response.data.ammount_of_income_tax_incl);
                setComments(response.data.comments);
                setVerified(response.data.verified);
            }
            catch(error)
            {
                setMsg(error.response.data.msg);
            }
        };
        getTimologioById();
    },[id]);

    const updateTimologio = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axios.patch(`${apiBaseUrl}/timologia/${id}`, {
                invoice_date:invoice_date,
            estimate_payment_date:estimate_payment_date,
            estimate_payment_date_2:estimate_payment_date_2,
            estimate_payment_date_3:estimate_payment_date_3,
            ammount_no_tax:ammount_no_tax,
            ammount_tax_incl:ammount_tax_incl,
            estimate_tax: estimate_tax,
            actual_payment_date: actual_payment_date,
            ammount_of_income_tax_incl: ammount_of_income_tax_incl,
            comments: comments,
            verified: verified
            });

            navigate("/timologia");
        }
        catch(error)
        {
            if(error.response)
            {
                setMsg(error.response.data.msg);
            }
        }
    };
    return(
        <div>
        <h1 className='title'>Διαχείριση Τιμολογίων</h1>
        <h2 className='subtitle'>Επεξεργασία Τιμολογίων</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateTimologio}>
                    <p className='has-text-centered'>{msg}</p>
                <div className="field">
                        <label  className="label">ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={invoice_date} onChange={(e)=> setInvoice_date(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={estimate_payment_date} onChange={(e)=> setEstimate_Payment_Date(e.target.value)} placeholder='ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ.'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 2</label>
                        <div className="control">
                            <input type="text" className="input" value={estimate_payment_date_2} onChange={(e)=> setEstimate_Payment_Date_2(e.target.value)} placeholder='ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 2'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 3</label>
                        <div className="control">
                            <input type="text" className="input" value={estimate_payment_date_3} onChange={(e)=> setEstimate_Payment_Date_3(e.target.value)} placeholder='ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 3'/>
                        </div>
                    </div>

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

                    <div className="field">
                        <label  className="label">ΕΚΤΙΜΩΜΕΝΟ ΦΠΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={estimate_tax} onChange={(e)=> setEstimate_Tax(e.target.value)} placeholder='ΕΚΤΙΜΩΜΕΝΟ ΦΠΑ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={actual_payment_date} onChange={(e)=> setActual_Payment_Date(e.target.value)} placeholder='ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α</label>
                        <div className="control">
                            <input type="text" className="input" value={ammount_of_income_tax_incl} onChange={(e)=> setAmmount_Of_Income_Tax_Incl(e.target.value)} placeholder='ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΠΑΡΑΤΗΡΗΣΕΙΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={comments} onChange={(e)=> setComments(e.target.value)} placeholder='ΠΑΡΑΤΗΡΗΣΕΙΣ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ</label>
                        <div className="control">
                            <input type="text" className="input" value={verified} onChange={(e)=> setVerified(e.target.value)} placeholder='ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ'/>
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
    )

}

export default FormEditTimologia