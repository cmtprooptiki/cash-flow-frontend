import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';

import 'bootstrap/dist/css/bootstrap.min.css';

import apiBaseUrl from '../../apiConfig';

const FormProfileTags = () =>
{
    const [name, setName] = useState("");

    const[msg,setMsg]=useState("");

    const{id} = useParams();

    useEffect(()=>{
        const getTagsById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/tags/${id}`);
                setName(response.data.name);
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getTagsById();
    }, [id]);

    return(

    <div>
        <div className="surface-0">
  
            <div className="font-medium text-3xl text-900 mb-3">Tags</div>
            <div className="text-500 mb-5">Στοιχεία</div>
        </div>
        <Divider />
        <div className="grid">
        
            <div className="text-500 w-6 md:w-2 font-medium">Ονομα Tag</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{name}</div>
           
            

        </div>
    </div>
    )
}

export default FormProfileTags;