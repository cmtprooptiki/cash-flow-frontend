import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'


const FormEditErgoCat= () => {
    const[name,setName]=useState("");
    const[msg,setMsg]=useState("");


    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getErgoCatById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/ergacat/${id}`, {timeout: 5000});
                setName(response.data.name);
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getErgoCatById();
    },[id]);

    const updateErgoCat = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/ergacat/${id}`, {
                name:name,
            });

            navigate("/ergacat");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
  return (
    <div>
        <h1 className='title'>Διαχείριση Εργων</h1>
        <h2 className='subtitle'>Επεξεργασία Κατηγορίας Εργου</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateErgoCat}>
                    <p className='has-text-centered'>{msg}</p>
                <div className="field">
                        <label  className="label">ΟΝΟΜΑ ΚΑΤΗΓΟΡΙΑΣ ΕΡΓΟΥ</label>
                        <div className="control">
                            <input type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='ΟΝΟΜΑ ΕΡΓΟΥ'/>
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

export default FormEditErgoCat