import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditTimologia = () =>{
    const[invoice_date,setInvoice_date]=useState("");
    const[ammount_no_tax,setAmmount_no_tax]=useState("");
    const[ammount_tax_incl,setAmmount_Tax_Incl]=useState("");
    const[actual_payment_date,setActual_Payment_Date]=useState("");
    const[ammount_of_income_tax_incl,setAmmount_Of_Income_Tax_Incl]=useState("");
    const[comments,setComments]=useState("");
    const[invoice_number,setInvoice_Number]=useState("");


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
                setAmmount_no_tax(response.data.ammount_no_tax);
                setAmmount_Tax_Incl(response.data.ammount_tax_incl);
                setActual_Payment_Date(response.data.actual_payment_date);
                setAmmount_Of_Income_Tax_Incl(response.data.ammount_of_income_tax_incl);
                setComments(response.data.comments);
                setInvoice_Number(response.data.invoice_number);
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
                ammount_no_tax:ammount_no_tax,
                ammount_tax_incl:ammount_tax_incl,
                actual_payment_date: actual_payment_date,
                ammount_of_income_tax_incl: ammount_of_income_tax_incl,
                comments: comments,
                invoice_number: invoice_number
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
                        <label  className="label">ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ</label>
                        <div className="control">
                            <input type="text" className="input" value={invoice_number} onChange={(e)=> setInvoice_Number(e.target.value)} placeholder='ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ'/>
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