import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'


const FormEditCustomer= () => {
    const[name,setName]=useState("");
    const[afm,setAfm]=useState("");
    const[phone,setPhone]=useState("");
    const[email,setEmail]=useState("");
    const[address,setAddress]=useState("");
    const[postal_code,setPostalCode]=useState("")


    const[msg,setMsg]=useState("");



    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getCustomerById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/customer/${id}`, {timeout: 5000});
                setName(response.data.name);
                setAfm(response.data.afm);
                setPhone(response.data.phone);
                setEmail(response.data.email);
                setAddress(response.data.address);
                setPostalCode(response.data.postal_code);

            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getCustomerById();
    },[id]);

    const updateCustomer= async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/customer/${id}`, {
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
    };
  return (
    <div>
        <h1 className='title'>Διαχείριση Πελάτων</h1>
        <h2 className='subtitle'>Επεξεργασία Πελάτη</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateCustomer}>
                    <p className='has-text-centered'>{msg}</p>
                <div className="field">
                        <label  className="label">ΕΠΩΝΥΜΙΑ</label>
                        <div className="control">
                            <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΕΠΩΝΥΜΙΑ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Α.Φ.Μ.</label>
                        <div className="control">
                            <input type="text" className="input" value={afm} onChange={(e)=> setAfm(e.target.value)} placeholder='Α.Φ.Μ.'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">ΤΗΛΕΦΩΝΟ</label>
                        <div className="control">
                            <input type="text" className="input" value={phone} onChange={(e)=> setPhone(e.target.value)} placeholder='ΤΗΛΕΦΩΝΟ'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">EMAIL</label>
                        <div className="control">
                            <input type="text" className="input" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='EMAIL'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">ΔΙΕΥΘΗΝΣΗ</label>
                        <div className="control">
                            <input type="text" className="input" value={address} onChange={(e)=> setAddress(e.target.value)} placeholder='ΔΙΕΥΘΗΝΣΗ'/>
                        </div>
                    </div>

                    <div className="field">
                        <label  className="label">Τ.Κ.</label>
                        <div className="control">
                            <input type="text" className="input" value={postal_code} onChange={(e)=> setPostalCode(e.target.value)} placeholder='Τ.Κ.'/>
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

export default FormEditCustomer