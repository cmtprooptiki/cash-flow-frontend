import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';

const FormEditCustomer= () => {
    const [previewImage, setPreviewImage] = useState('');
    const [logoImage, setLogoImage] = useState(null);
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

    const [isValid, setIsValid] = useState(true);
    const [isValidPostal, setIsValidPostal] = useState(true);





    const[msg,setMsg]=useState("");



    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getCustomerById = async()=>{
            try {
                const response=await axios.get(`${apiBaseUrl}/customer/${id}`, {timeout: 5000});
                setLogoImage(response.data.logoImage);
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

    const updateCustomer= async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/customer/${id}`, {
                logoImage:logoImage,
                name:name,
                afm:afm,
                doy:doy,
                epagelma:epagelma,
                phone:phone,
                email:email,
                address:address,
                postal_code:postal_code,
                website:website,
                facebookUrl:facebookUrl,
                twitterUrl:twitterUrl,
                linkedInUrl:linkedInUrl,
                instagramUrl:instagramUrl
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        
        );

            navigate("/customer");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };



    const handleChangePostalCode = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric characters
        setPostalCode(numericValue);
        validatePostalCode(numericValue);
      };
      const validatePostalCode = (code) => {
        // Simple validation: check if the postal code is 5 digits long
        const isValidCode = code.length === 5;
        setIsValidPostal(isValidCode);
      };


    const handleChangeEmail = (e) => {
      const value = e.target.value;
      setEmail(value);
      validateEmail(value);
    };
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(email));
    };
  
    const handleSubmit = () => {
      if (isValid) {
        alert('Email is valid: ' + email);
      } else {
        alert('Invalid email format');
      }
    };

    const handleChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setAfm(numericValue);
      };


      
    const handleChangePhone = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setPhone(numericValue);
      };
    const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setLogoImage(selectedFile); // Update state for server-side update

    // Preview the selected image immediately
    const reader = new FileReader();
    reader.onloadend = () => {
        setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
    };






  return (
    <div>
 <h1 className='title'>Διαχείριση Πελάτη</h1>
 <h2 className='subtitle'>Επεξεργασία Πελάτη</h2>     
 <form onSubmit={updateCustomer}>
        <div className="grid">
            <div className="col-12 md:col-6">
            <div className="card p-fluid">

                <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Πελάτη</span></Divider></div>

                <div className="field col-6">

                <div className='mt-auto'>
                 {previewImage ? ( // Conditionally render preview image if available
                     <Avatar image={previewImage} shape="circle" size="xlarge" />
                 ) : (
                     logoImage ? ( // Otherwise, if profileImage URL exists, render it directly
                     <Avatar
                         image={`${apiBaseUrl}/${logoImage}`}
                         shape="circle"
                         size="xlarge"
                     />
                     ) : ( // Default placeholder if no image is available
                     <Avatar shape="circle" size="xlarge" icon="pi pi-user" />
                     
                     )
                 )}
                 </div>

                <label className="label">Λογότυπο Έργου</label> {/* New field for profile image */}
                <div className="control">
                    <input type="file" className="input" onChange={handleImageChange} accept="image/*" />
                </div>

                </div>

                <p className='has-text-centered'>{msg}</p>
                <div className="field">
                <label  htmlFor="name"  className="label">Πελάτης</label>
                <div className="control">
                    <InputText  id="name" type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='Επωνυμία'/>
                </div>
                </div>

                <div className="field">
                <label  className="label">ΑΦΜ</label>
                <div className="control">
                    <InputText  id="afm" className="input" value={afm} onChange={handleChange} placeholder='Α.Φ.Μ.' />
                </div>
                </div>

                <div className="field">
                <label  className="label">Δ.Ο.Υ.</label>
                <div className="control">
                    <InputText  id="doy" className="input" value={doy} onChange={(e)=>setDoy(e.target.value)} placeholder='Δ.Ο.Υ.' />
                </div>
                </div>

                <div className="field">
                <label  className="label">Επάγγελμα</label>
                <div className="control">
                    <InputText  id="epagelma" className="input" value={epagelma} onChange={(e)=>setEpagelma(e.target.value)} placeholder='Α.Φ.Μ.' />
                </div>
                </div>

                <div className="field">
                <label  className="label">Τηλέφωνο</label>
                <div className="control">
                    <InputText  id="phone" className="input" value={phone} onChange={handleChangePhone}  placeholder='Τηλέφωνο'/>
                </div>
                </div>

                <div className="field">
                <label  className="label">Email</label>
                <div className="control">
                <InputText id="email" value={email}   className={isValid ? '' : 'p-invalid'} onChange={handleChangeEmail} placeholder="Enter your email"/>
                    {!isValid && <small className="p-error">Invalid email format</small>}
                </div>
                </div>

                <div className="field">
                <label  className="label">Διεύθυνση</label>
                <div className="control">
                    <InputText  id="address" type="text" className="input" value={address} onChange={(e)=> setAddress(e.target.value)} placeholder='Διεύθυνση'/>
                </div>
                </div>

                <div className="field">
                <label  className="label">Ταχυδρομικός κωδικός</label>
                <div className="control">
                <InputText
                    id="postalCodeInput"
                    value={postal_code}
                    onChange={handleChangePostalCode}
                    className={isValidPostal ? '' : 'p-invalid'}
                    placeholder="Enter postal code"
                />    
                    {!isValidPostal && <small className="p-error">Λανθασμένος Ταχυδρομικός Κώδικας</small>}
                </div>
                </div>

                <div className="field">
                <label  className="label">Ιστοσελίδα</label>
                <div className="control">
                    <InputText  id="website" type="text" className="input" value={website} onChange={(e)=> setWebsite(e.target.value)} placeholder='website'/>
                </div>
                </div>
                <div className="field">
                <label  className="label"><i className='pi pi-facebook'/></label>
                <div className="control">
                    <InputText  id="facebookUrl" type="text" className="input" value={facebookUrl} onChange={(e)=> setFacebookUrl(e.target.value)} placeholder='facebook'/>
                </div>
                </div>
                <div className="field">
                <label  className="label"><i className='pi pi-twitter'/></label>
                <div className="control">
                    <InputText  id="twitterUrl" type="text" className="input" value={twitterUrl} onChange={(e)=> setTwitterUrl(e.target.value)} placeholder='twitter'/>
                </div>
                </div>
                <div className="field">
                <label  className="label"><i className='pi pi-linkedin'/></label>
                <div className="control">
                    <InputText  id="linkedInUrl" type="text" className="input" value={linkedInUrl} onChange={(e)=> setLinkedInUrl(e.target.value)} placeholder='linkedIn'/>
                </div>
                </div>
                <div className="field">
                <label  className="label"><i className='pi pi-instagram'/></label>
                <div className="control">
                    <InputText  id="instagramUrl" type="text" className="input" value={instagramUrl} onChange={(e)=> setInstagramUrl(e.target.value)} placeholder='instagram'/>
                </div>
                </div>

                <div className="field">
                    <div className="control">
                    <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    
    </form>
</div>
  )
}

export default FormEditCustomer