import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddCustomer = () => {
    const[name,setName]=useState("");
    const[afm,setAfm]=useState("");
    const[phone,setPhone]=useState("");
    const[email,setEmail]=useState("");
    const[address,setAddress]=useState("");
    const[postal_code,setPostalCode]=useState("")

    const[msg,setMsg]=useState("");


    const navigate = useNavigate();

    const saveCustomer = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/customer`, {
            name:name,
            afm:afm,
            phone:phone,
            email:email,
            address:address,
            postal_code:postal_code
            });
            navigate("/customer");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

  return (
    <div>
        <h1 className='title'>Προσθήκη Πελάτη</h1>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={saveCustomer}>
                <p className='has-text-centered'>{msg}</p>
                <div className="field">
                        <label  className="label">ΕΠΩΝΥΜΙΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Α.Φ.Μ.</label>
                        <div className="control">
                            <input type="text" className="input" value={afm} onChange={(e)=> setAfm(e.target.value)} placeholder='ΠΟΣΟ ΣΥΜΒΑΣΗΣ (€) ΧΩΡΙΣ Φ.Π.Α.'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΤΗΛΕΦΩΝΟ</label>
                        <div className="control">
                            <input type="text" className="input" value={phone} onChange={(e)=> setPhone(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΓΡΑΦΗΣ ΣΥΜΒΑΣΗΣ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">EMAIL</label>
                        <div className="control">
                            <input type="text" className="input" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='ΚΑΤΑΣΤΑΣΗ ΕΡΓΟΥ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΔΙΕΥΘΗΝΣΗ</label>
                        <div className="control">
                            <input type="text" className="input" value={address} onChange={(e)=> setAddress(e.target.value)} placeholder='ΗΜΕΡΟΜΗΝΙΑ ΕΝΑΡΞΗΣ(εκτίμηση)'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Τ.Κ.</label>
                        <div className="control">
                            <input type="text" className="input" value={postal_code} onChange={(e)=> setPostalCode(e.target.value)} placeholder='PROJECT MANAGER'/>
                        </div>
                    </div>

                    
                    
                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-success is-fullwidth">Προσθήκη</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormAddCustomer