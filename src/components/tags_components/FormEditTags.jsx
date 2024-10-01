import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
const FormEditTags = ()=>
{
    const[name,setName]=useState("");
    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

    useEffect(()=>{
        const getTagsById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/tags/${id}`, {timeout: 5000});
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

    return(
        <div>
        <h1 className='title'>Διαχείριση Τags</h1>
        <h2 className='subtitle'>Επεξεργασία Tags</h2>
        <div className="card is-shadowless">
            <div className="card-content">
                <div className="content">
                <form onSubmit={updateTag}>
                    <p className='has-text-centered'>{msg}</p>

                    <div className="field">
                                <label className="label">Ονομασία Tag</label>
                                <div className="control">
                                    <InputTextarea value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>

                    <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
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