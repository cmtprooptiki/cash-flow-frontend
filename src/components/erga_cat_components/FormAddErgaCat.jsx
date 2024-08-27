import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

import Select from 'react-select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';


const FormAddErgaCat = () => {
    const[name,setName]=useState("");
    const[msg,setMsg]=useState("");



    const navigate = useNavigate();

    const saveErgo = async (e) =>{
        e.preventDefault();
        try{
            await axios.post(`${apiBaseUrl}/ergacat`, {
            name:name,
            });
            navigate("/ergacat");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

  return (
    <div >
        <h1 className='title'>Προσθήκη Νέας Κατηγορίας Έργου</h1>
        <form onSubmit={saveErgo}>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="card p-fluid">
                        <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Κατηγορίας Έργου</span></Divider></div>

                        <div className="field">
                            <label className="label">Ονομασία Κατηγορίας Έργου</label>
                            <div className="control">
                                <InputText id="name" type="text" value={name} onChange={(e)=> setName(e.target.value)} />

                            </div>
                        </div>

                         <div className="field">
                            <div className="control">
                                <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                            </div>
                        </div>
 
                    </div>

                </div>
            </div>
        </form>
        </div>
  )
}

export default FormAddErgaCat