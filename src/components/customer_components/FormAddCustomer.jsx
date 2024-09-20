import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import { Divider } from 'primereact/divider';

const FormAddCustomer = () => {
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


  const[msg,setMsg]=useState("");
  
  const [isValid, setIsValid] = useState(true);
  const [isValidPostal, setIsValidPostal] = useState(true);

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

  const navigate = useNavigate();

  const saveCustomer = async (e) =>{
    e.preventDefault();
    try{
        await axios.post(`${apiBaseUrl}/customer`, {
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
  }

return (
  <div>
    <h1 className='title'>Προσθήκη Πελάτη</h1>
    <form onSubmit={saveCustomer}>
      <div className="grid">
        <div className="col-12 md:col-6">
          <div className="card p-fluid">

            <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Πελάτη</span></Divider></div>

            <div className="field col-6">
              <label className="label">Λογότυπο Έργου</label> {/* New field for profile image */}
              <div className="control">
                <input type="file" className="input" onChange={(e) => setLogoImage(e.target.files[0])} accept="image/*" />
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

export default FormAddCustomer