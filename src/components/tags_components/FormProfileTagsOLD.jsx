import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

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
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossorigin="anonymous" />
<div className="container">
    <div className="row">
      <div className="col-lg-5 col-md-6">
        <div className="mb-2 d-flex" style={{zIndex:"10"}}>
        </div>
        <div className="mb-2 d-flex">

        </div>

        
        
      </div>
      <div className="col-lg-7 col-md-6 pl-xl-3">
        
        <div className='box'>
          <div className="mb-2 d-flex">
            <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >Διαχείριση Tag</h2>
            
          </div>
        
        <div className="mb-2 d-flex">
          
          <ul className="list-unstyled">
            <li className="media">
              <span className="w-5 text-black font-weight-normal"> ΟΝΟΜΑ TAG: &nbsp;</span><label className="media-body"> {name}</label>
            </li>
           

          </ul>
        </div>
        
       
          

          </div>
    
      </div>


      
    </div>
  </div>
		</div>
    )
}

export default FormProfileTags