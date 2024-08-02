import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import { Divider } from 'primereact/divider';

const FormAddCustomer = () => {
    const[name,setName]=useState("");
    const[afm,setAfm]=useState("");
    const[phone,setPhone]=useState("");
    const[email,setEmail]=useState("");
    const[address,setAddress]=useState("");
    const[postal_code,setPostalCode]=useState("")

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
            name:name,
            afm:afm,
            phone:phone,
            email:email,
            address:address,
            postal_code:postal_code
            });
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

                <p className='has-text-centered'>{msg}</p>
                    <div className="field">
                        <label  htmlFor="name"  className="label">Επωνυμία</label>
                        <div className="control">
                            
                        <InputText  id="name" type="text" className="input" value={name} onChange={(e)=> setName(e.target.value)} placeholder='Επωνυμία'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Α.Φ.Μ.</label>
                        <div className="control">
                            <InputText  id="afm" className="input" value={afm} onChange={handleChange} placeholder='Α.Φ.Μ.' />
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
                        <InputText id="email" value={email}   className={isValid ? '' : 'p-invalid'} onChange={handleChangeEmail} placeholder="Enter your email"
                                />
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
                        <label  className="label">Τ.Κ.</label>
                        <div className="control">
                        <InputText
          id="postalCodeInput"
          value={postal_code}
          onChange={handleChangePostalCode}
          className={isValidPostal ? '' : 'p-invalid'}
          placeholder="Enter postal code"
        />    
              {!isValidPostal && <small className="p-error">Invalid Postal Code format</small>}
                  
          </div>
                    </div>

                    
                    
                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-success is-fullwidth">Προσθήκη</button>
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