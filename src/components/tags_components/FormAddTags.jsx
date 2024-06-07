import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormAddTags = () =>
{
    const[name,setName]=useState("");

    const[msg,setMsg]=useState("");
    const navigate = useNavigate();

    const saveTags = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/tags`, {
                name:name,
            });
            navigate("/tags");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div>
            <h1 className='title'>Διαχείριση Χρηστών</h1>
            <h2 className='subtitle'>Προσθήκη νέου χρήστη</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                    <form onSubmit={saveTags}>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field">
                            <label  className="label">Όνομα Tag</label>
                            <div className="control">
                                <input type="text" className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Όνομα Tag'/>
                            </div>
                        </div>
                        
                        <div className="field">
                            <div className="control">
                                <button type='submit' className="button is-success is-fullwidth">Προσθήκη</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
      )
}

export default FormAddTags;