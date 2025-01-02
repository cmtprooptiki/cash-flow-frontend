import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';

import { Divider } from 'primereact/divider';

import 'bootstrap/dist/css/bootstrap.min.css';
import apiBaseUrl from '../../apiConfig';
import { Avatar } from 'primereact/avatar';


const FormProfileCustomer= ({id, onHide}) => {
  const [previewImage, setPreviewImage] = useState('');
  const[logoImage,setLogoImage]=useState("");
  const[name,setName]=useState("");
  const[afm,setAfm]=useState("");
  const[doy,setDoy]=useState("");
  const[epagelma,setEpagelma]=useState("");
  const[phone,setPhone]=useState("");
  const[email,setEmail]=useState("");
  const[address,setAddress]=useState("");
  const[postal_code,setPostalCode]=useState("")
  const[website,setWebsite]=useState("")
  const[facebookUrl,setFacebookUrl]=useState("")
  const[twitterUrl,setTwitterUrl]=useState("")
  const[linkedInUrl,setLinkedInUrl]=useState("")
  const[instagramUrl,setInstagramUrl]=useState("")


    const[msg,setMsg]=useState("");

    useEffect(()=>{
      const getCustomerById = async()=>{
        try {
            const response=await axios.get(`${apiBaseUrl}/customer/${id}`, {timeout: 5000});
            setLogoImage(response.data.logoImage)
            setName(response.data.name);
            setAfm(response.data.afm);
            setDoy(response.data.doy);
            setEpagelma(response.data.epagelma);
            setPhone(response.data.phone);
            setEmail(response.data.email);
            setAddress(response.data.address);
            setPostalCode(response.data.postal_code);
            setWebsite(response.data.website);
            setFacebookUrl(response.data.facebookUrl);
            setTwitterUrl(response.data.twitterUrl);
            setLinkedInUrl(response.data.linkedInUrl);
            setInstagramUrl(response.data.instagramUrl);
            if (response.data.logoImage) {
                setPreviewImage(`${apiBaseUrl}/${response.data.logoImage}`); // Construct full image URL
            }

        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
    getCustomerById();
    },[id]);



    return (
	
<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Πελάτης</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Λογότυπο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{logoImage}</div>
            {logoImage ? ( // Otherwise, if profileImage URL exists, render it directly
                     <Avatar
                         image={`${apiBaseUrl}/${logoImage}`}
                         shape="circle"
                         size="xlarge"
                     />
                     ) : ( // Default placeholder if no image is available
                     <Avatar shape="circle" size="xlarge" icon="pi pi-user" />
                     )}
            
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Πελάτης</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{name}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">ΑΦΜ:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{afm}</div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Δ.Ο.Υ:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{doy}</div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Επάγγελμα:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{epagelma}</div>
        </li>
 

        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Τηλέφωνο</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{phone}</div>
          
        </li>
  
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Email</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{email}</div>
          
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Διεύθυνση</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{address}</div>
          
        </li>
   
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ταχυδρομικός κωδικός</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{postal_code}</div>
          
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">website</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{website}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">facebook</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{facebookUrl}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">twitter</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{twitterUrl}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">linkedIn</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{linkedInUrl}</div>
           
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Instagram</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{instagramUrl}</div>
           
        </li>
       
    </ul>
</div>
<Divider />

</div>
	);

  
}

export default FormProfileCustomer;