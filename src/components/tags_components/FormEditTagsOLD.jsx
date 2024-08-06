import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const FormEditTags = () =>
{
    const[name,setName]=useState("");
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

    useEffect(()=>{
        const getTagsById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/tags/${id}`);
                setName(response.data.name);
                console.log(name)
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        }
        getTagsById();
    },[id]);

    const updateTag = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/tags/${id}`, {
                name:name
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
            <h1 className='title'>Διαχείριση Tag</h1>
            <h2 className='subtitle'>Ενημέρωση Tag</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                    <form onSubmit={updateTag}>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field">
                            <label  className="label">Όνομα Tag</label>
                            <div className="control">
                                <input type="text" className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Όνομα tag'/>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button type='submit' className="button is-success is-fullwidth">Ενημέρωση</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
      )

}

export default FormEditTags;